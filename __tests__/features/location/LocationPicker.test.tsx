
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LocationPicker from "@/features/location/components/LocationPicker";
import "@testing-library/jest-dom";

// Mock @react-google-maps/api
jest.mock("@react-google-maps/api", () => ({
  useLoadScript: () => ({
    isLoaded: true,
    loadError: null,
  }),
  GoogleMap: ({ children, onLoad, center }: any) => {
    // Simulate onLoad to test map instance capture
    if (onLoad) {
      setTimeout(() => onLoad({ panTo: jest.fn(), setZoom: jest.fn() }), 0);
    }
    return (
      <div data-testid="google-map">
        Map Center: {center.lat}, {center.lng}
        {children}
      </div>
    );
  },
  Marker: () => <div data-testid="map-marker" />,
}));

// Mock use-places-autocomplete
jest.mock("use-places-autocomplete", () => {
  const actual = jest.requireActual("use-places-autocomplete");
  return {
    __esModule: true,
    default: () => ({
      ready: true,
      value: "",
      suggestions: {
        status: "OK",
        data: [{ place_id: "place_123", description: "Seoul, South Korea" }],
      },
      setValue: jest.fn(),
      clearSuggestions: jest.fn(),
    }),
    getGeocode: jest.fn(() => Promise.resolve([{ place_id: "place_123" }])),
    getLatLng: jest.fn(() => Promise.resolve({ lat: 37.5665, lng: 126.978 })),
  };
});

describe("LocationPicker", () => {
  it("renders the map and search input", () => {
    render(<LocationPicker onChange={jest.fn()} />);
    expect(screen.getByPlaceholderText("Search for a place...")).toBeInTheDocument();
    expect(screen.getByTestId("google-map")).toBeInTheDocument();
  });

  it("calls onChange when a place is selected", async () => {
    const mockOnChange = jest.fn();
    render(<LocationPicker onChange={mockOnChange} />);

    // Simulate selecting a suggestion
    // Note: Since we mocked the hook to always return suggestions, we can just find it.
    // In a real integration test we'd type into the input first.
    const suggestion = await screen.findByText("Seoul, South Korea");
    fireEvent.click(suggestion);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          address: "Seoul, South Korea",
          lat: 37.5665,
          lng: 126.978,
          name: "Seoul", 
        })
      );
    });
  });

  it("updates map center when value is provided", () => {
    const value = {
      address: "Seoul",
      lat: 37.5665,
      lng: 126.978,
      name: "Seoul"
    };
    render(<LocationPicker value={value} onChange={jest.fn()} />);
    
    expect(screen.getByTestId("google-map")).toHaveTextContent("Map Center: 37.5665, 126.978");
    expect(screen.getByTestId("map-marker")).toBeInTheDocument();
  });
});
