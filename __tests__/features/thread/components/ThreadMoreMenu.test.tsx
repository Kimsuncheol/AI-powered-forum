import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ThreadMoreMenu from '@/features/thread/components/ThreadMoreMenu'
import { useAuth } from '@/context/AuthContext'
import { useBookmark } from '@/features/collections'

// Mock context and hooks
jest.mock('@/context/AuthContext')
jest.mock('@/features/collections')

// Mock ForwardToChatModal to avoid deep rendering issues
jest.mock('@/features/thread/components/ForwardToChatModal', () => {
  return function MockForwardToChatModal({ open, onClose }: any) {
    if (!open) return null
    return <div data-testid="forward-modal">Forward Modal <button onClick={onClose}>Close</button></div>
  }
})

describe('ThreadMoreMenu', () => {
  const mockUser = { uid: 'user-1' }
  const mockToggleBookmark = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useBookmark as jest.Mock).mockReturnValue({
      isBookmarked: false,
      isLoading: false,
      toggleBookmark: mockToggleBookmark,
    })
  })

  const renderComponent = () => {
    return render(
      <ThreadMoreMenu 
        threadId="thread-1" 
        threadTitle="Test Thread" 
        authorId="author-1" 
      />
    )
  }

  it('renders more icon button', () => {
    renderComponent()
    expect(screen.getByLabelText('More options')).toBeInTheDocument()
  })

  it('opens menu on click', () => {
    renderComponent()
    const moreButton = screen.getByLabelText('More options')
    fireEvent.click(moreButton)
    
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(screen.getByText('Forward to Chat')).toBeInTheDocument()
    expect(screen.getByText('Copy Link')).toBeInTheDocument()
  })

  it('calls toggleBookmark when Save is clicked', async () => {
    renderComponent()
    fireEvent.click(screen.getByLabelText('More options'))
    
    const saveItem = screen.getByText('Save')
    fireEvent.click(saveItem)
    
    expect(mockToggleBookmark).toHaveBeenCalled()
  })

  it('shows "Saved" when thread is bookmarked', () => {
    (useBookmark as jest.Mock).mockReturnValue({
      isBookmarked: true,
      isLoading: false,
      toggleBookmark: mockToggleBookmark,
    })
    
    renderComponent()
    fireEvent.click(screen.getByLabelText('More options'))
    
    expect(screen.getByText('Saved')).toBeInTheDocument()
  })

  it('opens forward modal when Forward to Chat is clicked', () => {
    renderComponent()
    fireEvent.click(screen.getByLabelText('More options'))
    
    const forwardItem = screen.getByText('Forward to Chat')
    fireEvent.click(forwardItem)
    
    expect(screen.getByTestId('forward-modal')).toBeInTheDocument()
  })

  it('shows snackbar for unauthenticated user trying to save', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null })
    
    renderComponent()
    fireEvent.click(screen.getByLabelText('More options'))
    
    const saveItem = screen.getByText('Save')
    fireEvent.click(saveItem)
    
    expect(screen.getByText('Please sign in to save threads')).toBeInTheDocument()
    expect(mockToggleBookmark).not.toHaveBeenCalled()
  })

  it('copies link to clipboard', async () => {
    // Mock navigator.clipboard
    const mockClipboard = {
      writeText: jest.fn().mockImplementation(() => Promise.resolve()),
    }
    Object.assign(navigator, { clipboard: mockClipboard })

    renderComponent()
    fireEvent.click(screen.getByLabelText('More options'))
    
    const copyItem = screen.getByText('Copy Link')
    fireEvent.click(copyItem)
    
    expect(mockClipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('/thread/thread-1'))
    
    await waitFor(() => {
      expect(screen.getByText('Link copied to clipboard')).toBeInTheDocument()
    })
  })
})
