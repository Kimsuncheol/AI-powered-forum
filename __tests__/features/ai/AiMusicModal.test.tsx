import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AiMusicModal } from '@/features/ai/components/AiMusicModal'
import { aiService } from '@/features/ai/api/aiService'

jest.mock('@/features/ai/api/aiService', () => ({
  aiService: {
    generateSimpleMusic: jest.fn(),
  },
}))

describe('AiMusicModal', () => {
  const mockOnClose = jest.fn()
  const mockOnMusicSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    render(<AiMusicModal open={true} onClose={mockOnClose} onMusicSelect={mockOnMusicSelect} />)
    expect(screen.getByText('AI Music Studio (Lyria)')).toBeInTheDocument()
  })

  it('handles music generation', async () => {
    (aiService.generateSimpleMusic as jest.Mock).mockResolvedValue({
      audio_url: 'http://example.com/music.mp3',
    })

    render(<AiMusicModal open={true} onClose={mockOnClose} onMusicSelect={mockOnMusicSelect} />)

    fireEvent.change(screen.getByLabelText(/Describe the music/i), {
      target: { value: 'Funky beat' },
    })

    fireEvent.click(screen.getByTestId('generate-music-btn'))

    expect(aiService.generateSimpleMusic).toHaveBeenCalledWith('Funky beat')

    await waitFor(() => {
      expect(screen.getByText('Add to Thread')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Add to Thread'))
    expect(mockOnMusicSelect).toHaveBeenCalledWith('http://example.com/music.mp3')
  })
})
