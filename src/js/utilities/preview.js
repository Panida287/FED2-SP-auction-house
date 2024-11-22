/**
 * Sets up a media preview dynamically based on user input.
 *
 * @param {HTMLInputElement} mediaUrlInput - The media URL input element.
 * @param {HTMLImageElement} previewImage - The image element for the preview.
 * @param {string} [title=""] - The title of the listing (used as alt text).
 */
export function setupPreview(mediaUrlInput, previewImage, title = "") {
  mediaUrlInput.addEventListener("input", () => {
    if (mediaUrlInput.value) {
      previewImage.src = mediaUrlInput.value;
      previewImage.alt = title || "Image Preview";
      previewImage.classList.remove("hidden");
    } else {
      previewImage.classList.add("hidden");
    }
  });
}
