import { render, screen, fireEvent } from '@testing-library/react'
import ThreadCard from '@/features/thread/components/ThreadCard'
import { useRouter } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockThread = {
  id: 'thread-1',
  title: 'Test Thread',
  body: 'This is a test content snippet that should be truncated if it is too long.',
  authorId: 'user-1',
  authorName: 'Test Author',
  avatar: null,
  createdAt: { seconds: 1620000000, nanoseconds: 0 },
  author: {
    uid: 'user-1',
    email: 'test@test.com',
    displayName: 'Test Author',
    photoURL: null,
  },
  replyCount: 5,
  viewCount: 10,
  tagIds: ['react', 'testing'],
}

describe('ThreadCard', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  })

  it('renders thread details', () => {
    render(<ThreadCard thread={mockThread as any} />)
    expect(screen.getByText('Test Thread')).toBeInTheDocument()
    // features/ThreadCard uses authorId or logic
    expect(screen.getByText('user-1')).toBeInTheDocument()
    expect(screen.getByText(/This is a test content/)).toBeInTheDocument()
    expect(screen.getByText('#react')).toBeInTheDocument()
    expect(screen.getByText('#testing')).toBeInTheDocument()
  })

  it('has correct navigation link', () => {
    render(<ThreadCard thread={mockThread as any} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/thread/thread-1')
  })
})
