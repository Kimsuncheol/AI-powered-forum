import { renderHook, act, waitFor } from "@testing-library/react";
import { useAiQuota } from "../hooks/useAiQuota";
import { useAuth } from "@/context/AuthContext";
import * as quotaRepo from "../repositories/aiQuotaRepo";

// Mock dependencies
jest.mock("@/context/AuthContext");
jest.mock("../repositories/aiQuotaRepo");

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockGetUserQuota = quotaRepo.getUserQuota as jest.MockedFunction<typeof quotaRepo.getUserQuota>;
const mockCheckQuotaAvailable = quotaRepo.checkQuotaAvailable as jest.MockedFunction<typeof quotaRepo.checkQuotaAvailable>;
const mockIncrementUsage = quotaRepo.incrementUsage as jest.MockedFunction<typeof quotaRepo.incrementUsage>;

describe("useAiQuota", () => {
  const mockUser = { uid: "test-user-123" } as any;
  const mockQuota = {
    userId: "test-user-123",
    image: { used: 5, limit: 10, resetDate: Date.now() + 86400000 },
    video: { used: 2, limit: 5, resetDate: Date.now() + 86400000 },
    music: { used: 0, limit: 5, resetDate: Date.now() + 86400000 },
    text: { used: 10, limit: 50, resetDate: Date.now() + 86400000 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: mockUser } as any);
  });

  it("should fetch quota on mount", async () => {
    mockGetUserQuota.mockResolvedValue(mockQuota);
    mockCheckQuotaAvailable.mockResolvedValue({
      available: true,
      remaining: 5,
      limit: 10,
    });

    const { result } = renderHook(() => useAiQuota('image'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.quota).toEqual(mockQuota);
    expect(result.current.remaining).toBe(5);
    expect(result.current.limit).toBe(10);
    expect(result.current.hasQuota).toBe(true);
  });

  it("should return null quota when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({ user: null } as any);

    const { result } = renderHook(() => useAiQuota('image'));

    expect(result.current.quota).toBeNull();
    expect(result.current.status).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("should consume quota successfully", async () => {
    mockGetUserQuota.mockResolvedValue(mockQuota);
    mockCheckQuotaAvailable
      .mockResolvedValueOnce({ available: true, remaining: 5, limit: 10 })
      .mockResolvedValueOnce({ available: true, remaining: 4, limit: 10 });
    mockIncrementUsage.mockResolvedValue();

    const { result } = renderHook(() => useAiQuota('image'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let consumed = false;
    await act(async () => {
      consumed = await result.current.consumeQuota();
    });

    expect(consumed).toBe(true);
    expect(mockIncrementUsage).toHaveBeenCalledWith("test-user-123", "image");
  });

  it("should fail to consume quota when limit reached", async () => {
    mockGetUserQuota.mockResolvedValue(mockQuota);
    mockCheckQuotaAvailable.mockResolvedValue({
      available: false,
      remaining: 0,
      limit: 10,
    });

    const { result } = renderHook(() => useAiQuota('image'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let consumed = false;
    await act(async () => {
      consumed = await result.current.consumeQuota();
    });

    expect(consumed).toBe(false);
    expect(result.current.error).toContain("monthly limit");
    expect(mockIncrementUsage).not.toHaveBeenCalled();
  });

  it("should refresh quota", async () => {
    mockGetUserQuota.mockResolvedValue(mockQuota);
    mockCheckQuotaAvailable.mockResolvedValue({
      available: true,
      remaining: 5,
      limit: 10,
    });

    const { result } = renderHook(() => useAiQuota('image'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.refreshQuota();
    });

    expect(mockGetUserQuota).toHaveBeenCalledTimes(2);
  });
});
