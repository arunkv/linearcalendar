# Annual Calendar

An open source annual calendar application.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

---

## What is an Annual Calendar?

An **annual calendar** is a representation of a single calendar year — spanning January through December — that is specific to one particular year. Unlike a *perpetual calendar*, which is designed to function indefinitely across many years, an annual calendar is year-specific: the day-of-week assignment for each date is fixed to that year and must be replaced or updated when the year ends.

### Key Characteristics

- **Single-year scope** — covers exactly one calendar year (Jan 1 through Dec 31)
- **Year-specific layout** — weekday assignments (e.g., "March 3 falls on a Monday") are accurate only for that year, because the Gregorian calendar's weekday-to-date mapping shifts each year
- **Requires annual renewal** — unlike perpetual calendars, an annual calendar becomes inaccurate the following year and must be updated
- **Leap year awareness** — February has 28 days in common years and 29 in leap years; an annual calendar reflects the correct count for its specific year
- **At-a-glance visibility** — designed to present the full year or individual months clearly, making it easy to plan and track events, deadlines, and milestones

---

## About This Project

This project provides an open source implementation of an annual calendar. It aims to make it easy to generate, display, and interact with year-specific calendar data programmatically.

### Features

- [x] Generate a full annual calendar for any given year
- [x] Display month-by-month and year-at-a-glance views
- [x] Correct weekday-to-date mapping per year
- [x] Leap year support
- [x] Exportable output formats (.ics)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18

### Install dependencies

```sh
npm install
```

### Run the dev server

```sh
npm run dev
```

Opens at http://localhost:5173 with hot module replacement.

### Build for production

```sh
npm run build
```

Output is written to `dist/`.

### Preview the production build

```sh
npm run preview
```

Serves the `dist/` folder at http://localhost:4173.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

This project is licensed under the [Apache License, Version 2.0](LICENSE).

---

## References

TODO
