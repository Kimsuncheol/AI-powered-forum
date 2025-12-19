import { render, screen, cleanup } from '@testing-library/react'
import { ImageDropZone } from '@/features/thread/create/components/ImageDropZone'

// Mock react-dnd
jest.mock('react-dnd', () => ({
  useDrop: () => [{ isOver: false, canDrop: true }, jest.fn()],
  DndProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: {},
  NativeTypes: { FILE: 'FILE' },
}))

describe('ImageDropZone', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders drop zone with correct text', () => {
    render(
      <ImageDropZone
        images={[]}
        onChange={mockOnChange}
        maxImages={4}
      />
    )

    expect(screen.getByTestId('image-drop-zone')).toBeInTheDocument()
    expect(screen.getByText(/Drag and drop images here.*0\/4/i)).toBeInTheDocument()
    expect(screen.getByText(/Supports: JPG, PNG, GIF, WebP/i)).toBeInTheDocument()
  })

  it('renders image previews when images are provided', () => {
    const testImages = [
      'data:image/png;base64,test1',
      'data:image/png;base64,test2',
    ]

    render(
      <ImageDropZone
        images={testImages}
        onChange={mockOnChange}
        maxImages={4}
      />
    )

    expect(screen.getByText(/2\/4/)).toBeInTheDocument()
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
  })

  it('shows disabled state when disabled prop is true', () => {
    render(
      <ImageDropZone
        images={[]}
        onChange={mockOnChange}
        disabled={true}
        maxImages={4}
      />
    )

    const dropZone = screen.getByTestId('image-drop-zone')
    expect(dropZone).toHaveStyle({ cursor: 'not-allowed' })
  })
})
