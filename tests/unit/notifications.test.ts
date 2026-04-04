// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach } from "vitest";

describe("notifications", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("isNotificationSupported returns true in jsdom with Notification", async () => {
    // jsdom doesn't have Notification by default, mock it
    Object.defineProperty(window, "Notification", {
      value: { permission: "default", requestPermission: vi.fn() },
      writable: true,
      configurable: true,
    });
    const { isNotificationSupported } = await import("../../src/lib/notifications");
    expect(isNotificationSupported()).toBe(true);
  });

  it("getNotificationPermission returns current permission", async () => {
    Object.defineProperty(window, "Notification", {
      value: { permission: "granted", requestPermission: vi.fn() },
      writable: true,
      configurable: true,
    });
    const { getNotificationPermission } = await import("../../src/lib/notifications");
    expect(getNotificationPermission()).toBe("granted");
  });

  it("requestNotificationPermission calls Notification.requestPermission", async () => {
    const mockRequest = vi.fn().mockResolvedValue("granted");
    Object.defineProperty(window, "Notification", {
      value: { permission: "default", requestPermission: mockRequest },
      writable: true,
      configurable: true,
    });
    const { requestNotificationPermission } = await import("../../src/lib/notifications");
    const result = await requestNotificationPermission();
    expect(mockRequest).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it("returns false when permission is denied", async () => {
    const mockRequest = vi.fn().mockResolvedValue("denied");
    Object.defineProperty(window, "Notification", {
      value: { permission: "default", requestPermission: mockRequest },
      writable: true,
      configurable: true,
    });
    const { requestNotificationPermission } = await import("../../src/lib/notifications");
    const result = await requestNotificationPermission();
    expect(result).toBe(false);
  });
});
