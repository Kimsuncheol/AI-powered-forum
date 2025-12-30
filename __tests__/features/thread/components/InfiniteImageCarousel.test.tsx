import React from "react";
import { render, screen } from "@testing-library/react";
import InfiniteImageCarousel from "@/features/thread/components/InfiniteImageCarousel";

// Mock next/dynamic
jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: (...args: unknown[]) => {
    const Component = ({ children }: { children?: React.ReactNode }) => {
      // Return a primitive representation to verify rendering
      return <div data-testid="mock-dynamic-component">{children}</div>;
    };
    return Component;
  },
}));

// Mock Swiper components specifically to avoid issues with ESM/styles
jest.mock("swiper/react", () => ({
  Swiper: ({ children, onSwiper }: { children?: React.ReactNode; onSwiper?: (swiper: unknown) => void }) => {
    // Simulate onSwiper call if needed
    React.useEffect(() => {
      if (onSwiper) onSwiper({ slidePrev: jest.fn(), slideNext: jest.fn(), slideTo: jest.fn() });
    }, [onSwiper]);
    return <div data-testid="swiper-root">{children}</div>;
  },
  SwiperSlide: ({ children }: { children?: React.ReactNode }) => <div data-testid="swiper-slide">{children}</div>,
}));

// Mock styles
jest.mock("swiper/css", () => ({}));
jest.mock("swiper/css/navigation", () => ({}));
jest.mock("swiper/css/pagination", () => ({}));

describe("InfiniteImageCarousel", () => {
  const mockImages = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
  ];

  it("renders nothing when images list is empty", () => {
    const { container } = render(<InfiniteImageCarousel images={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders Swiper slides for each image", () => {
    render(<InfiniteImageCarousel images={mockImages} />);
    
    // Check for slides
    const slides = screen.getAllByRole("img");
    expect(slides).toHaveLength(mockImages.length);
    expect(slides[0]).toHaveAttribute("src", mockImages[0]);
  });

  it("shows navigation controls and pagination when multiple images are provided", () => {
    render(<InfiniteImageCarousel images={mockImages} />);
    
    // Check for navigation buttons (ChevronLeft and ChevronRight icons are rendered inside buttons)
    // We can check by aria-label if we added one, or by just checking for icons
    // In our component, we didn't add labels to the nav icons specifically, but we can find them
    const navButtons = screen.getAllByRole("button");
    expect(navButtons.length).toBeGreaterThanOrEqual(2); // Prev/Next buttons
  });

  it("does not show navigation/pagination when only one image is provided", () => {
    render(<InfiniteImageCarousel images={[mockImages[0]]} />);
    
    // Only slides should be rendered, no nav buttons
    const navButtons = screen.queryAllByRole("button");
    expect(navButtons).toHaveLength(0);
  });
});
