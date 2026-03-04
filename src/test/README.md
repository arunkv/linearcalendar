# Linear Calendar Test Suite

This directory contains the unit and integration tests for the Linear Calendar application.

## Test Structure

```
src/test/
├── setup.js                    # Test setup and mocks
├── README.md                   # This file
├── calendarUtils.test.js       # Pure utility function tests
├── useEvents.test.js           # Event management hook tests
├── useTags.test.js             # Tag management hook tests
├── YearSwitcher.test.jsx       # Year switcher component tests
├── TagFilterBar.test.jsx       # Tag filter bar component tests
└── App.test.jsx                # Main app integration tests
```

## Running Tests

```bash
# Run tests in watch mode (development)
npm test

# Run tests once (CI)
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

### calendarUtils.test.js
Tests for pure utility functions:
- Date calculations (leap years, days in month)
- Calendar grid building
- ICS import/export
- Event positioning

### useEvents.test.js
Tests for event management hook:
- localStorage persistence
- CRUD operations (add, update, delete)
- Event replacement
- Error handling

### useTags.test.js
Tests for tag management hook:
- localStorage persistence
- CRUD operations
- Tag operations return values

### Component Tests
Tests for React components:
- Rendering
- User interactions
- State changes
- Props handling

## Writing New Tests

### Testing Utilities
Import from `vitest` and `@testing-library/react`:

```javascript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
```

### Testing Hooks
Use `renderHook` from `@testing-library/react`:

```javascript
import { renderHook, act } from '@testing-library/react'
import { useCustomHook } from '../hooks/useCustomHook'

const { result } = renderHook(() => useCustomHook())

act(() => {
  result.current.someFunction()
})
```

### Mocking localStorage
localStorage is automatically mocked in `setup.js`. Use:

```javascript
localStorage.getItem.mockReturnValue(JSON.stringify(data))
```

### Custom Matchers
The following custom matchers are available from `@testing-library/jest-dom`:
- `toBeInTheDocument()`
- `toHaveClass()`
- `toHaveAttribute()`
- `toBeVisible()`
- `toBeDisabled()`
- And more...

## Best Practices

1. **Test behavior, not implementation** — Focus on what the user sees and does
2. **Use descriptive test names** — Clear descriptions help when tests fail
3. **Group related tests** — Use `describe` blocks for organization
4. **Clean up after tests** — Tests are isolated automatically
5. **Mock external dependencies** — localStorage, fetch, etc.
