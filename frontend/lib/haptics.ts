/**
 * Triggers device haptic feedback if supported by the browser/OS.
 * Useful for adding micro-interactions to buttons, notifications, and form submissions.
 */
export const triggerHaptic = (type: "light" | "medium" | "heavy" | "success" | "warning" | "error" = "light"): void => {
    if (typeof window === "undefined" || !window.navigator || !window.navigator.vibrate) {
        return;
    }

    try {
        switch (type) {
            case "light":
                window.navigator.vibrate(10);
                break;
            case "medium":
                window.navigator.vibrate(20);
                break;
            case "heavy":
                window.navigator.vibrate(40);
                break;
            case "success":
                window.navigator.vibrate([15, 50, 15]);
                break;
            case "warning":
                window.navigator.vibrate([30, 40, 30]);
                break;
            case "error":
                window.navigator.vibrate([50, 50, 50, 50, 50]);
                break;
            default:
                window.navigator.vibrate(15);
                break;
        }
    } catch (error) {
        console.debug("Haptic feedback not allowed or failed", error);
    }
};
