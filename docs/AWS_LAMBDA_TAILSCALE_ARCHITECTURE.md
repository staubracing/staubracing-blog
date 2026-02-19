# AWS Lambda + Tailscale Architecture Plan

**Status:** Research/Decision Phase
**Created:** 2026-02-18
**Goal:** Deploy moto-lambda-API to AWS Lambda with Tailscale connectivity to Raspberry Pi PostgreSQL

---

## Context

### Current Architecture

```
┌─────────────────┐┌──────────────────┐┌─────────────────┐
│ staubracing.com │ ──► │ serverless offline│ ──► │ Pi PostgreSQL│
│ (Astro on S3)│     │ (local dev machine)│     │ (Tailscale)    │
└─────────────────┘└──────────────────┘└─────────────────┘
```

**Current Setup:**
- Serverless Framework v4, Node.js 20.x, TypeScript
- PostgreSQL via `pg` library with connection pooling
- API key authentication via `x-api-key` header
- Runs locally with `serverless offline --host 0.0.0.0`
- Database connection already uses Tailscale (db.ts comment confirms)
- staubracing.com maintenance form connects to this local API

**Limitations:**
- Requires dev machine to be running for production site to work
- Not accessible when dev machine is offline
- No automatic scaling or high availability

### Proposed Architecture

```
┌─────────────────┐┌──────────────────────────────┐┌─────────────────┐
│ staubracing.com │ ──► │ AWS Lambda + Tailscale Ext│ ──► │ Pi PostgreSQL│
│ (Astro on S3)│     │ (SOCKS5: localhost:1055)    │     │ (Tailscale IP)│
└─────────────────┘└──────────────────────────────┘└─────────────────┘
```

**Benefits:**
- Always-available API endpoint
- No dependency on dev machine
- Automatic scaling via Lambda
- Secure connection through Tailscale (no public database exposure)

---

## Technical Background

### How Tailscale on Lambda Works

`★ Key Concept: Userspace Networking`

Lambda functions run in containers without kernel access, so Tailscale cannot create traditional VPN tunnels. Instead:

1. `tailscaled` runs in **userspace networking mode**
2. Exposes a **SOCKS5 proxy on localhost:1055**
3. Application code routes traffic through this proxy
4. Proxy encrypts and routes via WireGuard to Tailscale network

```shell
# Bootstrap process
tailscaled --tun=userspace-networking --socks5-server=localhost:1055 &
tailscale up --auth-key=${TAILSCALE_AUTHKEY}
ALL_PROXY=socks5://localhost:1055/ ./my-app
```

### The PostgreSQL + SOCKS5 Challenge

The `pg` Node.js library does **not** natively support SOCKS5 proxies:
- HTTP libraries respect `ALL_PROXY` environment variable
- PostgreSQL uses raw TCP sockets
- `pg` has no built-in proxy configuration

**Solutions:**
1. Custom stream factory with SOCKS5 agent
2. Local TCP forwarder process
3. Server-side proxy (pgproxy)

---

## Option A: Container Image Lambda + SOCKS5 Stream

### Overview

Deploy Lambda as a container image with Tailscale extension pre-installed. Modify the PostgreSQL connection to route through SOCKS5 proxy.

### Architecture

```
API Gateway
│
▼
┌─────────────────────────────────────┐
│ Lambda Container Image│
│ ┌─────────────┐┌─────────────┐ │
│ │ Tailscale│────►│ App Code    │ │
│ │ Extension│     │ (modified)  │ │
│ │ (SOCKS5)    │     │             │ │
│ └─────────────┘└─────────────┘ │
└─────────────────────────────────────┘│▼
Tailscale Network│▼
Pi PostgreSQL
```

### Implementation Steps

1. **Create Dockerfile with Tailscale extension**

```dockerfile
FROM public.ecr.aws/lambda/nodejs:20.x
# Install Tailscale extension (one line!)
COPY --from=ghcr.io/rails-lambda/tailscale-extension-amzn:1 /opt /opt

# Copy application
COPY dist/ ${LAMBDA_TASK_ROOT}/
COPY node_modules/ ${LAMBDA_TASK_ROOT}/node_modules/
COPY package.json ${LAMBDA_TASK_ROOT}/

# Set environment variables for Tailscale
ENV TAILSCALE_AUTHKEY=placeholder
ENV ALL_PROXY=socks5://localhost:1055/

CMD ["src/handlers/maintenance/findAll.handler"]
```

2. **Modify db.ts for SOCKS5**

```typescript
import pg from 'pg';
import { SocksProxyAgent } from 'socks-proxy-agent';

const { Pool } = pg;

// Check if running in Lambda with Tailscale
const useTailscale = process.env.TAILSCALE_AUTHKEY !== undefined;

let poolConfig: IPoolConfig = {
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST, // Pi's Tailscale IP (100.x.y.z)
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

if (useTailscale) {
  const socksAgent = new SocksProxyAgent('socks5://localhost:1055');
  poolConfig = {
    ...poolConfig,
    // pg doesn't have a direct stream option, need alternative approach
    // See: https://github.com/brianc/node-postgres/issues/1035
  };
}

const pool = new Pool(poolConfig);
export default pool;
```

**Note:** The `pg` library's SOCKS5 support requires additional research. May need:
- `pg` with custom `stream` factory
- Or a TCP forwarder running alongside the app

3. **Update serverless.yml for container deployment**

```yaml
provider:
  name: aws
  ecr:
    images:
      moto-api:
        path: ./
        file: Dockerfile

functions:
  findAllMaintenance:
    image: moto-api
    events:
      - http:
          path: maintenance
          method: get
    environment:
      TAILSCALE_AUTHKEY: ${ssm:/moto-api/tailscale-auth-key}
      DATABASE_HOST: 100.x.y.z  # Pi's Tailscale IP
```

4. **Store secrets in AWS Systems Manager Parameter Store**
   - `TAILSCALE_AUTHKEY` - Tailscale auth key
   - `DATABASE_PASSWORD` - PostgreSQL password

### Pros
- Single deployment unit (container image)
- Official Tailscale extension supported
- No changes to Pi infrastructure
- Full control over runtime environment

### Cons
- More complex db.ts modification required
- `pg` + SOCKS5 compatibility needs testing
- Larger deployment package
- Cold start includes Tailscale connection time (~2-5 sec)

### Estimated Cost
- Lambda: ~$3/month for 1M requests
- ECR storage: ~$1/month
- API Gateway: ~$3.50/month for 1M requests
- **Total: ~$7-10/month**

---

## Option B: pgproxy on Raspberry Pi

### Overview

Run Tailscale's `pgproxy` on the Raspberry Pi. This creates a PostgreSQL-compatible endpoint that only accepts Tailscale connections. Lambda connects via standard PostgreSQL protocol through the SOCKS5 proxy.

### Architecture

```
API Gateway
│
▼
┌─────────────────────────────────────┐
│ Lambda Container Image│
│ ┌─────────────┐┌─────────────┐ │
│ │ Tailscale│────►│ App Code    │ │
│ │ Extension│     │ (unchanged) │ │
│ │ (SOCKS5)    │     │             │ │
│ └─────────────┘└─────────────┘ │
└─────────────────────────────────────┘│
│ SOCKS5 through Tailscale
▼
┌─────────────────────────────────────┐
│ Raspberry Pi│
│ ┌─────────────┐┌─────────────┐ │
│ │ pgproxy     │────►│ PostgreSQL  │ │
│ │ :5433       │     │ :5432       │ │
│ └─────────────┘└─────────────┘ │
└─────────────────────────────────────┘
```

### Implementation Steps

1. **Install pgproxy on Raspberry Pi**

```bash
# On Pi - install Go if not present
sudo apt install golang-go

# Build pgproxy
go install tailscale.com/cmd/pgproxy@latest

# Create systemd service
sudo cat > /etc/systemd/system/pgproxy.service << EOF
[Unit]
Description=Tailscale PostgreSQL Proxy
After=network.target tailscaled.service

[Service]
Type=simple
ExecStart=/home/pi/go/bin/pgproxy --listen=100.x.y.z:5433 --upstream=localhost:5432
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable pgproxy
sudo systemctl start pgproxy
```

2. **Lambda Dockerfile (same as Option A)**

```dockerfile
FROM public.ecr.aws/lambda/nodejs:20.x
COPY --from=ghcr.io/rails-lambda/tailscale-extension-amzn:1 /opt /opt
# ... rest of Dockerfile
```

3. **db.ts remains mostly unchanged**

```typescript
const poolConfig: IPoolConfig = {
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,  // Pi's Tailscale IP
  port: 5433, // pgproxy port (not 5432)
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  // Standard PostgreSQL connection - SOCKS5 handled by ALL_PROXY env var
};
```

**Key Insight:** With pgproxy, the connection is standard PostgreSQL. The SOCKS5 proxy (set via `ALL_PROXY` by the Tailscale extension) handles routing to the Pi's Tailscale IP.

4. **Environment Variables**
   - `DATABASE_HOST`: Pi's Tailscale IP (100.x.y.z)
   - `DATABASE_PORT`: 5433 (pgproxy port)
   - `ALL_PROXY`: Set automatically by Tailscale extension

### Pros
- No modification to `pg` connection code
- Standard PostgreSQL protocol
- pgproxy adds security layer (only Tailscale clients can connect)
- Cleaner separation of concerns

### Cons
- Additional process to manage on Pi
- Another point of failure
- Need to ensure pgproxy stays running
- Slightly more complex Pi setup

### Estimated Cost
- Same as Option A: ~$7-10/month
- No additional cost for pgproxy (runs on existing Pi)

---

## Option C: Tailscale Funnel

### Overview

Keep your local serverless setup, but expose it publicly using Tailscale Funnel. Funnel provides a public HTTPS URL that routes to a service on your Tailscale network.

### Architecture

```
┌─────────────────┐
│ staubracing.com │
└────────┬────────┘│
         ▼
┌─────────────────┐
│ Tailscale Funnel│
│ (public URL)    │
└────────┬────────┘│
         ▼
┌──────────────────────────────────┐
│ Your Dev Machine (Tailscale)     │
│ ┌─────────────────────────────┐  │
│ │ serverless offline│  │
│ │ http://localhost:3000       │  │
│ └─────────────────────────────┘  │
└──────────────────────────────────┘│▼
┌─────────────────┐
│ Pi PostgreSQL│
└─────────────────┘
```

### Implementation Steps

1. **Enable Funnel on your Tailscale node**

```bash
# On your dev machine
tailscale funnel 3000
```

2. **This creates a public URL like:**
   - `https://node-name.tailnet-name.ts.net`

3. **Update staubracing.com to use Funnel URL**

```typescript
// In staubracing.com admin page
const API_BASE = 'https://your-node.tailnet-name.ts.net/dev';
```

### Pros
- Zero infrastructure changes
- No AWS Lambda deployment needed
- Quick to test and implement
- No additional cost

### Cons
- Dev machine must stay online
- Funnel has rate limits and usage restrictions
- Not suitable for production workloads
- No automatic scaling
- Dependent on home internet connection

### Estimated Cost
- Free (included with Tailscale personal account)
- But: reliability depends on dev machine uptime

---

## Decision Matrix

| Factor | Option A | Option B | Option C |
|--------|----------|----------|----------|
| **Complexity** | Medium | Medium-High | Low |
| **Reliability** | High | High | Low |
| **Pi Changes** | None | Install pgproxy | None |
| **Code Changes** | db.ts modification | Minimal | None |
| **Cost/month** | ~$7-10 | ~$7-10 | Free |
| **Scalability** | Auto-scales | Auto-scales | None |
| **Cold Start** | ~3-5 sec | ~3-5 sec | N/A |
| **Maintenance** | Low | Medium (pgproxy) | N/A |

---

## Technical Questions to Resolve

### For All Options
1. What is the Raspberry Pi's Tailscale IP address?
2. Should we deploy all Lambda functions or just maintenance endpoints?
3. Do you want to keep the local serverless option for development?

### For Option A (Container + SOCKS5)
1. Need to test `pg` + `socks-proxy-agent` compatibility
2. May need alternative approach if direct SOCKS5 doesn't work

### For Option B (pgproxy)
1. Is Go already installed on the Pi?
2. Do you want pgproxy to start automatically on boot?

### For Option C (Funnel)
1. Is dev machine uptime acceptable for this use case?
2. What happens if dev machine goes offline?

---

## Next Steps

1. **Decide on approach** (A, B, or C)
2. **Gather prerequisites:**
   - Pi's Tailscale IP
   - Tailscale auth key (reusable, or set up OAuth)
   - AWS account access for Lambda deployment
3. **Test the chosen approach**
4. **Update staubracing.com** to use new API endpoint
5. **Document the setup** for future reference

---

## References

- [Tailscale on AWS Lambda Docs](https://tailscale.com/kb/1113/aws-lambda)
- [AWS Blog: Webhook Forwarder with Tailscale](https://aws.amazon.com/blogs/compute/building-a-secure-webhook-forwarder-using-an-aws-lambda-extension-and-tailscale/)
- [rails-lambda/tailscale-extension](https://github.com/rails-lambda/tailscale-extension)
- [Tailscale pgproxy](https://tailscale.com/blog/introducing-pgproxy)
- [socks-proxy-agent npm](https://www.npmjs.com/package/socks-proxy-agent)
