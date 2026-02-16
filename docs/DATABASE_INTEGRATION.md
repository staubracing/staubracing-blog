# Database Integration: MotoAppPro ↔ staubracing.com

## Context

**Goal:** Share the PostgreSQL database (running on Raspberry Pi at home) between the MotoAppPro mobile app and staubracing.com website. Enable real maintenance tracking that syncs across both platforms.

**Current State:**
- **Website:** Static Astro site, uses `src/data/maintenance.json` for task tracking, deployed to AWS S3/CloudFront
- **Mobile App:** React Native Expo app with Lambda API backend, PostgreSQL on Raspberry Pi
- **Database:** 6 tables (users, motorcycles, tire_info, tracks, bike_settings, suspension)
- **Gap:** Mobile app has `MaintenanceRecord` TypeScript type but **no database table** yet

**Decisions:**
- ✅ Build-time fetching (default approach - simpler, keeps site static)
- ✅ Use Tailscale for GitHub Actions → Lambda API connectivity
- ✅ Plan only for now, implement later

---

## Two Approaches

### Option A: Build-Time Fetch (Default - Recommended to Start)

**How it works:** During `yarn build`, Astro fetches data from your Lambda API and bakes it into static pages.

```
PostgreSQL (Pi) → Lambda API → GitHub Actions (build) → S3/CloudFront (static)
```

**When to use:** Maintenance data, bike specs, any content that doesn't change minute-to-minute.

**Pros:** Keeps site static, free hosting, simple.

**Cons:** Data only updates when site rebuilds.

### Option B: Real-Time (If Needed Later)

**How it works:** Page fetches live data from your API either on the client or server-side.

```
User Browser → JavaScript fetch() → Lambda API (public) → PostgreSQL
```

**When to use:** Live race data, real-time dashboards, instant sync requirements.

**Requirements:**
- Lambda API must be publicly accessible (via AWS API Gateway with auth)
- Add CORS headers to allow cross-origin requests
- Consider caching to reduce load on your Pi

**Implementation:**
1. Expose Lambda via AWS API Gateway
2. Add authentication (API key or JWT)
3. Create client-side component that fetches on mount:
   ```astro
   <script>
     const data = await fetch('https://api.staubracing.com/maintenance');
     // render data
   </script>
   ```

---

## Chosen Approach: Build-Time Fetch via Tailscale

**How it works:** During `yarn build`, Astro fetches data from your Lambda API and bakes it into static pages.

**Architecture:**
```
PostgreSQL (Pi) → Lambda API → GitHub Actions (build) → S3/CloudFront (static)
```

**Pros:**
- Keeps site fully static, fast, free hosting
- No changes to current deployment
- API only needs to be accessible at build time (not publicly)
- Simple to implement

**Cons:**
- Data only updates when site rebuilds (on push or scheduled)
- Not "real-time" - but maintenance doesn't need to be

**Implementation:**
1. Create `maintenance_records` table in PostgreSQL
2. Add GET endpoint to Lambda API
3. In Astro, use `fetch()` in page frontmatter during build
4. Configure GitHub Actions to reach Lambda API (Tailscale or public endpoint)

**Effort:** ~2-3 hours

---

## Implementation Steps (When Ready)

### Step 1: Create `maintenance_records` Table

Run this SQL on your PostgreSQL database:

```sql
CREATE TABLE maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bike_id UUID REFERENCES motorcycles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,  -- oil_change, tire_change, brake_service, etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cost DECIMAL(10,2),
    mileage INTEGER,
    service_date DATE,
    completed BOOLEAN DEFAULT false,
    priority VARCHAR(20) DEFAULT 'medium',  -- high, medium, low
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX maintenance_records_bike_idx ON maintenance_records(bike_id);
```

### Step 2: Add Lambda API Endpoints

In `moto-lambda-API/`:

| File | Purpose |
|------|---------|
| `src/models/Maintenance.ts` | Model with CRUD operations |
| `src/handlers/maintenance/findAll.ts` | GET /maintenance |
| `src/handlers/maintenance/findByBike.ts` | GET /maintenance/bike/{bikeId} |
| `src/handlers/maintenance/create.ts` | POST /maintenance |
| `src/handlers/maintenance/update.ts` | PUT /maintenance/{id} |
| `src/handlers/maintenance/delete.ts` | DELETE /maintenance/{id} |

Update `serverless.yml` with new routes.

### Step 3: Configure Tailscale for GitHub Actions

Add to GitHub Actions workflow:

```yaml
- name: Install Tailscale
  run: |
    curl -fsSL https://tailscale.com/install.sh | sh
    sudo tailscaled --state=/var/lib/tailscale/tailscaled.state &
    sudo tailscale up --authkey=${{ secrets.TAILSCALE_AUTHKEY }}
```

Store `TAILSCALE_AUTHKEY` as a GitHub secret.

### Step 4: Update Website to Fetch from API

In `src/pages/maintenance.astro`, replace JSON import with:

```astro
---
const response = await fetch('http://arrakis:3000/dev/maintenance');
const maintenanceData = await response.json();
---
```

### Step 5: Migrate Existing Data

Run a one-time script to insert current `maintenance.json` items into the database.

### Step 6: Update Mobile App

Connect the mobile app's existing `MaintenanceRecord` type to the new API endpoints.

---

## Files to Create/Modify

### moto-lambda-API (Backend)

| File | Action |
|------|--------|
| `docs/database/maintenance_records.sql` | Create - Schema migration |
| `src/types/maintenanceFields.ts` | Create - TypeScript interfaces |
| `src/models/Maintenance.ts` | Create - CRUD operations |
| `src/handlers/maintenance/*.ts` | Create - 5 Lambda handlers |
| `serverless.yml` | Modify - Add maintenance endpoints |

### staubracing.com (Website)

| File | Action |
|------|--------|
| `src/pages/maintenance.astro` | Modify - Fetch from API instead of JSON |
| `.github/workflows/deploy.yml` | Modify - Add Tailscale step |
| `src/data/maintenance.json` | Eventually remove or keep as fallback |

---

## Verification

1. **Test API locally:** `serverless offline` → curl endpoints
2. **Test build:** `yarn build` with API running → check maintenance page
3. **Test CI/CD:** Push to main → verify GitHub Actions connects via Tailscale
4. **Test mobile app:** Create maintenance record → verify it appears on website after rebuild

---

## Future Possibilities

Once the foundation is in place:
- Share `motorcycles` table for bike specs (replace `bikes.json`)
- Add `tracks` integration for racing pages
- Create shared user preferences/settings
- Sync maintenance schedules and reminders

---

## Status

| Phase | Status |
|-------|--------|
| Planning | ✅ Complete |
| Database Schema | ⏳ Not started |
| Lambda API Endpoints | ⏳ Not started |
| Tailscale Configuration | ⏳ Not started |
| Website Integration | ⏳ Not started |
| Data Migration | ⏳ Not started |
| Mobile App Connection | ⏳ Not started |

**Last Updated:** 2026-02-16
