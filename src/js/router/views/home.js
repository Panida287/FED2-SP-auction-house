import { renderListings, renderCarousel } from "../../ui/listing/display";
import { authGuard } from "../../utilities/authGuard";
import { initCarousel } from "../../utilities/initCarousel";
import { backToTop } from "../../ui/global/backToTop";

/**
 * Initialize page functionalities:
 * - Render listings and carousel
 * - Enforce authentication
 * - Initialize carousel behavior
 * - Implement back-to-top button behavior
 */
renderListings();
initCarousel();
authGuard();
renderCarousel();
backToTop("back-to-top", 1050);

/**
 * Add event listeners for category filtering.
 */
const categoryButtons = document.querySelectorAll(".category-btn");
const categoryHeading = document.querySelector(".category-heading");

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;

    // Update the category heading
    categoryHeading.textContent = category || "All Listings";

    // Fetch and display filtered listings
    renderListings(category);
  });
});

/**
 * Sort listings by highest bids (Trending Now).
 */
const sortByBidsButton = document.getElementById("sort-by-bids-btn");
sortByBidsButton.addEventListener("click", async () => {
  categoryHeading.textContent = "Trending Now";
  await renderListings(null, 1, 12, true, false); // Fetch sorted listings by bids
});

/**
 * Sort listings by those ending soon.
 */
const sortByEndingButton = document.getElementById("end-soon-btn");
sortByEndingButton.addEventListener("click", async () => {
  categoryHeading.textContent = "Ending Soon!";
  await renderListings(null, 1, 12, false, true); // Fetch sorted listings by ending time
});

/**
 * Implement search functionality.
 * - Triggers on "Enter" key press in the search input field.
 */
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission on Enter
    const query = searchInput.value.trim().toLowerCase();

    if (query.length === 0) {
      // Reset to all listings if the search query is empty
      categoryHeading.textContent = "All Listings";
      await renderListings();
    } else {
      // Update heading and fetch filtered listings by the search query
      categoryHeading.textContent = `Results for "${query}"`;
      await renderListings(null, 1, 12, false, false, query);
    }
  }
});
