/**
 * Sets up a media preview dynamically based on user input and programmatic updates.
 *
 * @param {HTMLInputElement} mediaUrlInput - The media URL input element.
 * @param {HTMLImageElement} previewImage - The image element for the preview.
 * @param {string} [title=""] - The title of the listing (used as alt text).
 */
export function setupPreview(mediaUrlInput, previewImage, title = "") {
  const updatePreview = () => {
    if (mediaUrlInput.value.trim()) {
      previewImage.src = mediaUrlInput.value.trim();
      previewImage.alt = title || "Image Preview";
      previewImage.classList.remove("hidden");
    } else {
      previewImage.src = "";
      previewImage.alt = "";
      previewImage.classList.add("hidden");
    }
  };

  updatePreview();

  mediaUrlInput.addEventListener("input", updatePreview);
}
