import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchPage } from '@/features/search/components/SearchPage'
import { useSearch } from '@/features/search/hooks/useSearch'
import { useSearchParams } from 'next/navigation'

// Mock next/navigation
const mockReplace = jest.fn()
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/search'),
  useRouter: jest.fn(() => ({ replace: mockReplace })),
  useSearchParams: jest.fn(),
}))

// Mock hooks
jest.mock('@/features/search/hooks/useSearch', () => ({
  useSearch: jest.fn(),
}))

jest.mock('@/features/search/hooks/useDebouncedValue', () => ({
  useDebouncedValue: jest.fn((val) => val),
}))

jest.mock('@/features/thread/components/ThreadCard', () => ({
  __esModule: true,
  default: ({ thread }: { thread: { title: string } }) => <div data-testid="thread-card">{thread.title}</div>,
}))

jest.mock('@/features/search/components/UserCard', () => ({
  UserCard: ({ user }: { user: { displayName: string } }) => <div data-testid="user-card">{user.displayName}</div>,
}))

describe('SearchPage', () => {
  const mockSearch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    (useSearch as jest.Mock).mockReturnValue({
      threads: [],
      users: [],
      loading: false,
      error: null,
      search: mockSearch,
    })
  })

  it('renders search input and tabs', () => {
    render(<SearchPage />)
    expect(screen.getByPlaceholderText('Search threads or users')).toBeInTheDocument()
    expect(screen.getByText('Threads')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('initializes state from search params', async () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('?q=react&tab=users'))
    render(<SearchPage />)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search threads or users')).toHaveValue('react')
    })
  })

  it('calls search when query changes', async () => {
    render(<SearchPage />)
    const input = screen.getByPlaceholderText('Search threads or users')
    fireEvent.change(input, { target: { value: 'nextjs' } })
    
    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith('nextjs', 'threads')
    })
  })

  it('updates URL when query changes', async () => {
    render(<SearchPage />)
    const input = screen.getByPlaceholderText('Search threads or users')
    fireEvent.change(input, { target: { value: 'nextjs' } })
    
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/search?q=nextjs&tab=threads', expect.anything())
    })
  })

  it('renders threads results', () => {
    (useSearch as jest.Mock).mockReturnValue({
      threads: [{ id: '1', title: 'Found Thread' }],
      users: [],
      loading: false,
      error: null,
      search: mockSearch,
    })

    // Simulate query to trigger rendering results condition
    render(<SearchPage />)
    const input = screen.getByPlaceholderText('Search threads or users')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(screen.getByText('Found Thread')).toBeInTheDocument()
  })

  it('shows empty state', () => {
    (useSearch as jest.Mock).mockReturnValue({
      threads: [],
      users: [],
      loading: false,
      error: null,
      search: mockSearch,
    })

    render(<SearchPage />)
    const input = screen.getByPlaceholderText('Search threads or users')
    fireEvent.change(input, { target: { value: 'notfound' } })

    expect(screen.getByText(/No threads matched/)).toBeInTheDocument()
  })
})
