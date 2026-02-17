# Maintenance Quick-Capture for staubracing.com

## Context

**Goal:** A quick way to "jot down" maintenance tasks from the web — phone or desktop. A simple authenticated form that captures ideas and stores them for later.

**User Requirements:**
- Works on both phone (garage) and desktop
- Quick form with 2-3 fields (not full detail)
- Eventually syncs to mobile app database
- Needs authentication (only you can add)

---

## Current Status: ✅ WORKING (Local Dev)

**What's functional:**
- ✅ Login page at `/admin/login`
- ✅ Maintenance form at `/admin/maintenance`
- ✅ Add tasks with title, bike, priority, notes
- ✅ Toggle task completion
- ✅ Recent tasks list with bike names
- ✅ API key authentication
- ✅ Logout functionality

**What's pending:**
- ⏳ Remote access (Tailscale routing issue)
- ⏳ Production deployment (AWS Lambda + HTTPS)

---

## Architecture

```
Web Form (Astro) → Lambda API (localhost:3000) → PostgreSQL (Docker on Pi)
```

**For production:**
```
Web Form (HTTPS) → AWS API Gateway (HTTPS) → PostgreSQL (Docker on Pi)
```

---

## Implementation Details

### Database Table

Located in `moto_db_local` on the Pi's PostgreSQL Docker container.

```sql
CREATE TABLE maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bike_id UUID REFERENCES motorcycles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    notes TEXT,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Bike UUIDs (for form dropdown)

```
d8454deb-4ac6-4ed3-8c46-255c293685f4 → KX450F (2014)
9f803ba6-27db-4f7c-8403-7118b5b49035 → Z125 (2018)
37053aac-a94d-43d4-a523-43c8b9fc6686 → ZX6R (2009)
```

---

## Files Created

### staubracing.com (Website)

| File | Description |
|------|-------------|
| `src/pages/admin/login.astro` | API key entry, stores in localStorage |
| `src/pages/admin/maintenance.astro` | Quick-capture form + task list |

### moto-lambda-API (Backend)

| File | Description |
|------|-------------|
| `src/types/maintenanceFields.ts` | TypeScript interfaces |
| `src/models/Maintenance.ts` | Database CRUD operations |
| `src/handlers/maintenance/create.ts` | POST /maintenance |
| `src/handlers/maintenance/findAll.ts` | GET /maintenance |
| `src/handlers/maintenance/update.ts` | PATCH /maintenance/{id} |
| `serverless.yml` | Route definitions + API key env var |

---

## API Endpoints

### POST /maintenance
Create a new task.

### GET /maintenance
List all tasks.

### PATCH /maintenance/{id}
Update a task (e.g., toggle completion).

All endpoints require `x-api-key` header.

---

## Running Locally

1. **Start the Lambda server** (on Pi):
   ```bash
   cd /home/staub-racing/Projects/Mobile-Apps/MotoAppPro/moto-lambda-API
   yarn start:offline-local
   ```

2. **Start the Astro dev server**:
   ```bash
   cd /home/staub-racing/Projects/Websites/staubracing.com
   yarn dev
   ```

3. **Access the form**:
   ```
   http://localhost:4321/admin/login
   ```

---

## Known Issues

### Tailscale Routing
- Accessing API via Tailscale IP (100.85.179.68:3000) returns wrong routes
- Works fine via localhost:3000
- Needs investigation or deploy to AWS for remote access

### Mixed Content
- Production site (HTTPS) can't call HTTP API
- Solution: Deploy Lambda to AWS API Gateway (provides HTTPS)

---

## Next Steps

1. **Deploy Lambda to AWS** - Get HTTPS endpoint for production
2. **Set `MAINTENANCE_API_URL` env var** - Point to AWS API Gateway
3. **Debug Tailscale** - Or skip if AWS deployment works
4. **Mobile app sync** - Connect React Native app to same endpoints

---

## Status

| Phase | Status |
|-------|--------|
| Planning | ✅ Complete |
| Database Schema | ✅ Complete |
| Lambda API Endpoints | ✅ Complete |
| Web Login Page | ✅ Complete |
| Web Form Page | ✅ Complete |
| Task Completion Toggle | ✅ Complete |
| Local Testing | ✅ Working |
| Remote Access (Tailscale) | ⏳ Issue found |
| Production Deployment | ⏳ Pending |

**Last Updated:** 2026-02-17
