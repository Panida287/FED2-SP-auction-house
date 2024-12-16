import { getIDFromURL } from "../../utilities/urlIDUtils";
import { deleteListing } from "../../api/listing/delete";

/**
 * Handles the deletion of a listing.
 * 
 * @async
 * @function onDelete
 * @param {Event} [event] - The event triggered by the delete action (optional).
 * @returns {Promise<void>} Redirects to the profile page on successful deletion.
 * @throws Will alert the user if the deletion fails or the listing ID is not found.
 */
export async function onDelete(event) {
  if (event) event.preventDefault();

  const listingId = getIDFromURL("listingID");

  if (!listingId) {
    alert("Listing ID not found.");
    return;
  }

  try {
    await deleteListing(listingId);
    alert("Listing deleted successfully!");
    window.location.href = "/profile/"; 
  } catch (error) {
    alert("Failed to delete listing. Please try again.");
  }
}
