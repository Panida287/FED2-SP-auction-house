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
  await renderListings(null, 1, 12, true, false); // Fetch listings sorted by bids
});

// Sort by listings that are ending
const sortByEndingButton = document.getElementById("end-soon-btn");

sortByEndingButton.addEventListener("click", async () => {
  categoryHeading.textContent = "Ending Soon!";
  await renderListings(null, 1, 12, false, true);
})



// Search functionality
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  if (query.length === 0) {
    // Show all listings if the search is cleared
    categoryHeading.textContent = "All Listings";
    renderListings();
  } else {
    // Update the category heading and search listings
    categoryHeading.textContent = `Results for "${query}"`;
    renderListings(null, 1, 12, false, query);
  }
});
