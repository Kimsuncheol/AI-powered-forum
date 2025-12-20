import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { AiImageModal } from '@/features/ai/components/AiImageModal'
import { aiService } from '@/features/ai/api/aiService'

// Mock aiService
jest.mock('@/features/ai/api/aiService', () => ({
  aiService: {
    generateImage: jest.fn(),
    editImage: jest.fn(),
  },
}))

// Mock react-dnd
jest.mock('react-dnd', () => ({
  useDrop: () => [{ isOver: false, canDrop: true }, jest.fn()],
  DndProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: {},
  NativeTypes: { FILE: 'FILE' },
}))

describe('AiImageModal', () => {
  const mockOnClose = jest.fn()
  const mockOnImageSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders nothing when open is false', () => {
    render(
      <AiImageModal open={false} onClose={mockOnClose} onImageSelect={mockOnImageSelect} />
    )
    expect(screen.queryByText('AI Image Studio')).not.toBeInTheDocument()
  })

  it('renders correctly when open is true', () => {
    render(
      <AiImageModal open={true} onClose={mockOnClose} onImageSelect={mockOnImageSelect} />
    )
    expect(screen.getByText('AI Image Studio')).toBeInTheDocument()
    expect(screen.getAllByText('Generate')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Edit')[0]).toBeInTheDocument()
  })

  it('does not render preview area initially', () => {
    render(
      <AiImageModal open={true} onClose={mockOnClose} onImageSelect={mockOnImageSelect} />
    )
    expect(screen.queryByAltText('AI Generated')).not.toBeInTheDocument()
    expect(screen.queryByText('Preview area')).not.toBeInTheDocument()
  })

  it('handles image generation flow', async () => {
    (aiService.generateImage as jest.Mock).mockResolvedValue({
      b64_json: 'test_base64_image_data',
      revised_prompt: 'test revised prompt',
    })

    render(
      <AiImageModal open={true} onClose={mockOnClose} onImageSelect={mockOnImageSelect} />
    )

    // Enter prompt
    const promptInput = screen.getByPlaceholderText(/A futuristic city/i)
    fireEvent.change(promptInput, { target: { value: 'A cool cat' } })

    // Click Generate
    const generateBtn = screen.getByTestId('ai-action-button')
    fireEvent.click(generateBtn)

    expect(aiService.generateImage).toHaveBeenCalledWith('A cool cat')

    // Wait for result
    await waitFor(() => {
      expect(screen.getByAltText('AI Generated')).toBeInTheDocument()
    })

    // Click Add to Thread
    const addBtn = screen.getByText('Add to Thread')
    fireEvent.click(addBtn)

    expect(mockOnImageSelect).toHaveBeenCalledWith('data:image/png;base64,test_base64_image_data')
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('switches tabs and shows edit UI', () => {
    render(
      <AiImageModal open={true} onClose={mockOnClose} onImageSelect={mockOnImageSelect} />
    )

    // Switch to Edit tab
    fireEvent.click(screen.getByText('Edit', { selector: 'button' })) // MUI Tab is a button role

    expect(screen.getByText(/Drag and drop an image here to edit/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Make the sky purple/i)).toBeInTheDocument()
  })

  it('show error message on generation failure', async () => {
    (aiService.generateImage as jest.Mock).mockRejectedValue(new Error('API error'))

    render(
      <AiImageModal open={true} onClose={mockOnClose} onImageSelect={mockOnImageSelect} />
    )

    const promptInput = screen.getByPlaceholderText(/A futuristic city/i)
    fireEvent.change(promptInput, { target: { value: 'Fail prompt' } })

    const generateBtn = screen.getByTestId('ai-action-button')
    fireEvent.click(generateBtn)

    await waitFor(() => {
      expect(screen.getByText('Failed to generate image. Please try again.')).toBeInTheDocument()
    })
  })
})
