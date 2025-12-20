import { render, screen, fireEvent } from '@testing-library/react'
import Header from '@/components/Header'
import { useAuth } from '@/context/AuthContext'
import { usePathname, useRouter } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}))

// Mock ThemeToggle
jest.mock('@/components/ThemeToggle', () => ({
  __esModule: true,
  default: () => <div data-testid="theme-toggle" />,
}))

// Mock AuthContext
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}))

describe('Header', () => {
  const mockSignInWithGoogle = jest.fn()
  const mockSignOut = jest.fn()
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (usePathname as jest.Mock).mockReturnValue('/');
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      signInWithGoogle: mockSignInWithGoogle,
      signOut: mockSignOut,
    });
  })

  const setupAuth = (userVal: any = null, loading = false) => {
    (useAuth as jest.Mock).mockReturnValue({
      user: userVal,
      loading,
      signInWithGoogle: mockSignInWithGoogle,
      signOut: mockSignOut,
    })
  }

  it('renders title and theme toggle', () => {
    render(<Header />)
    expect(screen.getByText('AI Forum')).toBeInTheDocument()
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
  })

  it('renders sign in button when not authenticated', () => {
    setupAuth(null)
    render(<Header />)
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  it('calls signInWithGoogle on sign in click', () => {
    setupAuth(null)
    render(<Header />)
    fireEvent.click(screen.getByText('Sign In'))
    expect(mockSignInWithGoogle).toHaveBeenCalled()
  })

  it('renders user avatar and new thread button when authenticated', () => {
    setupAuth({ email: 'test@example.com', displayName: 'Test User' })
    render(<Header />)
    expect(screen.getByText('New Thread')).toBeInTheDocument()
    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('navigates to settings from user menu', () => {
    setupAuth({ email: 'test@example.com', displayName: 'Test User' })
    render(<Header />)
    
    // Open menu
    const avatarButton = screen.getByText('T').closest('button')
    fireEvent.click(avatarButton!)
    
    // Click settings
    fireEvent.click(screen.getByText('Settings'))
    expect(mockPush).toHaveBeenCalledWith('/settings')
  })

  it('navigates to search on search bar click', () => {
    render(<Header />)
    const searchBar = screen.getByText('Search...').closest('div')
    fireEvent.click(searchBar!)
    expect(mockPush).toHaveBeenCalledWith('/search')
  })

  it('does not render on auth pages', () => {
    (usePathname as jest.Mock).mockReturnValue('/signin')
    const { container } = render(<Header />)
    expect(container).toBeEmptyDOMElement()
  })
})
