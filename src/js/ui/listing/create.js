import { createListing } from "../../api/listing/create";
import { setupPreview } from "../../utilities/preview";
import { toggleContainer } from "../../utilities/toggleContainer";

/**
 * Handles the Create Listing functionality, including image preview and form submission.
 *
 * @function onCreate
 * @async
 *
 * @param {Event} event - The form submission event.
 */
export async function onCreate(event) {
  event.preventDefault(); // Prevent default form submission

  const titleInput = document.getElementById("item-name");
  const descriptionInput = document.getElementById("item-description");
  const categorySelect = document.getElementById("item-category");
  const mediaUrlInput = document.getElementById("item-image-url");
  const endsAtInput = document.getElementById("item-ends-at");
  const previewImage = document.getElementById("preview-image");

  // Dynamically update the image preview
  setupPreview(mediaUrlInput, previewImage, titleInput?.value.trim());

  // Collect selected category tags
  const tags = Array.from(categorySelect?.selectedOptions).map((option) => option.value);

  // Construct media array with title as alt text
  const media = [{ url: mediaUrlInput?.value.trim(), alt: titleInput?.value.trim() }];

  try {
    // Call the API to create the listing
    await createListing({
      title: titleInput?.value.trim(),
      description: descriptionInput?.value.trim(),
      tags,
      media,
      endsAt: new Date(endsAtInput?.value).toISOString(),
    });

    // Handle success
    alert("Listing created successfully!");
    location.reload();
  } catch (error) {
    // Handle errors
    console.error("Error creating listing:", error);
    alert("Failed to create listing. Please try again.");
  }
}

export function setupCreateListing() {
  const createListingBtn = document.getElementById("create-listing-btn");
  const createListingContainer = document.getElementById("create-container");
  const listingForm = document.getElementById("listing-form");
  const cancelBtn = document.getElementById("cancel-create-btn");
  const previewImage = document.getElementById("preview-image");
  const mediaUrlInput = document.getElementById("item-image-url");

  // Initialize media preview
  setupPreview(mediaUrlInput, previewImage);

  if (createListingBtn) {
    createListingBtn.addEventListener("click", () => {
      toggleContainer(createListingContainer, true);
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      toggleContainer(createListingContainer, false);
      listingForm?.reset();
    });
  }

  listingForm?.addEventListener("submit", onCreate);
}


