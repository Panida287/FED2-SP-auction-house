import { editProfile } from "../../ui/profile/update";
import { setLogoutListener } from "../../ui/global/logout";
import { setupCreateListing } from "../../ui/listing/create";
import { renderProfile } from "../../ui/profile/renderProfile";
import { renderUserBidsListings, renderUserWinsListings ,renderListingsByUser } from "../../ui/profile/Renderlistings";


// Retrieve the username from local storage
const username = localStorage.getItem("userName");

if (!username) {
  console.error("No username found in local storage.");
  document.querySelector(".result-container").innerHTML = `<p class="text-red-500">Please log in to view your profile.</p>`;
}

// Initialize logout button functionality
setLogoutListener();

// Initialize edit profile functionality
editProfile();

// Render the profile data
renderProfile();

// Initialize create listing functionality
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
  resultContainer.innerHTML = `<p>Loading your listings...</p>`;
  renderListingsByUser(username);
});


biddedButton.addEventListener("click", () => {
  clearActiveButton();
  biddedButton.classList.add("active");
  renderUserBidsListings(username);
});

winsButton.addEventListener("click", () => {
  clearActiveButton();
  winsButton.classList.add("active");
  renderUserWinsListings(username);
});


// Handle edit profile container toggle
const editBtn = document.getElementById("edit-btn");
const editProfileContainer = document.getElementById("edit-profile-container");

if (editBtn && editProfileContainer) {
  editBtn.addEventListener("click", () => {
    editProfileContainer.classList.toggle("hidden");
    editProfileContainer.classList.toggle("flex");
  });
}