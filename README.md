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

### Formats

Annual calendars come in many forms:

| Format | Description |
|--------|-------------|
| **Wall calendar** | Large, single-page or multi-page format hung on a wall; ideal for shared spaces and team visibility |
| **Desk calendar** | Compact format for a work surface; includes tent-style, monthly pad, and similar variants |
| **Pocket calendar** | Wallet-sized, portable format for personal use |
| **Digital calendar** | Software or web application rendering an annual view, often with interactive event management |
| **Year planner** | A single large sheet showing all 12 months simultaneously, optimized for long-range planning |

### Annual vs. Perpetual Calendar

| Feature | Annual Calendar | Perpetual Calendar |
|---------|----------------|--------------------|
| Validity | One year only | Works across many years |
| Weekday accuracy | Exact for its year | Calculated dynamically |
| Leap year handling | Fixed for the year | Automatically computed |
| Requires update | Yes, each year | No (or very rarely) |

> In watchmaking, an "annual calendar" complication automatically adjusts for months of 30 and 31 days, requiring only one manual correction per year (for February's shorter month). A full "perpetual calendar" never needs manual adjustment.

---

## About This Project

This project provides an open source implementation of an annual calendar. It aims to make it easy to generate, display, and interact with year-specific calendar data programmatically.

### Features

- [ ] Generate a full annual calendar for any given year
- [ ] Display month-by-month and year-at-a-glance views
- [ ] Correct weekday-to-date mapping per year
- [ ] Leap year support
- [ ] Exportable output formats

---

## Getting Started

> Documentation and setup instructions coming soon.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

This project is licensed under the [Apache License, Version 2.0](LICENSE).

---

## References

- Wikipedia — [Calendar](https://en.wikipedia.org/wiki/Calendar): overview of calendar types and their properties
- Wikipedia — [Perpetual calendar](https://en.wikipedia.org/wiki/Perpetual_calendar): comparison between perpetual and annual calendar designs
- Wikipedia — [Annual calendar (horology)](https://en.wikipedia.org/wiki/Annual_calendar): the annual calendar complication in watchmaking, which auto-adjusts for 30/31-day months but requires one yearly correction for February
- Wikipedia — [Gregorian calendar](https://en.wikipedia.org/wiki/Gregorian_calendar): the calendar system underlying standard annual calendars in modern use
