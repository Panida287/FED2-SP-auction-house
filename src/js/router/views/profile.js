import { editProfile } from "../../ui/profile/update";
import { setLogoutListener } from "../../ui/global/logout";
import { onCreate } from "../../ui/listing/create";
import { renderProfile } from "../../ui/profile/renderProfile";

// Initialize logout button functionality
setLogoutListener();

// Initialize edit profile functionality
editProfile();

// Render the profile data
renderProfile();

// Initialize create listing functionality
setupCreateListing();

/**
 * Toggles the visibility of the edit profile container.
 *
 * This function adds event listeners to the "Edit" button, which, when clicked,
 * displays the `editProfileContainer` by removing the `hidden` class and adding
 * the `flex` class.
 *
 * @function setupEditProfile
 * @returns {void}
 */
const editBtn = document.getElementById("edit-btn");
const editProfileContainer = document.getElementById("edit-profile-container");

if (editBtn && editProfileContainer) {
  editBtn.addEventListener("click", () => {
    editProfileContainer.classList.remove("hidden");
    editProfileContainer.classList.add("flex");
  });
}

/**
 * Sets up the Create Listing form by adding the `onCreate` event listener.
 * Also handles the Cancel button functionality to hide the container and reset the form.
 *
 * @function setupCreateListing
 * @returns {void}
 */
function setupCreateListing() {
  const createListingBtn = document.getElementById("create-listing-btn");
  const createListingContainer = document.getElementById("create-container");
  const listingForm = document.getElementById("listing-form");
  const cancelBtn = document.getElementById("cancel-edit-btn");
  const previewImage = document.getElementById("preview-image");
  const mediaUrlInput = document.getElementById("item-image-url");

    /**
   * Updates the image preview when the user enters a URL.
   */
    mediaUrlInput.addEventListener("input", () => {
      const url = mediaUrlInput.value;
      if (url) {
        previewImage.src = url;
        previewImage.alt = "Image Preview";
        previewImage.classList.remove("hidden");
      } else {
        previewImage.classList.add("hidden");
      }
    });

  if (createListingBtn && createListingContainer) {
    createListingBtn.addEventListener("click", () => {
      createListingContainer.classList.remove("hidden");
      createListingContainer.classList.add("flex");
    });
  }

  if (cancelBtn && createListingContainer && listingForm) {
    cancelBtn.addEventListener("click", () => {
      createListingContainer.classList.add("hidden");
      createListingContainer.classList.remove("flex");
      listingForm.reset(); // Reset the form inputs
    });
  }

  if (listingForm) {
    listingForm.addEventListener("submit", onCreate);
  } else {
    console.error("Listing form not found.");
  }
}
