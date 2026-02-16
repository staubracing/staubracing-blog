---
name: add-maintenance
description: Add a new maintenance task to the maintenance tracker. Use when the user wants to track a bike task, add to their maintenance list, or log something that needs done.
---

# Add Maintenance Skill

Quickly add a new maintenance item to the bike maintenance tracker.

## Usage

```
/add-maintenance <task> --bike <bike> --priority <level> --notes <notes>
```

**Examples:**
```
/add-maintenance "Replace front brake pads" --bike ZX6R --priority high
/add-maintenance "Oil change" --bike KX450F --priority medium --notes "Last changed: Dec 2025"
/add-maintenance "Check tire pressure" --bike ZX6R
```

## Available Bikes

| Bike | Description |
|------|-------------|
| `ZX6R` | Kawasaki ZX6R (track bike) |
| `KX450F` | Kawasaki KX450F (dirt bike) |

## Priority Levels

| Priority | Meaning |
|----------|---------|
| `high` | Urgent - safety critical or race prep |
| `medium` | Important - do soon |
| `low` | Routine - can wait |

## Instructions

When this skill is invoked, you MUST:

### 1. Parse Arguments

- **task** (required): The maintenance task description
- **--bike / -b** (required if not obvious): One of `ZX6R`, `KX450F`
- **--priority / -p** (optional): `high`, `medium`, or `low`. Default: `medium`
- **--notes / -n** (optional): Additional context or reminders

### 2. Generate ID

Create a kebab-case ID from bike + task:
- Format: `{bike-prefix}-{task-slug}`
- Example: "Replace front brake pads" for ZX6R → `zx6r-front-brake-pads`

### 3. Read Current File

Read `src/data/maintenance.json` to:
- Check for duplicate IDs
- Preserve existing items
- Update the `lastUpdated` date

### 4. Add New Item

Append the new item to the `items` array:

```json
{
  "id": "{generated-id}",
  "bike": "{bike}",
  "task": "{task}",
  "priority": "{priority}",
  "notes": "{notes or empty string}"
}
```

### 5. Update and Confirm

Update `lastUpdated` to today's date, then write the file.

Confirm with:
```
Added maintenance item:
🔧 {task}
🏍️ {bike}
⚡ {priority} priority

View at: staubracing.com/maintenance
```

## Short Form Support

If the user just says something casual like:
- "need to change oil on the dirt bike"
- "remind me to check zx6r chain"
- "brake pads are shot on zx6r"

Parse the intent and ask only for missing required info, or infer sensibly:
- "dirt bike" → KX450F
- "track bike" / "636" → ZX6R
- If no priority given, default to `medium`

## Removing Items

If the user says "completed" or "done" with a task:
```
/add-maintenance done <id>
/add-maintenance complete "oil change"
```

Remove the matching item from the JSON and confirm.
