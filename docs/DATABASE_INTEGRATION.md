# Maintenance Quick-Capture for staubracing.com

## Context

**Goal:** A quick way to "jot down" maintenance tasks from the web — phone or desktop. A simple authenticated form that captures ideas and stores them for later.

**User Requirements:**
- Works on both phone (garage) and desktop
- Quick form with 2-3 fields (not full detail)
- Eventually syncs to mobile app database
- Needs authentication (only you can add)

**Current State:**
- Website: Static Astro site with `src/data/maintenance.json`
- Mobile App: React Native with Lambda API + PostgreSQL
- No write capability from web today

---

## Chosen Approach: Real-Time Database Writes

Form posts to your Lambda API, writes directly to PostgreSQL.

```
Web Form → Lambda API (public) → PostgreSQL
```

**Mobile sync deferred** — same database will be used by mobile app later.

**What this enables:**
- Instant writes from web (no rebuild needed)
- Single source of truth in PostgreSQL
- Mobile app can connect to same table whenever ready

---

## Implementation Steps

### Step 1: Create `maintenance_records` Table ✅ DONE (Manual)

Run this SQL on your PostgreSQL database:

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

### Step 2: Add Public POST Endpoint to Lambda API ⏳ NEXT

Add to `serverless.yml`:
```yaml
functions:
  maintenanceCreate:
    handler: src/handlers/maintenance/create.handler
    events:
      - http:
          path: maintenance
          method: post
          cors: true
  maintenanceList:
    handler: src/handlers/maintenance/findAll.handler
    events:
      - http:
          path: maintenance
          method: get
          cors: true
```

Add simple API key auth:
```typescript
// In handler
const apiKey = event.headers['x-api-key'];
if (apiKey !== process.env.MAINTENANCE_API_KEY) {
  return { statusCode: 401, body: 'Unauthorized' };
}
```

### Step 3: Create Authenticated Form Page ✅ DONE

**Files created:**
- `src/pages/admin/login.astro` — Simple API key entry page
- `src/pages/admin/maintenance.astro` — Quick-capture form

**Form fields:**
1. Title (required) — "Change oil on R6"
2. Bike (dropdown) — populated from `bikes.json`
3. Priority — High / Medium / Low

**Auth:** API key stored in localStorage

### Step 4: Test End-to-End ⏳ PENDING

1. Visit `/admin/login` on phone or desktop
2. Enter API key
3. Submit a task
4. Verify it appears in PostgreSQL

---

## Files Created/Modified

### staubracing.com (Website) ✅ DONE

| File | Status |
|------|--------|
| `src/pages/admin/login.astro` | ✅ Created |
| `src/pages/admin/maintenance.astro` | ✅ Created |

### moto-lambda-API (Backend) ⏳ TODO

| File | Status |
|------|--------|
| `src/types/maintenanceFields.ts` | ⏳ Create |
| `src/models/Maintenance.ts` | ⏳ Create |
| `src/handlers/maintenance/create.ts` | ⏳ Create |
| `src/handlers/maintenance/findAll.ts` | ⏳ Create |
| `serverless.yml` | ⏳ Modify |

---

## API Contract

### POST /maintenance

**Headers:**
```
Content-Type: application/json
x-api-key: <your-api-key>
```

**Body:**
```json
{
  "title": "Change oil on KX450F",
  "bike_id": "uuid-or-null",
  "priority": "medium",
  "notes": "Use 10W-40"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Change oil on KX450F",
  "bike_id": "uuid",
  "priority": "medium",
  "notes": "Use 10W-40",
  "completed": false,
  "created_at": "2026-02-16T12:00:00Z"
}
```

### GET /maintenance

**Headers:**
```
x-api-key: <your-api-key>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Change oil on KX450F",
    "bike_id": "uuid",
    "priority": "medium",
    "notes": "Use 10W-40",
    "completed": false,
    "created_at": "2026-02-16T12:00:00Z"
  }
]
```

---

## Later: Mobile App Connection

When ready to connect the mobile app:
- Mobile app uses same API endpoints
- Bi-directional sync (add from phone, see on web, and vice versa)
- Add UPDATE/DELETE endpoints for full CRUD

---

## Status

| Phase | Status |
|-------|--------|
| Planning | ✅ Complete |
| Database Schema | ✅ Ready (run SQL on Pi) |
| Web Login Page | ✅ Complete |
| Web Form Page | ✅ Complete |
| Lambda API Endpoints | ⏳ Next step |
| Testing | ⏳ Pending |

**Last Updated:** 2026-02-16
