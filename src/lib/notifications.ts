/**
 * Desktop notification utility.
 *
 * Requests permission on first call and sends browser notifications
 * for agent approvals, task completions, etc.
 */

let permissionGranted = false;

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") {
    permissionGranted = true;
    return true;
  }
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  permissionGranted = result === "granted";
  return permissionGranted;
}

export function sendNotification(title: string, options?: NotificationOptions): void {
  if (!permissionGranted) return;
  if (typeof window === "undefined" || !("Notification" in window)) return;
  // Don't notify if the tab is focused
  if (document.hasFocus()) return;
  try {
    new Notification(title, {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      ...options,
    });
  } catch {
    // Silent fail — some environments don't support notifications
  }
}

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}
