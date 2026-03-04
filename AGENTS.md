# AGENTS.md — Linear Calendar

This file contains context and guidelines for AI agents working on the Linear Calendar project.

---

## Project Overview

**Linear Calendar** is a React-based web application for displaying and managing year-specific calendar data. Unlike perpetual calendars, it focuses on a single calendar year with accurate day-of-week assignments for that specific year.

- **Repository**: `linearcalendar`
- **License**: Apache 2.0
- **Base URL**: `/linearcalendar/` (configured in Vite)

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Build Tool | Vite 6 |
| Language | JavaScript (ES modules) |
| Styling | CSS (component-scoped) |
| State | React hooks (`useState`, `useEffect`, `useMemo`, `useRef`) |

---

## Project Structure

```
/
├── index.html              # Entry HTML
├── vite.config.js          # Vite configuration (base: '/linearcalendar/')
├── package.json
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Root component, manages year/theme state
│   ├── index.css           # Global styles
│   ├── components/         # React components
│   │   ├── LinearCalendar.jsx      # Main calendar grid
│   │   ├── LinearCalendar.css
│   │   ├── EventModal.jsx          # Create/edit event modal
│   │   ├── EventModal.css
│   │   ├── TagFilterBar.jsx        # Tag filtering UI
│   │   ├── TagFilterBar.css
│   │   ├── YearPicker.jsx          # Year selection dropdown
│   │   ├── YearPicker.css
│   │   ├── YearSwitcher.jsx        # Year navigation (prev/next)
│   │   └── YearSwitcher.css
│   ├── hooks/              # Custom React hooks
│   │   ├── useEvents.js    # Event CRUD + localStorage persistence
│   │   └── useTags.js      # Tag CRUD + localStorage persistence
│   └── utils/
│       └── calendarUtils.js # Calendar logic, ICS import/export
└── public/
    └── favicon.svg
```

---

## Key Features

1. **Year-specific calendar grid** — Shows all 12 months with accurate weekday alignment
2. **Event management** — Add, edit, delete events with date ranges
3. **Tag system** — Color-coded tags for categorizing events
4. **ICS export/import** — Standard calendar format support
5. **Dark/light theme** — Toggle with localStorage persistence
6. **Print support** — Optimized print styles

---

## Development Workflow

### Prerequisites
- Node.js ≥ 18

### Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:5173)
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview production build (http://localhost:4173)
npm run preview
```

---

## Architecture Notes

### State Management
- **Year selection**: Managed in `App.jsx`, synced to URL (`?year=YYYY`) for shareability
- **Theme**: Stored in `localStorage`, applied via `data-theme` attribute on `<html>`
- **Events & Tags**: Custom hooks with `localStorage` persistence

### Calendar Grid Logic
- 37 columns per month (accommodates up to 31 days + 6 padding cells)
- Each month has two rows: date row + events row
- Events are positioned using CSS Grid columns based on start/end dates

### Data Persistence
- Events and tags are serialized to `localStorage`
- ICS files used for import/export portability

---

## Code Conventions

### File Naming
- Components: PascalCase (e.g., `LinearCalendar.jsx`)
- Hooks: camelCase with `use` prefix (e.g., `useEvents.js`)
- Utils: camelCase (e.g., `calendarUtils.js`)
- Styles: Same name as component (e.g., `LinearCalendar.css`)

### CSS Classes
- BEM-like naming: `component-name__element--modifier`
- Example: `linear-calendar__cell--today`

### Component Structure
- Functional components with hooks
- Props destructured in function parameters
- Event handlers defined as named functions (not inline)

---

## Important Implementation Details

1. **Year URL Parameter**: The app reads `?year=YYYY` on load and updates the URL when year changes. Browser back/forward buttons work via `popstate` listener.

2. **Event Date Keys**: Dates stored as `YYYY-MM-DD` strings. Use `toDateKey()` utility.

3. **Grid Columns**: `GRID_COLS = 37` (defined in `calendarUtils.js`). This accommodates maximum month layout.

4. **Tag Colors**: Stored as hex colors. Events reference tags by `tagId`.

5. **Hidden Tags**: Tag visibility is ephemeral (not persisted) — stored in component state only.

---

## Common Tasks

### Adding a New Component
1. Create `src/components/ComponentName.jsx`
2. Create `src/components/ComponentName.css`
3. Import and use in parent component

### Modifying Calendar Logic
- Calendar calculations (leap year, day of week, etc.) live in `calendarUtils.js`
- Month grid building happens in `buildMonthRow()`

### Adding Event Properties
- Update the event shape in `useEvents.js`
- Update modal form in `EventModal.jsx`
- Update ICS parsing in `calendarUtils.js` (both export and import)

---

## Browser Compatibility

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Uses ES modules, CSS Grid, and modern JavaScript features

---

## Notes for AI Agents

- This is a **single-page application** — no server-side rendering
- All state is client-side; no backend API
- The app is designed to be **print-friendly** — test print styles if modifying layout
- Keep accessibility in mind: buttons have `aria-label`, interactive elements are keyboard accessible
- **Minimal changes preferred** — follow existing patterns
