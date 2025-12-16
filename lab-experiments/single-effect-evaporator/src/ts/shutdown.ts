const shutdownModal = document.getElementById('warning-container') as HTMLDivElement;
const shutdownMessage = document.getElementById('warning-message') as HTMLSpanElement;

var shutdownTimeout: number | null = null;
export function triggerShutdown(message: string) {
    shutdownMessage.textContent = message + ". Steam supply has been shut off.";
    shutdownModal.style.opacity = '1';

    if (shutdownTimeout !== null) {
        clearTimeout(shutdownTimeout);
    }
    shutdownTimeout = window.setTimeout(() => {
        clearShutdown();
        shutdownTimeout = null;
    }, 5000);
}

function clearShutdown() {
    shutdownModal.style.opacity = '0';
}