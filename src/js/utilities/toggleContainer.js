/**
 * Toggles visibility of a container.
 *
 * @param {HTMLElement} container - The container to toggle.
 * @param {boolean} show - Whether to show or hide the container.
 */
export function toggleContainer(container, show) {
  if (container) {
    container.classList.toggle("hidden", !show);
    container.classList.toggle("flex", show);
  }
}
