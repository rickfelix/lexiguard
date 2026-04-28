# LexiGuard

## File Map

Read these files in order when starting a new feature:

| File | Purpose | When to Read |
|------|---------|-------------|
| **docs/designs/** | Approved HTML designs for each screen — pixel-perfect reference | **First** — open the relevant screen's HTML before building any UI |
| **docs/color-palette.md** | Brand colors as CSS custom properties — copy into global CSS | **First** — import :root block before writing any styles |
| **docs/spec.md** | Complete specification: problem, users, architecture, screens | Before writing any code |
| **docs/tasks.md** | Pre-decomposed implementation steps with acceptance criteria | Pick your next task from here |
| **docs/architecture.md** | Tech stack, data model, API surface | When implementing backend/database work |
| **docs/branding.md** | Typography, personas, brand voice | When implementing any UI |
| **docs/product-roadmap.md** | Feature priorities and MVP phasing | When deciding build order |

## Build Workflow

For each feature or task:
1. **Open docs/designs/** and find the HTML file for the screen you're building — match it closely
2. **Copy the CSS custom properties** from docs/color-palette.md into your global stylesheet (do this once)
3. **Read docs/tasks.md** and pick the next uncompleted task
4. **Read docs/spec.md** for the full context on that feature
5. **Use docs/architecture.md** for data model and API patterns
6. **Check off** the task's acceptance criteria when done

## Coding Standards
- TypeScript strict mode
- Proper error handling on all API calls
- Responsive design (mobile-first)
- Semantic HTML with ARIA labels
- Use environment variables for all secrets
- Follow existing patterns in the codebase

## Design Consistency
The approved HTML designs in docs/designs/ were generated independently per screen.
There may be inconsistencies between them (e.g., one screen missing a sidebar that all
others have, different header layouts, inconsistent navigation patterns). When you notice
inconsistencies:
- Identify the **majority pattern** across all screens (e.g., 5 of 6 screens have a sidebar)
- Apply the majority pattern to ALL screens — normalize the shared layout elements
- Shared elements to keep consistent: navigation/sidebar, header, footer, color usage, typography scale, spacing system
- Screen-specific elements (hero sections, data tables, forms) should follow the individual design

## Key Rules
- Do NOT invent features not in docs/tasks.md
- Do NOT change the data model without checking docs/architecture.md
- Do NOT use colors not in docs/color-palette.md — use the CSS custom properties
- Do NOT deviate from the approved screen designs in docs/designs/ (except to normalize inconsistencies as described above)
- Complete one task fully before starting the next
