/**
 * Adds a "back to top" functionality to a specified button.
 * When clicked, it scrolls the page smoothly to a target position.
 *
 * @function backToTop
 * @param {string} targetId - The ID of the button element that triggers the scroll.
 * @param {number} scrollPosition - The vertical position (in pixels) to scroll to.
 */
export function backToTop(targetId, scrollPosition) {
  const backToTopBtn = document.getElementById(targetId);

  if (!backToTopBtn) {
    console.warn(`Button with ID "${targetId}" not found.`);
    return;
  }

  backToTopBtn.addEventListener("click", () => {
    const scrollTarget =
      document.documentElement.scrollTop ? document.documentElement : document.body;

    scrollTarget.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  });
}
