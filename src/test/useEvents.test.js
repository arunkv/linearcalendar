import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEvents } from '../hooks/useEvents.js'

describe('useEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should initialize with empty array when localStorage is empty', () => {
    localStorage.getItem.mockReturnValue(null)
    const { result } = renderHook(() => useEvents())
    expect(result.current.events).toEqual([])
  })

  it('should initialize with data from localStorage', () => {
    const storedEvents = [
      { id: '1', title: 'Test Event', startDate: '2024-01-01', endDate: '2024-01-01' }
    ]
    localStorage.getItem.mockReturnValue(JSON.stringify(storedEvents))
    const { result } = renderHook(() => useEvents())
    expect(result.current.events).toEqual(storedEvents)
  })

  it('should handle localStorage parse errors gracefully', () => {
    localStorage.getItem.mockReturnValue('invalid json')
    const { result } = renderHook(() => useEvents())
    expect(result.current.events).toEqual([])
  })

  it('should add an event', () => {
    localStorage.getItem.mockReturnValue(null)
    const { result } = renderHook(() => useEvents())

    act(() => {
      result.current.addEvent({
        title: 'New Event',
        startDate: '2024-03-15',
        endDate: '2024-03-15',
        tagId: 'tag-1'
      })
    })

    expect(result.current.events).toHaveLength(1)
    expect(result.current.events[0]).toMatchObject({
      title: 'New Event',
      startDate: '2024-03-15',
      endDate: '2024-03-15',
      tagId: 'tag-1'
    })
    expect(result.current.events[0].id).toBeDefined()
  })

  it('should persist events to localStorage when adding', () => {
    localStorage.getItem.mockReturnValue(null)
    const { result } = renderHook(() => useEvents())

    act(() => {
      result.current.addEvent({
        title: 'New Event',
        startDate: '2024-03-15',
        endDate: '2024-03-15'
      })
    })

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'linearcalendar-events',
      expect.any(String)
    )
  })

  it('should update an existing event', () => {
    const storedEvents = [
      { id: '1', title: 'Old Title', startDate: '2024-01-01', endDate: '2024-01-01' }
    ]
    localStorage.getItem.mockReturnValue(JSON.stringify(storedEvents))
    const { result } = renderHook(() => useEvents())

    act(() => {
      result.current.updateEvent('1', { title: 'New Title' })
    })

    expect(result.current.events[0].title).toBe('New Title')
    expect(result.current.events[0].startDate).toBe('2024-01-01') // Unchanged
  })

  it('should not update events with different ids', () => {
    const storedEvents = [
      { id: '1', title: 'Event 1', startDate: '2024-01-01', endDate: '2024-01-01' },
      { id: '2', title: 'Event 2', startDate: '2024-01-02', endDate: '2024-01-02' }
    ]
    localStorage.getItem.mockReturnValue(JSON.stringify(storedEvents))
    const { result } = renderHook(() => useEvents())

    act(() => {
      result.current.updateEvent('1', { title: 'Updated' })
    })

    expect(result.current.events[0].title).toBe('Updated')
    expect(result.current.events[1].title).toBe('Event 2')
  })

  it('should delete an event', () => {
    const storedEvents = [
      { id: '1', title: 'Event 1', startDate: '2024-01-01', endDate: '2024-01-01' },
      { id: '2', title: 'Event 2', startDate: '2024-01-02', endDate: '2024-01-02' }
    ]
    localStorage.getItem.mockReturnValue(JSON.stringify(storedEvents))
    const { result } = renderHook(() => useEvents())

    act(() => {
      result.current.deleteEvent('1')
    })

    expect(result.current.events).toHaveLength(1)
    expect(result.current.events[0].id).toBe('2')
  })

  it('should persist to localStorage when deleting', () => {
    const storedEvents = [
      { id: '1', title: 'Event 1', startDate: '2024-01-01', endDate: '2024-01-01' }
    ]
    localStorage.getItem.mockReturnValue(JSON.stringify(storedEvents))
    const { result } = renderHook(() => useEvents())

    act(() => {
      result.current.deleteEvent('1')
    })

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'linearcalendar-events',
      '[]'
    )
  })

  it('should replace all events', () => {
    const storedEvents = [
      { id: '1', title: 'Old Event', startDate: '2024-01-01', endDate: '2024-01-01' }
    ]
    localStorage.getItem.mockReturnValue(JSON.stringify(storedEvents))
    const { result } = renderHook(() => useEvents())

    const newEvents = [
      { id: '2', title: 'New Event', startDate: '2024-02-01', endDate: '2024-02-01' }
    ]

    act(() => {
      result.current.replaceAll(newEvents)
    })

    expect(result.current.events).toEqual(newEvents)
  })

  it('should persist to localStorage when replacing all', () => {
    localStorage.getItem.mockReturnValue(null)
    const { result } = renderHook(() => useEvents())

    const newEvents = [{ id: '1', title: 'Event', startDate: '2024-01-01', endDate: '2024-01-01' }]

    act(() => {
      result.current.replaceAll(newEvents)
    })

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'linearcalendar-events',
      JSON.stringify(newEvents)
    )
  })

  it('should generate unique ids for each added event', () => {
    localStorage.getItem.mockReturnValue(null)
    const { result } = renderHook(() => useEvents())

    act(() => {
      result.current.addEvent({ title: 'Event 1', startDate: '2024-01-01', endDate: '2024-01-01' })
    })

    act(() => {
      result.current.addEvent({ title: 'Event 2', startDate: '2024-01-02', endDate: '2024-01-02' })
    })

    expect(result.current.events[0].id).not.toBe(result.current.events[1].id)
  })
})
