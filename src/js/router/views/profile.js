import { editProfile } from "../../ui/profile/update";
import { setLogoutListener } from "../../ui/global/logout";
import { setupCreateListing } from "../../ui/listing/create";
import { renderProfile } from "../../ui/profile/renderProfile";
import { renderUserBidsListings, renderUserWinsListings ,renderListingsByUser } from "../../ui/profile/Renderlistings";
import { toggleContainer } from "../../utilities/toggleContainer";
import { backToTop } from "../../ui/global/backToTop";
import { backButton } from "../../ui/global/backBtn";

backButton();
backToTop("back-to-top", 0);

// Retrieve the username from local storage
const username = localStorage.getItem("userName");

if (!username) {
  console.error("No username found in local storage.");
  document.querySelector(".result-container").innerHTML = `<p class="text-red-500">Please log in to view your profile.</p>`;
} 

setLogoutListener();
editProfile();
renderProfile();
setupCreateListing();

// Add event listeners for filter buttons
const listedButton = document.getElementById("listed");
const biddedButton = document.getElementById("bidded");
const winsButton = document.getElementById("wins");
const resultContainer = document.querySelector(".result-container");

// Helper function to handle active button state
function clearActiveButton() {
  document.querySelectorAll(".display-filter-btn button").forEach((button) => {
    button.classList.remove("active");
  });
}

// Show user's listings by default
if (username) {
  listedButton.classList.add("active");
  renderListingsByUser(username);
} else {
  resultContainer.innerHTML = `<p class="text-red-500">Unable to load user listings. Please log in.</p>`;
}

// Event listeners for buttons
listedButton.addEventListener("click", () => {
  clearActiveButton();
  listedButton.classList.add("active");
  resultContainer.innerHTML = `<p class="text-text">Loading your listings...</p>`;
  renderListingsByUser(username);
});


biddedButton.addEventListener("click", () => {
  clearActiveButton();
  biddedButton.classList.add("active");
  resultContainer.innerHTML = `<p class="text-text">Loading your listings...</p>`;
  renderUserBidsListings(username);
});

winsButton.addEventListener("click", () => {
  clearActiveButton();
  winsButton.classList.add("active");
  resultContainer.innerHTML = `<p class="text-text">Loading your listings...</p>`;
  renderUserWinsListings(username);
});


// Handle edit profile container toggle
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
})



