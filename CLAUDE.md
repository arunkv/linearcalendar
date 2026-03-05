# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server at http://localhost:5173
npm run build        # Production build → dist/
npm run test         # Vitest watch mode
npm run test:run     # Single run (CI)
npm run test:coverage
```

Run a single test file: `npm test -- calendarUtils` (pass filename pattern as argument).

## Architecture

React 19 SPA built with Vite 6. No backend — all state is client-side.

**State layers:**
- `App.jsx` — year selection (synced to `?year=YYYY` URL param via `popstate`) and theme (`data-theme` on `<html>`, stored in `localStorage`)
- `src/hooks/useEvents.js` — event CRUD with `localStorage` persistence
- `src/hooks/useTags.js` — tag CRUD with `localStorage` persistence; tag visibility is ephemeral (not persisted)

**Calendar grid** (`LinearCalendar.jsx` + `calendarUtils.js`):
- 37 CSS Grid columns per month (`GRID_COLS = 37`) — accommodates up to 31 days + padding
- Two rows per month: date row + events row
- Events span grid columns based on start/end dates within the month
- All calendar math (leap year, weekday alignment, ICS import/export) lives in `calendarUtils.js`

**Dates** are stored as `YYYY-MM-DD` strings — use the `toDateKey()` utility.

**Tags** store hex color values; events reference tags by `tagId`.

## Testing

Tests live in `src/test/`. Setup and `localStorage` mocks are in `src/test/setup.js`.

- Pure logic → `calendarUtils.test.js`
- Hooks → `renderHook` + `act` from `@testing-library/react`
- Components → `render` + `screen` + `fireEvent`

When modifying calendar logic, run `npm test -- calendarUtils` to validate.

## Conventions

- Components: `PascalCase.jsx` with co-located `PascalCase.css`
- Hooks: `camelCase.js` with `use` prefix
- CSS classes: BEM-like (`linear-calendar__cell--today`)
- Functional components, props destructured in parameters, named event handlers (not inline)

## Key Files

| File | Purpose |
|------|---------|
| `src/utils/calendarUtils.js` | All calendar math + ICS import/export |
| `src/hooks/useEvents.js` | Event CRUD + shape definition |
| `src/hooks/useTags.js` | Tag CRUD |
| `src/components/LinearCalendar.jsx` | Main grid rendering |
| `src/App.jsx` | Root state: year, theme |
| `vite.config.js` | Base path set to `/linearcalendar/` |
