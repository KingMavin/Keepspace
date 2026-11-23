/**
 * Lightweight haptic pulse helper.
 * Uses Android/Web Vibration API where supported; no-ops gracefully on iOS Safari & desktop.
 */
function pulse(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore if blocked by browser policy
    }
  }
}

export const haptics = {
  light: () => pulse(10),
  medium: () => pulse(18),
  success: () => pulse([12, 45, 20]),
  warning: () => pulse([22, 40, 22]),
};
