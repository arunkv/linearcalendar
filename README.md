# Linear Calendar

An open source linear calendar application.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

---

## What is a Linear Calendar?

The concept was popularized by [Nick Milo](https://www.linkingyourthinking.com/) of *Linking Your Thinking* (LYT), who introduced the linear calendar as a core planning tool in his YouTube video [*The Most Useful Calendar View in 2025 That No One Told You About*](https://www.youtube.com/live/SQHYj7x-t3A) and made a downloadable version available at [linkingyourthinking.com](https://www.linkingyourthinking.com/thank-you/download-the-linear-calendar).

A **linear calendar** is a single-page view of your entire year — all twelve months laid out horizontally so that time flows left to right, continuously, without the hard breaks imposed by a traditional grid calendar. Rather than toggling between disconnected weekly or monthly views, you see January through December at once.

### Why it matters

Most digital calendars train you to think in weeks. A weekly view is great for day-to-day scheduling, but it hides the larger shape of your year: seasons of high demand, stretches of empty space, clusters of back-to-back commitments that look manageable one week at a time but are crushing when seen together.

The linear layout fixes this by making three things immediately visible:

- **Perspective** — you plan in seasons and quarters, not just the next seven days
- **Energy** — you can spot overloaded periods before they arrive and protect time for rest
- **Memory** — a marked-up linear calendar becomes a visual record of your year; glancing at it brings back context that a list of events never could

### Year-specific by design

Each linear calendar is bound to a single year. Weekday-to-date assignments (e.g., "March 3 falls on a Monday") are accurate only for that year, because the Gregorian calendar shifts each year. Leap years add a day to February. A new year means a new calendar — which is also what makes it a meaningful annual ritual.

---

## About This Project

This project provides an open source implementation of a linear calendar. It aims to make it easy to generate, display, and interact with year-specific calendar data programmatically.

### Features

- [x] Generate a full linear calendar for any given year
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

## License

This project is licensed under the [Apache License, Version 2.0](LICENSE).

---

## References

- Nick Milo — [*The Most Useful Calendar View in 2025 That No One Told You About*](https://www.youtube.com/live/SQHYj7x-t3A) (YouTube, Linking Your Thinking)
