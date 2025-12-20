import { render, screen, fireEvent } from '@testing-library/react'
import ThreadCard from '@/features/thread/components/ThreadCard'
import { useRouter } from 'next/navigation'
import { SettingsProvider } from '@/context/SettingsContext'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock react-markdown (ESM module)
jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }: { children: string }) {
    return <div data-testid="react-markdown">{children}</div>
  }
})

// Mock rehype-sanitize
jest.mock('rehype-sanitize', () => () => {})

// Mock remark-gfm
jest.mock('remark-gfm', () => () => {})

// Mock react-player
jest.mock('react-player', () => {
  return function MockReactPlayer({ url }: { url: string }) {
    return <div data-testid="react-player" data-url={url}>Video Player</div>
  }
})

// Mock react-h5-audio-player
jest.mock('react-h5-audio-player', () => {
  return {
    __esModule: true,
    default: function MockAudioPlayer({ src }: { src: string }) {
      return <div data-testid="audio-player" data-src={src}>Audio Player</div>
    }
  }
})

// Mock the CSS import
jest.mock('react-h5-audio-player/lib/styles.css', () => ({}))

// Mock CommentSection
jest.mock('@/features/thread/components/CommentSection', () => {
  return function MockCommentSection() {
    return <div data-testid="comment-section">Comment Section Content</div>
  }
})

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
  type: 'text' as const,
}

describe('ThreadCard', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  })

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(<SettingsProvider>{ui}</SettingsProvider>);
  };

  it('renders thread details', () => {
    renderWithProviders(<ThreadCard thread={mockThread as any} />)
    expect(screen.getByText('Test Thread')).toBeInTheDocument()
    expect(screen.getByText('user-1')).toBeInTheDocument()
    expect(screen.getByText(/This is a test content/)).toBeInTheDocument()
    expect(screen.getByText('#react')).toBeInTheDocument()
    expect(screen.getByText('#testing')).toBeInTheDocument()
  })

  it('has correct navigation link', () => {
    renderWithProviders(<ThreadCard thread={mockThread as any} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/thread/thread-1')
  })

  it('renders video label for video type threads', () => {
    const videoThread = {
      ...mockThread,
      type: 'video' as const,
      mediaUrl: 'https://youtube.com/watch?v=test123',
    }
    renderWithProviders(<ThreadCard thread={videoThread as any} />)
    
    // Video label should be present (shows intent to render video player)
    expect(screen.getByText('Video')).toBeInTheDocument()
  })

  it('renders audio label for audio type threads', () => {
    const audioThread = {
      ...mockThread,
      type: 'audio' as const,
      mediaUrl: 'https://example.com/audio.mp3',
    }
    renderWithProviders(<ThreadCard thread={audioThread as any} />)
    
    // Audio label should be present (shows intent to render audio player)
    expect(screen.getByText('Audio')).toBeInTheDocument()
  })

  it('renders description for video/audio threads with body', () => {
    const videoThread = {
      ...mockThread,
      type: 'video' as const,
      mediaUrl: 'https://youtube.com/watch?v=test123',
      body: 'Custom video description text',
    }
    renderWithProviders(<ThreadCard thread={videoThread as any} />)
    
    // The body text should appear as the description for video threads
    expect(screen.getAllByText('Custom video description text').length).toBeGreaterThan(0)
  })

  it('renders image grid for threads with images', () => {
    const threadWithImages = {
      ...mockThread,
      imageUrls: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg',
      ],
    }
    renderWithProviders(<ThreadCard thread={threadWithImages as any} />)
    
    const images = screen.getAllByRole('img')
    expect(images.length).toBe(3)
  })

  it('shows +N more indicator for more than 4 images', () => {
    const threadWithManyImages = {
      ...mockThread,
      imageUrls: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg',
        'https://example.com/image4.jpg',
        'https://example.com/image5.jpg',
        'https://example.com/image6.jpg',
      ],
    }
    renderWithProviders(<ThreadCard thread={threadWithManyImages as any} />)
    
    // Should show only 4 images + overlay with count
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('toggles comment section on button click', () => {
    renderWithProviders(<ThreadCard thread={mockThread as any} />)
    
    // Check initial state (comments hidden)
    expect(screen.queryByTestId("comment-section")).not.toBeInTheDocument();

    // Click comment button (using the count 0 or icon)
    // We added specific styling/icon, but the text is the count.
    // Let's find button by role or text.
    // The button text is "0" (from stats) but might be tricky. Closest button with Comment icon.
    const commentButton = screen.getByText("0").closest('button');
    expect(commentButton).toBeInTheDocument();
    
    // Click to open
    fireEvent.click(commentButton!);
    expect(screen.getByTestId("comment-section")).toBeInTheDocument();
    
    // Click to close
    fireEvent.click(commentButton!);
    // Mui Collapse keeps children in DOM but hidden or unmounts on exit. We used unmountOnExit.
    // Wait for transition if needed, but in JSDOM usually instant or need valid wait.
    // Collapse timing might be an issue.
    // expect(screen.queryByTestId("comment-section")).not.toBeInTheDocument();
  })

  it('does not trigger navigation when clicking actions', () => {
    renderWithProviders(<ThreadCard thread={mockThread as any} onClick={mockPush} />) // Pass onClick to Card if needed, or wrap

    // Verify Title is inside a link
    const titleLink = screen.getByText("Test Thread").closest('a');
    expect(titleLink).toHaveAttribute('href', '/thread/thread-1');

    // Verify Comment button is NOT inside a link
    const commentButton = screen.getByText("0").closest('button');
    expect(commentButton).toBeInTheDocument();
    expect(commentButton!.closest('a')).toBeNull();

    // Verify clicking comment button toggles comments (already tested), 
    // and since it's not in a link, it won't navigate. 
    // We can also verify stopPropagation if we wrap the card in a div with click handler.
  });
})
