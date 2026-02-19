# Claude Code Prompt: Migrate moto-lambda-API to Pi + Cloudflare Zero Trust Auth

## Context

I have an existing Node.js/TypeScript API built with Serverless Framework v4 called `moto-lambda-API`. It currently runs locally via `serverless offline` and connects to a PostgreSQL database on a Raspberry Pi via Tailscale. I'm migrating it to run permanently on the Pi itself as a standalone Express/Node process managed by pm2, exposed publicly through a Cloudflare Tunnel.

The frontend is an Astro site hosted on S3 at staubracing.com. The admin page lives at `staubracing.com/admin/maintenance` and performs full CRUD operations (create, read, update, delete maintenance records) against this API.

Current auth is a static `x-api-key` header. We are replacing this with **Cloudflare Zero Trust Access JWT validation**.

---

## How Cloudflare Zero Trust Works in This Setup

The `/admin` route on staubracing.com is protected by a Cloudflare Access policy. When a user visits it, Cloudflare intercepts the request, requires login (email OTP or OAuth), and issues a signed JWT stored as a cookie called `CF_Authorization`. Every subsequent request from the browser to the API automatically includes this JWT in the `Cf-Access-Jwt-Assertion` header.

The API validates this JWT server-side using Cloudflare's public keys (fetched from a well-known endpoint). If the JWT is missing or invalid, the request is rejected.

Cloudflare's public key endpoint:
```
https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/certs
```

The JWT `aud` (audience) claim must match the Cloudflare Access Application AUD tag.

---

## Tasks

### 1. Refactor API to run as a standalone Express server

- Add Express as a dependency if not already present
- Create `src/server.ts` as the new entry point
- Mount all existing route handlers from the serverless functions onto Express routes, preserving the same URL paths
- Keep all existing handler logic intact, only change the transport layer
- Port configurable via `PORT` environment variable, default `3001`
- Server must bind to `127.0.0.1` only, NOT `0.0.0.0`

### 2. Add Cloudflare Access JWT middleware

Create `src/middleware/cloudflareAccess.ts`:

- Install `cloudflare-access-jwt` or use `jsonwebtoken` + `jwks-rsa` to validate the JWT
- On every request, check for the `Cf-Access-Jwt-Assertion` header
- Fetch Cloudflare's public keys from `https://${CF_TEAM_NAME}.cloudflareaccess.com/cdn-cgi/access/certs`
- Validate the JWT signature, expiration, and `aud` claim against `CF_ACCESS_AUD` env variable
- On failure return `401 Unauthorized` with JSON body `{ error: "Unauthorized" }`
- Apply middleware globally to all routes
- In `NODE_ENV=development`, skip JWT validation and log a warning so local dev works without Cloudflare

### 3. Update db.ts for localhost connection

The API and PostgreSQL are now on the same machine. Remove any Tailscale IP or SOCKS5 proxy logic. Update the connection config to use:
- `host: process.env.DATABASE_HOST` defaulting to `localhost`
- `port: process.env.DATABASE_PORT` defaulting to `5432`

### 4. Environment variables

Update `.env.example` with all required variables and clear comments:

```env
# Server
NODE_ENV=production
PORT=3001

# Cloudflare Zero Trust
CF_TEAM_NAME=your-team-name          # e.g. "devstaub" from devstaub.cloudflareaccess.com
CF_ACCESS_AUD=your-application-aud   # AUD tag from Cloudflare Access application settings

# Database (now localhost on Pi)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
```

Remove the old `API_KEY` or `x-api-key` variables.

### 5. pm2 ecosystem config

Create `ecosystem.config.js` at the project root for running on the Pi:

```js
module.exports = {
  apps: [{
    name: 'moto-api',
    script: 'dist/server.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
```

### 6. Build and start scripts

Add to `package.json`:
```json
"scripts": {
  "build": "tsc",
  "start": "node dist/server.js",
  "start:pm2": "pm2 start ecosystem.config.js",
  "dev": "ts-node src/server.ts"
}
```

---

## What NOT to change

- Existing route handler logic and database query logic
- PostgreSQL schema or migrations
- The Astro frontend (no changes needed there, Cloudflare handles auth at the edge)
- Serverless Framework config (keep for reference, but it is no longer the deployment method)

---

## Notes

- Do not use `any` types in TypeScript
- Keep middleware modular, one file per concern
- Log validation failures with enough context to debug (timestamp, route, reason) but never log JWT contents
- The Cloudflare Access AUD and team name will be provided after the Cloudflare Zero Trust application is created in the dashboard, placeholder env vars are fine for now
