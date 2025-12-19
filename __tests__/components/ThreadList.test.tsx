import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ThreadList from '@/components/ThreadList'
import { getThreads } from '@/lib/db/threads'

// Mock next/navigation for ThreadCard inside ThreadList
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock DB
jest.mock('@/lib/db/threads', () => ({
  getThreads: jest.fn(),
  seedMockThreads: jest.fn(),
}))

const mockThreads = [
  {
    id: 'thread-1',
    title: 'Thread 1',
    body: 'Content 1',
    authorId: 'user-1',
    authorName: 'User 1',
    tagIds: ['tag1'],
    tags: ['tag1'],
    likes: 0,
    commentsCount: 0,
    createdAt: Date.now(),
  },
  {
    id: 'thread-2',
    title: 'Thread 2',
    body: 'Content 2',
    authorId: 'user-2',
    authorName: 'User 2',
    tagIds: ['tag2'],
    tags: ['tag2'],
    likes: 0,
    commentsCount: 0,
    createdAt: Date.now(),
  },
]

describe('ThreadList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('renders loading initially', () => {
    // Return a promise that never resolves or resolves later
    (getThreads as jest.Mock).mockReturnValue(new Promise(() => {}))
    render(<ThreadList />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders threads after fetch', async () => {
    (getThreads as jest.Mock).mockResolvedValue({
      threads: mockThreads,
      lastDoc: { id: 'last-doc' },
    })

    render(<ThreadList />)

    await waitFor(() => {
      expect(screen.getByText('Thread 1')).toBeInTheDocument()
      expect(screen.getByText('Thread 2')).toBeInTheDocument()
    })
  })

  it('renders empty state when no threads', async () => {
    (getThreads as jest.Mock).mockResolvedValue({
      threads: [],
      lastDoc: null,
    })

    render(<ThreadList />)

    await waitFor(() => {
      expect(screen.getByText('No threads found yet.')).toBeInTheDocument()
    })
  })

  it('renders error state on failure', async () => {
    (getThreads as jest.Mock).mockRejectedValue(new Error('Fetch error'))

    render(<ThreadList />)

    await waitFor(() => {
      expect(screen.getByText('Failed to load threads. Please try again.')).toBeInTheDocument()
    })
  })
})
