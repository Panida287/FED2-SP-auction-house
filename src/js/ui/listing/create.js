import { createListing } from "../../api/listing/create";
import { setupPreview } from "../../utilities/preview";
import { toggleContainer } from "../../utilities/toggleContainer";

/**
 * Handles the Create Listing functionality, including image preview and form submission.
 *
 * @function onCreate
 * @async
 * @param {Event} event - The form submission event.
 */
export async function onCreate(event) {
  event.preventDefault();

  const titleInput = document.getElementById("item-name");
  const descriptionInput = document.getElementById("item-description");
  const categorySelect = document.getElementById("item-category");
  const mediaUrlInput = document.getElementById("item-image-url");
  const durationInput = document.getElementById("auction-duration");
  const previewImage = document.getElementById("preview-image");

  setupPreview(mediaUrlInput, previewImage, titleInput?.value.trim());

  const duration = parseInt(durationInput?.value.trim());
  if (isNaN(duration) || duration < 1 || duration > 365) {
    alert("Please enter a valid auction duration between 1 and 365 days.");
    return;
  }

  const currentDate = new Date();
  const endsAt = new Date(currentDate.getTime() + duration * 24 * 60 * 60 * 1000);

  const tags = Array.from(categorySelect?.selectedOptions).map((option) => option.value);

  const media = [{ url: mediaUrlInput?.value.trim(), alt: titleInput?.value.trim() }];

  try {
    await createListing({
      title: titleInput?.value.trim(),
      description: descriptionInput?.value.trim(),
      tags,
      media,
      endsAt: endsAt.toISOString(),
    });

    // Handle success
    alert("Listing created successfully!");
    location.reload();
  } catch (error) {
    alert("Failed to create listing. Please try again.");
  }
}

/**
 * Sets up the Create Listing functionality, including toggling visibility and event listeners.
 */
export function setupCreateListing() {
  const createListingBtn = document.getElementById("create-listing-btn");
  const createListingContainer = document.getElementById("create-container");
  const listingForm = document.getElementById("listing-form");
  const cancelBtn = document.getElementById("cancel-create-btn");
  const previewImage = document.getElementById("preview-image");
  const mediaUrlInput = document.getElementById("item-image-url");
  const overlay = document.querySelector(".overlay");

  setupPreview(mediaUrlInput, previewImage);

  if (createListingBtn) {
    createListingBtn.addEventListener("click", () => {
      toggleContainer(createListingContainer, true);
      toggleContainer(overlay, true);
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      toggleContainer(createListingContainer, false);
      toggleContainer(overlay, false);
      listingForm?.reset();
    });
  }

  listingForm?.addEventListener("submit", onCreate);
}