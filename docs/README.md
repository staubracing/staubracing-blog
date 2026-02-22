# Staub Racing Documentation

Documentation for developing and maintaining staubracing.com.

## Quick Navigation

| I want to... | Go to |
|--------------|-------|
| Change colors or theme | [Theme Customization](guides/theme-customization.md) |
| Add images to a post | [Adding Images](guides/adding-images.md) |
| Create a new blog post | [Creating Posts](guides/creating-posts.md) |
| Understand the system architecture | [Architecture Reference](reference/architecture.md) |
| Look up content schema fields | [Content Schema](reference/content-schema.md) |
| Use the Maintenance API | [Maintenance API](reference/maintenance-api.md) |
| Understand why decisions were made | [Design Decisions](explanation/design-decisions.md) |
| Review the migration history | [Migration History](explanation/migration-history.md) |
| Plan content or track ideas | [Planning Folder](planning/) |

## Documentation Types

This documentation follows the [Diátaxis framework](https://diataxis.fr/), which organizes content by user need:

### [Guides](guides/) — How-To
Task-oriented documentation for getting things done. Step-by-step instructions for common tasks.

### [Reference](reference/) — Technical Specs
Information-oriented documentation for looking up details. API endpoints, schemas, configuration.

### [Explanation](explanation/) — Understanding
Context and background. Why certain technologies were chosen, design philosophy, historical context.

### [Planning](planning/) — Working Documents
Active planning documents that change frequently. Blog ideas, future improvements, in-progress work.

## Contributing

Before committing changes, always run:
```bash
yarn build && yarn preview
```

For project context and coding conventions, see [CLAUDE.md](../CLAUDE.md).
