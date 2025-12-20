import { renderHook, act } from "@testing-library/react";
import { SettingsProvider, useSettings } from "@/context/SettingsContext";

describe("SettingsContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SettingsProvider>{children}</SettingsProvider>
  );

  it("should provide default settings", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });
    expect(result.current.autoPlayEnabled).toBe(false);
  });

  it("should toggle autoPlayEnabled", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });
    
    act(() => {
      result.current.toggleAutoPlay();
    });
    expect(result.current.autoPlayEnabled).toBe(true);
    expect(localStorage.getItem("settings_autoPlay")).toBe("true");

    act(() => {
      result.current.toggleAutoPlay();
    });
    expect(result.current.autoPlayEnabled).toBe(false);
    expect(localStorage.getItem("settings_autoPlay")).toBe("false");
  });

  it("should initialize from localStorage", () => {
    localStorage.setItem("settings_autoPlay", "true");
    const { result } = renderHook(() => useSettings(), { wrapper });
    expect(result.current.autoPlayEnabled).toBe(true);
  });
});
