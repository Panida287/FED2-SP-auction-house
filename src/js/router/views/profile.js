import { editProfile } from "../../ui/profile/update";
import { setLogoutListener } from "../../ui/global/logout";
import { setupCreateListing } from "../../ui/listing/create";
import { renderProfile } from "../../ui/profile/renderProfile";
import {
  renderUserBidsListings,
  renderUserWinsListings,
  renderListingsByUser,
} from "../../ui/profile/Renderlistings";
import { toggleContainer } from "../../utilities/toggleContainer";
import { backToTop } from "../../ui/global/backToTop";
import { backButton } from "../../ui/global/backBtn";

backButton();
backToTop("back-to-top", 0);

const username = localStorage.getItem("userName");
const resultContainer = document.querySelector(".result-container");

// Initialize essential components
setLogoutListener();
editProfile();
renderProfile();
setupCreateListing();

/**
 * Clears the active state from all filter buttons.
 */
function clearActiveButton() {
  document
    .querySelectorAll(".display-filter-btn button")
    .forEach((button) => button.classList.remove("active"));
}

// Select filter buttons
const listedButton = document.getElementById("listed");
const biddedButton = document.getElementById("bidded");
const winsButton = document.getElementById("wins");

/**
 * Renders the default user listings on page load.
 */
function renderDefaultListings() {
  if (username) {
    listedButton.classList.add("active");
    renderListingsByUser(username);
  } else {
    resultContainer.innerHTML = `<p class="text-red-500">Unable to load user listings. Please log in.</p>`;
  }
}

// Event listeners for filter buttons
listedButton.addEventListener("click", () => {
  clearActiveButton();
  listedButton.classList.add("active");
  resultContainer.innerHTML = `<p class="text-text">Loading your listings...</p>`;
  renderListingsByUser(username);
});

biddedButton.addEventListener("click", () => {
  clearActiveButton();
  biddedButton.classList.add("active");
  resultContainer.innerHTML = `<p class="text-text">Loading your bidded listings...</p>`;
  renderUserBidsListings(username);
});

winsButton.addEventListener("click", () => {
  clearActiveButton();
  winsButton.classList.add("active");
  resultContainer.innerHTML = `<p class="text-text">Loading your winning listings...</p>`;
  renderUserWinsListings(username);
});

// Initialize default listings
renderDefaultListings();

/**
 * Toggles the edit profile modal and overlay visibility.
 */
function handleEditProfileModal() {
  const editBtn = document.getElementById("edit-btn");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  const editProfileContainer = document.getElementById("edit-profile-container");
  const overlay = document.querySelector(".overlay");

  editBtn.addEventListener("click", () => {
    toggleContainer(editProfileContainer, true);
    toggleContainer(overlay, true);
  });

  cancelEditBtn.addEventListener("click", () => {
    toggleContainer(editProfileContainer, false);
    toggleContainer(overlay, false);
  });
}

handleEditProfileModal();
