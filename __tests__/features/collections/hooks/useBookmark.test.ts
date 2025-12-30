import { renderHook, act, waitFor } from '@testing-library/react'
import { useBookmark } from '@/features/collections/hooks/useBookmark'
import { useAuth } from '@/context/AuthContext'
import {
  isBookmarked as checkIsBookmarked,
  toggleBookmark as toggleBookmarkRepo,
} from '@/features/collections/repositories/collectionsRepository'

// Mock dependencies
jest.mock('@/context/AuthContext')
jest.mock('@/features/collections/repositories/collectionsRepository')

describe('useBookmark', () => {
  const mockUser = { uid: 'user-1' }
  const options = { threadTitle: 'Test Title', threadAuthorId: 'author-1' }
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  })

  it('initializes with bookmarked status', async () => {
    (checkIsBookmarked as jest.Mock).mockResolvedValue(true)
    
    const { result } = renderHook(() => useBookmark('thread-1', options))
    
    expect(result.current.isLoading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(result.current.isBookmarked).toBe(true)
    expect(checkIsBookmarked).toHaveBeenCalledWith('user-1', 'thread-1')
  })

  it('initializes with not bookmarked status', async () => {
    (checkIsBookmarked as jest.Mock).mockResolvedValue(false)
    
    const { result } = renderHook(() => useBookmark('thread-1', options))
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(result.current.isBookmarked).toBe(false)
  })

  it('returns not bookmarked if no user is signed in', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null })
    
    const { result } = renderHook(() => useBookmark('thread-1', options))
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(result.current.isBookmarked).toBe(false)
    expect(checkIsBookmarked).not.toHaveBeenCalled()
  })

  it('toggles bookmark status', async () => {
    (checkIsBookmarked as jest.Mock).mockResolvedValue(false);
    (toggleBookmarkRepo as jest.Mock).mockResolvedValue(true)
    
    const { result } = renderHook(() => useBookmark('thread-1', options))
    
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    
    await act(async () => {
      await result.current.toggleBookmark()
    })
    
    expect(result.current.isBookmarked).toBe(true)
    expect(toggleBookmarkRepo).toHaveBeenCalledWith('user-1', {
      threadId: 'thread-1',
      threadTitle: 'Test Title',
      threadAuthorId: 'author-1',
    })
  })

  it('does not toggle bookmark if no user is signed in', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null })
    
    const { result } = renderHook(() => useBookmark('thread-1', options))
    
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    
    await act(async () => {
      await result.current.toggleBookmark()
    })
    
    expect(toggleBookmarkRepo).not.toHaveBeenCalled()
  })
})
