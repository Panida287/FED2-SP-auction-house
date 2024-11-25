import { getIDFromURL } from "../../utilities/urlIDUtils";
import { deleteListing } from "../../api/listing/delete"; // Make sure you have this function

export async function onDelete(event) {
    if (event) event.preventDefault(); // Handle the event if it's passed
  
    const listingId = getIDFromURL("listingID");
  
    if (!listingId) {
      alert("Listing ID not found.");
      return;
    }
  
    try {
      await deleteListing(listingId);
  
      // Handle success
      alert("Listing deleted successfully!");
      window.location.href = "/profile/"; // Redirect to profile page
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Failed to delete listing. Please try again.");
    }
  }
  
