import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTags } from '../hooks/useTags.js'

describe('useTags', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should initialize with empty array when localStorage is empty', () => {
    localStorage.getItem.mockReturnValue(null)
    const { result } = renderHook(() => useTags())
    expect(result.current.tags).toEqual([])
  })

  it('should initialize with data from localStorage', () => {
    const storedTags = [
      { id: '1', name: 'Work', color: '#ff0000' }
    ]
    localStorage.getItem.mockReturnValue(JSON.stringify(storedTags))
    const { result } = renderHook(() => useTags())
    expect(result.current.tags).toEqual(storedTags)
  })

  it('should handle localStorage parse errors gracefully', () => {
    localStorage.getItem.mockReturnValue('invalid json')
    const { result } = renderHook(() => useTags())
    expect(result.current.tags).toEqual([])
  })

  it('should add a tag and return the created tag', () => {
    localStorage.getItem.mockReturnValue(null)
    const { result } = renderHook(() => useTags())

    let returnedTag
    act(() => {
      returnedTag = result.current.addTag({ name: 'Personal', color: '#00ff00' })
    })

    expect(result.current.tags).toHaveLength(1)
    expect(result.current.tags[0]).toMatchObject({
      name: 'Personal',
      color: '#00ff00'
    })
    expect(returnedTag).toMatchObject({
      name: 'Personal',
      color: '#00ff00'
    })
    expect(returnedTag.id).toBeDefined()
  })

  it('should persist tags to localStorage when adding', () => {
    localStorage.getItem.mockReturnValue(null)
    const { result } = renderHook(() => useTags())

    act(() => {
      result.current.addTag({ name: 'Work', color: '#ff0000' })
    })

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'linearcalendar-tags',
      expect.any(String)
    )
  })

  it('should update an existing tag', () => {
    const storedTags = [
      { id: '1', name: 'Work', color: '#ff0000' }
    ]
    localStorage.getItem.mockReturnValue(JSON.stringify(storedTags))
    const { result } = renderHook(() => useTags())

    act(() => {
      result.current.updateTag('1', { color: '#00ff00' })
    })

    expect(result.current.tags[0].color).toBe('#00ff00')
    expect(result.current.tags[0].name).toBe('Work') // Unchanged
  })

  it('should not update tags with different ids', () => {
    const storedTags = [
      { id: '1', name: 'Work', color: '#ff0000' },
      { id: '2', name: 'Personal', color: '#00ff00' }
    ]
    localStorage.getItem.mockReturnValue(JSON.stringify(storedTags))
    const { result } = renderHook(() => useTags())

    act(() => {
      result.current.updateTag('1', { name: 'Job' })
    })

    expect(result.current.tags[0].name).toBe('Job')
    expect(result.current.tags[1].name).toBe('Personal')
  })

  it('should delete a tag', () => {
    const storedTags = [
      { id: '1', name: 'Work', color: '#ff0000' },
      { id: '2', name: 'Personal', color: '#00ff00' }
    ]
    localStorage.getItem.mockReturnValue(JSON.stringify(storedTags))
    const { result } = renderHook(() => useTags())

    act(() => {
      result.current.deleteTag('1')
    })

    expect(result.current.tags).toHaveLength(1)
    expect(result.current.tags[0].id).toBe('2')
  })

  it('should persist to localStorage when deleting', () => {
    const storedTags = [
      { id: '1', name: 'Work', color: '#ff0000' }
    ]
    localStorage.getItem.mockReturnValue(JSON.stringify(storedTags))
    const { result } = renderHook(() => useTags())

    act(() => {
      result.current.deleteTag('1')
    })

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'linearcalendar-tags',
      '[]'
    )
  })

  it('should generate unique ids for each added tag', () => {
    localStorage.getItem.mockReturnValue(null)
    const { result } = renderHook(() => useTags())

    act(() => {
      result.current.addTag({ name: 'Tag 1', color: '#ff0000' })
    })

    act(() => {
      result.current.addTag({ name: 'Tag 2', color: '#00ff00' })
    })

    expect(result.current.tags[0].id).not.toBe(result.current.tags[1].id)
  })

  it('should handle multiple tag operations in sequence', () => {
    localStorage.getItem.mockReturnValue(null)
    const { result } = renderHook(() => useTags())

    // Add tags
    act(() => {
      result.current.addTag({ name: 'Work', color: '#ff0000' })
      result.current.addTag({ name: 'Personal', color: '#00ff00' })
    })
    expect(result.current.tags).toHaveLength(2)

    // Update one
    const workId = result.current.tags.find(t => t.name === 'Work').id
    act(() => {
      result.current.updateTag(workId, { color: '#0000ff' })
    })
    expect(result.current.tags.find(t => t.name === 'Work').color).toBe('#0000ff')

    // Delete one
    act(() => {
      result.current.deleteTag(workId)
    })
    expect(result.current.tags).toHaveLength(1)
    expect(result.current.tags[0].name).toBe('Personal')
  })
})
