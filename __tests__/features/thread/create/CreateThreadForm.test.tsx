import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateThreadForm } from '@/features/thread/create/components/CreateThreadForm'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ back: jest.fn() })),
}))

jest.mock('@/components/inputs/ProgressiveTagInput', () => ({
  ProgressiveTagInput: () => <div data-testid="tag-input">Tag Input</div>,
}))

// Mock ReactPlayer and AudioPlayer to avoid ESM issues
jest.mock('react-player', () => ({
  __esModule: true,
  default: () => <div data-testid="react-player">React Player</div>,
}))

jest.mock('react-h5-audio-player', () => ({
  __esModule: true,
  default: () => <div data-testid="audio-player">Audio Player</div>,
}))

// Mock MarkdownEditor to avoid CodeMirror canvas issues in JSDOM
jest.mock('@/features/thread/create/components/MarkdownEditor', () => ({
  MarkdownEditor: ({ value, onChange, placeholder }: any) => (
    <textarea
      data-testid="markdown-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}))

// Mock ImageDropZone
jest.mock('@/features/thread/create/components/ImageDropZone', () => ({
  ImageDropZone: ({ images, onChange }: { images: string[], onChange: (imgs: string[]) => void }) => (
    <div data-testid="image-drop-zone">
      <span>Images: {images.length}</span>
      <button onClick={() => onChange([...images, 'data:image/png;base64,test'])}>Add Image</button>
    </div>
  ),
}))

// Mock AiImageModal
jest.mock('@/features/ai/components/AiImageModal', () => ({
  AiImageModal: ({ open, onImageSelect }: { open: boolean, onImageSelect: (url: string) => void }) => (
    open ? (
      <div data-testid="ai-image-modal">
        <button onClick={() => onImageSelect('data:image/png;base64,mockai')}>Select Mock Image</button>
      </div>
    ) : null
  ),
}))

// Mock AiVideoModal
jest.mock('@/features/ai/components/AiVideoModal', () => ({
  AiVideoModal: ({ open }: { open: boolean }) => (
    open ? <div data-testid="ai-video-modal">AI Video Modal</div> : null
  ),
}))

// Mock AiMusicModal
jest.mock('@/features/ai/components/AiMusicModal', () => ({
  AiMusicModal: ({ open }: { open: boolean }) => (
    open ? <div data-testid="ai-music-modal">AI Music Modal</div> : null
  ),
}))

describe('CreateThreadForm', () => {
  const mockSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders in text mode by default and switches to markdown', async () => {
    render(<CreateThreadForm onSubmit={mockSubmit} loading={false} error={null} />)

    // Default Text mode
    expect(screen.getByPlaceholderText('Elaborate on your topic...')).toBeInTheDocument()
    expect(screen.queryByTestId('markdown-editor')).not.toBeInTheDocument()

    // Switch to Markdown
    fireEvent.click(screen.getByText('Markdown'))

    await waitFor(() => {
      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument()
      expect(screen.queryByPlaceholderText('Elaborate on your topic...')).not.toBeInTheDocument()
    })

    // Switch back to Text
    fireEvent.click(screen.getByText('Text'))
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Elaborate on your topic...')).toBeInTheDocument()
    })
  })

  it('preserves body content when switching modes', async () => {
    render(<CreateThreadForm onSubmit={mockSubmit} loading={false} error={null} />)

    // Type in Text mode
    const textInput = screen.getByPlaceholderText('Elaborate on your topic...')
    fireEvent.change(textInput, { target: { value: 'Shared content' } })

    // Switch to Markdown
    fireEvent.click(screen.getByText('Markdown'))

    await waitFor(() => {
      const markdownInput = screen.getByTestId('markdown-editor')
      expect(markdownInput).toHaveValue('Shared content')
    })
    
    // Type in Markdown mode
    const markdownInput = screen.getByTestId('markdown-editor')
    fireEvent.change(markdownInput, { target: { value: 'Shared content updated' } })

    // Switch back
    fireEvent.click(screen.getByText('Text'))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Elaborate on your topic...')).toHaveValue('Shared content updated')
    })
  })

  it('switches to video mode and shows video URL input', async () => {
    render(<CreateThreadForm onSubmit={mockSubmit} loading={false} error={null} />)

    // Switch to Video mode
    fireEvent.click(screen.getByText('Video'))

    await waitFor(() => {
      expect(screen.getByLabelText(/Video URL/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText('https://youtube.com/watch?v=...')).toBeInTheDocument()
      expect(screen.getByLabelText(/Description \(Optional\)/i)).toBeInTheDocument()
    })
  })

  it('switches to audio mode and shows audio URL input', async () => {
    render(<CreateThreadForm onSubmit={mockSubmit} loading={false} error={null} />)

    // Switch to Audio mode
    fireEvent.click(screen.getByText('Audio'))

    await waitFor(() => {
      expect(screen.getByLabelText(/Audio URL/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText('https://example.com/audio.mp3')).toBeInTheDocument()
      expect(screen.getByLabelText(/Description \(Optional\)/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for empty media URL in video mode', async () => {
    render(<CreateThreadForm onSubmit={mockSubmit} loading={false} error={null} />)

    // Switch to Video mode
    fireEvent.click(screen.getByText('Video'))

    await waitFor(() => {
      expect(screen.getByLabelText(/Video URL/i)).toBeInTheDocument()
    })

    // Blur the mediaUrl field to trigger validation
    const mediaUrlInput = screen.getByLabelText(/Video URL/i)
    fireEvent.blur(mediaUrlInput)

    await waitFor(() => {
      expect(screen.getByText(/Media URL is required/i)).toBeInTheDocument()
    })
  })

  it('renders image drop zone in all modes', async () => {
    render(<CreateThreadForm onSubmit={mockSubmit} loading={false} error={null} />)

    // Text mode
    expect(screen.getByTestId('image-drop-zone')).toBeInTheDocument()

    // Video mode
    fireEvent.click(screen.getByText('Video'))
    await waitFor(() => {
      expect(screen.getByTestId('image-drop-zone')).toBeInTheDocument()
    })

    // Audio mode
    fireEvent.click(screen.getByText('Audio'))
    await waitFor(() => {
      expect(screen.getByTestId('image-drop-zone')).toBeInTheDocument()
    })
  })

  it('opens AI modal and adds generated image', async () => {
    render(<CreateThreadForm onSubmit={mockSubmit} loading={false} error={null} />)

    // Find and click AI trigger button
    const aiButton = screen.getByText('Generate with AI')
    fireEvent.click(aiButton)

    // Check if modal opens (mocked AiImageModal renders a specific testid)
    expect(screen.getByTestId('ai-image-modal')).toBeInTheDocument()

    // Simulate image selection from modal
    const selectImageBtn = screen.getByText('Select Mock Image')
    fireEvent.click(selectImageBtn)

    // Standard drop zone should show the image (mocked in ImageDropZone)
    await waitFor(() => {
      expect(screen.getByText('Images: 1')).toBeInTheDocument()
    })
  })

  it('opens Video AI modal in video mode', async () => {
    render(<CreateThreadForm onSubmit={mockSubmit} loading={false} error={null} />)
    fireEvent.click(screen.getByText('Video'))

    const generateBtn = screen.getByText('Generate')
    fireEvent.click(generateBtn)
    
    expect(screen.getByTestId('ai-video-modal')).toBeInTheDocument()
  })

  it('opens Music AI modal in audio mode', async () => {
    render(<CreateThreadForm onSubmit={mockSubmit} loading={false} error={null} />)
    fireEvent.click(screen.getByText('Audio'))

    const generateBtn = screen.getByText('Generate')
    fireEvent.click(generateBtn)

    expect(screen.getByTestId('ai-music-modal')).toBeInTheDocument()
  })
})


