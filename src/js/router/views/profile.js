import { FALLBACK_AVATAR, FALLBACK_BANNER } from "../../api/constants";
import { readProfile } from "../../api/profile/read";
import { editProfile } from "../../ui/profile/update";
import { setLogoutListener } from "../../ui/global/logout";
import { onCreate } from "../../ui/listing/create";

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
 * Fetches and renders the user's profile.
 *
 * This function dynamically populates the user's profile data fetched
 * from the API. It updates the DOM elements, including the user's name, avatar(s),
 * banner, and statistics (credits, bids, wins). If an error occurs, it logs the error
 * and displays a fallback error message in the `profileContainer`.
 *
 * @async
 * @function renderProfile
 * @returns {Promise<void>} Resolves when the profile is successfully rendered.
 * @throws Will log an error if the network request fails or profile data is unavailable.
 */
async function renderProfile() {
  try {
    const userName = localStorage.getItem("userName"); // Get the logged-in user's username
    if (!userName) {
      console.error("User not logged in");
      return;
    }

    const profile = await readProfile(userName); // Fetch profile data
    console.log("Profile data:", profile); // Debug: Log fetched profile data

    // Elements to populate
    const avatars = document.querySelectorAll(".profile-pic");
    const banner = document.querySelector(".banner");
    const author = document.querySelector(".author");
    const creditAmount = document.querySelector(".credit-amount");
    const bidsAmount = document.querySelector(".bids-amount");
    const winAmount = document.querySelector(".win-amount");

    // Update author name
    if (author) {
      author.textContent = profile.data.name || "No Name Provided";
    }

    // Update all avatar images
    avatars.forEach((avatar) => {
      avatar.src = profile.data.avatar?.url || FALLBACK_AVATAR;
      avatar.alt = profile.data.avatar?.alt || `${profile.data.name}'s Avatar`;
    });

    // Update banner image
    if (banner) {
      banner.src = profile.data.banner?.url || FALLBACK_BANNER;
      banner.alt = profile.data.banner?.alt || `${profile.data.name}'s Banner`;
    }

    // Populate stats: credits, bids, and wins
    if (creditAmount) creditAmount.textContent = profile.data.credits || 0;
    if (bidsAmount) bidsAmount.textContent = profile.data._count?.listings || 0;
    if (winAmount) winAmount.textContent = profile.data._count?.wins || 0;
  } catch (error) {
    console.error("Error fetching profile or posts:", error);
    const profileContainer = document.getElementById("profile-container");
    if (profileContainer) {
      profileContainer.innerHTML =
        "<p>Error loading profile. Please try again later.</p>";
    }
  }
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
