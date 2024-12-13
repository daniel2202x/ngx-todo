export function applyMobileFixes() {
    // prevent pinch zooming on mobile
    document.addEventListener('touchstart', e => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
}