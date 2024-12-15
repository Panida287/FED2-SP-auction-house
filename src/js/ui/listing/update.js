import { updateListing } from "../../api/listing/update";
import { getIDFromURL } from "../../utilities/urlIDUtils";

/**
 * Handles the submission of the update form.
 */
export async function onUpdate(event) {
  event.preventDefault(); // Prevent default form submission

  // Select form elements
  const titleInput = document.getElementById("listing-name");
  const descriptionInput = document.getElementById("listing-description");
  const categorySelect = document.getElementById("listing-category");
  const mediaUrlInput = document.getElementById("listing-image-url");

  // Retrieve the Listing ID
  const listingId = getIDFromURL("listingID"); // Use your utility function

  if (!listingId) {
    alert("Listing ID not found.");
    return;
  }

  // Prepare data for the update
  const tags = [categorySelect.value]; // Use the selected category as the tag
  const media = [{ url: mediaUrlInput?.value.trim(), alt: titleInput?.value.trim() }];

  try {
    // Call the API to update the listing
    await updateListing(listingId, {
      title: titleInput?.value.trim(),
      description: descriptionInput?.value.trim(),
      tags,
      media,
    });

    // Handle success
    alert("Listing updated successfully!");
    location.reload(); // Reload the page after success
  } catch (error) {
    // Handle errors
    console.error("Error updating listing:", error);
    alert("Failed to update listing. Please try again.");
  }
}



