import { render, screen, fireEvent } from "@testing-library/react";
import { CreateThreadForm } from "@/features/thread/create/components/CreateThreadForm";

// Mock MarkdownEditor to avoid react-markdown parsing issues
jest.mock("@/features/thread/create/components/MarkdownEditor", () => {
  const MarkdownEditorMock = ({ value, onChange }: any) => (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} data-testid="markdown-editor" />
  );
  MarkdownEditorMock.displayName = "MarkdownEditorMock";
  return { MarkdownEditor: MarkdownEditorMock };
});

describe("CreateThreadForm - NSFW", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders NSFW checkbox", () => {
    render(<CreateThreadForm onSubmit={mockOnSubmit} loading={false} error={null} />);
    
    expect(screen.getByText("Mark as NSFW (Not Safe For Work)")).toBeInTheDocument();
    expect(screen.getByText("Check this if your content contains sensitive material")).toBeInTheDocument();
  });

  it("NSFW checkbox is unchecked by default", () => {
    render(<CreateThreadForm onSubmit={mockOnSubmit} loading={false} error={null} />);
    
    const checkboxes = screen.getAllByRole("checkbox");
    const nsfwCheckbox = checkboxes.find(cb => cb.closest('label')?.textContent?.includes('NSFW'));
    expect(nsfwCheckbox).toBeDefined();
    expect(nsfwCheckbox).not.toBeChecked();
  });

  it("toggles NSFW checkbox", () => {
    render(<CreateThreadForm onSubmit={mockOnSubmit} loading={false} error={null} />);
    
    const checkboxes = screen.getAllByRole("checkbox");
    const nsfwCheckbox = checkboxes.find(cb => cb.closest('label')?.textContent?.includes('NSFW'))!;
    
    fireEvent.click(nsfwCheckbox);
    expect(nsfwCheckbox).toBeChecked();
    
    fireEvent.click(nsfwCheckbox);
    expect(nsfwCheckbox).not.toBeChecked();
  });

  it("includes isNSFW in submission when checked", async () => {
    render(<CreateThreadForm onSubmit={mockOnSubmit} loading={false} error={null} />);
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Thread" },
    });
    fireEvent.change(screen.getByLabelText(/body/i), {
      target: { value: "Test content" },
    });
    fireEvent.mouseDown(screen.getByLabelText(/category/i));
    const listbox = screen.getByRole("listbox");
    fireEvent.click(listbox.querySelector('li')!);
    
    // Check NSFW
    const checkboxes = screen.getAllByRole("checkbox");
    const nsfwCheckbox = checkboxes.find(cb => cb.closest('label')?.textContent?.includes('NSFW'))!;
    fireEvent.click(nsfwCheckbox);
    
    // Submit
    const submitButton = screen.getByText("Publish");
    fireEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        isNSFW: true,
      })
    );
  });

  it("includes isNSFW: false in  submission when unchecked", async () => {
    render(<CreateThreadForm onSubmit={mockOnSubmit} loading={false} error={null} />);
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Thread" },
    });
    fireEvent.change(screen.getByLabelText(/body/i), {
      target: { value: "Test content" },
    });
    fireEvent.mouseDown(screen.getByLabelText(/category/i));
    const listbox = screen.getByRole("listbox");
    fireEvent.click(listbox.querySelector('li')!);
    
    // Submit without checking NSFW
    const submitButton = screen.getByText("Publish");
    fireEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        isNSFW: false,
      })
    );
  });

  it("disables NSFW checkbox when loading", () => {
    render(<CreateThreadForm onSubmit={mockOnSubmit} loading={true} error={null} />);
    
    const checkboxes = screen.getAllByRole("checkbox");
    const nsfwCheckbox = checkboxes.find(cb => cb.closest('label')?.textContent?.includes('NSFW'));
    expect(nsfwCheckbox).toBeDisabled();
  });
});
