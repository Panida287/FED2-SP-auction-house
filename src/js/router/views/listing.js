import { renderListingById } from "../../ui/listing/display";
import { renderProfile } from "../../ui/profile/renderProfile";
import { setupBidForm } from "../../ui/listing/placeBid";
import { readListing } from "../../api/listing/read";
import { setupPreview } from "../../utilities/preview";
import { toggleContainer } from "../../utilities/toggleContainer";
import { onUpdate } from "../../ui/listing/update";

renderListingById();
renderProfile();
setupBidForm();
setupUpdateListing();

export async function populateUpdateForm() {
    try {
      const listing = await readListing(); // Fetch the listing data
      if (!listing) {
        throw new Error("Failed to fetch listing data.");
      }
  
      console.log("Fetched listing:", listing); // Log the listing here
  
      // Select form elements
      const titleInput = document.getElementById("item-name");
      const descriptionInput = document.getElementById("item-description");
      const categorySelect = document.getElementById("item-category");
      const mediaUrlInput = document.getElementById("item-image-url");
      const previewImage = document.getElementById("preview-image");
  
      // Populate the form fields
      titleInput.value = listing.title || "";
      mediaUrlInput.value = listing.media?.[0]?.url || "";
      descriptionInput.value = listing.description || "";
  
      // Trigger preview image display
      setupPreview(mediaUrlInput, previewImage, titleInput.value);
  
      // Handle category dropdown
      const selectedTag = listing.tags?.[0]; // Assume the first tag represents the category
      let matchFound = false;
      Array.from(categorySelect.options).forEach((option) => {
        if (option.value === selectedTag) {
          option.selected = true;
          matchFound = true;
        } else {
          option.selected = false;
        }
      });
  
      // If no match is found, set the dropdown to "Please select category"
      if (!matchFound) {
        categorySelect.selectedIndex = 0; // Set to the first option (default)
      }
    } catch (error) {
      console.error("Error populating update form:", error);
    }
  }
  
  
  function setupUpdateListing() {
    const editBtn = document.getElementById("edit-listing-btn"); // Edit button
    const editListingContainer = document.getElementById("edit-listing-container");
    const listingForm = document.getElementById("edit-listing-form"); // Use correct form ID
    const cancelBtn = document.getElementById("cancel-edit-btn");
  
  
    if (editBtn && editListingContainer) {
      // Toggle the edit modal when the edit button is clicked
      editBtn.addEventListener("click", async () => {
        console.log("Edit button clicked");
  
        // Prevent multiple toggles
        if (editListingContainer.classList.contains("hidden")) {
          await populateUpdateForm(); // Populate the form with listing data
          toggleContainer(editListingContainer, true); // Open the modal
        }
      });
    }
  
    if (cancelBtn) {
      // Close the modal and reset the form when the cancel button is clicked
      cancelBtn.addEventListener("click", () => {
        toggleContainer(editListingContainer, false);
        listingForm?.reset();
      });
    }
  
    // Handle form submission
    listingForm?.addEventListener("submit", onUpdate);
  }
  
