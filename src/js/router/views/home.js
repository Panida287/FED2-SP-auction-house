import { setLogoutListener } from '../../ui/global/logout';
import { renderListings } from '../../ui/listing/display';
import { renderProfile } from '../../ui/profile/renderProfile';

setLogoutListener();
renderListings();
renderProfile();


// Add event listeners to category buttons
const categoryButtons = document.querySelectorAll(".category-btn");
const categoryHeading = document.querySelector(".category-heading");

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;

    // Update the category heading
    categoryHeading.textContent = category || "All Listings";
    renderListings(category); // Fetch filtered listings
  });
});

// Sort by Trending (highest bids)
const sortByBidsButton = document.getElementById("sort-by-bids-btn");
sortByBidsButton.addEventListener("click", async () => {
  categoryHeading.textContent = "Trending Now";
  await renderListings(null, 1, 12, true, false); // Sort by bids
});

// Sort by listings that are ending
const sortByEndingButton = document.getElementById("end-soon-btn");
sortByEndingButton.addEventListener("click", async () => {
  categoryHeading.textContent = "Ending Soon!";
  await renderListings(null, 1, 12, false, true); // Sort by ending soon
});

// Search functionality
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission on Enter
    const query = searchInput.value.trim().toLowerCase();

    if (query.length === 0) {
      // Show all listings if the search is cleared
      categoryHeading.textContent = "All Listings";
      await renderListings();
    } else {
      // Update the category heading and search listings
      categoryHeading.textContent = `Results for "${query}"`;
      await renderListings(null, 1, 12, false, false, query);
    }
  }
});

const profileBtn = document.querySelector(".profile-btn");
const profileMenu = document.querySelector(".profile-menu");

profileBtn.addEventListener("click", (event) => {
  // Toggle the visibility of the menu
  profileMenu.classList.toggle("dropdown-hidden");
  profileMenu.classList.toggle("dropdown-display");

  // Stop the click event from propagating to the document
  event.stopPropagation();
});

// Hide the menu when clicking anywhere else on the page
document.addEventListener("click", () => {
  if (!profileMenu.classList.contains("dropdown-hidden")) {
    profileMenu.classList.add("dropdown-hidden");
    profileMenu.classList.remove("dropdown-display");
  }
});


