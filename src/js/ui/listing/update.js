import { updateListing } from "../../api/listing/update";
import { getIDFromURL } from "../../utilities/urlIDUtils";

/**
 * Handles the submission of the update form.
 */
export async function onUpdate(event) {
  event.preventDefault();

  const titleInput = document.getElementById("listing-name");
  const descriptionInput = document.getElementById("listing-description");
  const categorySelect = document.getElementById("listing-category");
  const mediaUrlInput = document.getElementById("listing-image-url");

  // Retrieve the Listing ID
  const listingId = getIDFromURL("listingID");

  if (!listingId) {
    alert("Listing ID not found.");
    return;
  }

  const tags = [categorySelect.value];
  const media = [{ url: mediaUrlInput?.value.trim(), alt: titleInput?.value.trim() }];

  try {
    await updateListing(listingId, {
      title: titleInput?.value.trim(),
      description: descriptionInput?.value.trim(),
      tags,
      media,
    });

    alert("Listing updated successfully!");
    location.reload();
  } catch (error) {
    alert("Failed to update listing. Please try again.");
  }
}



