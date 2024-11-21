import { editProfile } from "../../ui/profile/update";
import { setLogoutListener } from "../../ui/global/logout";
import { onCreate } from "../../ui/listing/create";
import { renderProfile } from "../../ui/profile/renderProfile";
import { renderListingsByUser } from "../../ui/listing/display";
import { readAllBidsByUser, readAllWinsByUser } from "../../api/listing/read";

// Retrieve the username from local storage
const username = localStorage.getItem("userName");
if (!username) {
  console.error("No username found in local storage.");
}

// Initialize logout button functionality
setLogoutListener();

// Initialize edit profile functionality
editProfile();

// Render the profile data
renderProfile();

// Initialize create listing functionality
setupCreateListing();


// Render the user's listings on page load
if (username) {
  renderListingsByUser(username);
} else {
  console.error("Unable to fetch user listings: No username provided.");
}

// Handle edit profile container toggle
const editBtn = document.getElementById("edit-btn");
const editProfileContainer = document.getElementById("edit-profile-container");

if (editBtn && editProfileContainer) {
  editBtn.addEventListener("click", () => {
    editProfileContainer.classList.remove("hidden");
    editProfileContainer.classList.add("flex");
  });
}

// Handle create listing functionality
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

// Add event listeners for filter buttons
  const listedButton = document.getElementById("listed");
  const biddedButton = document.getElementById("bidded");
  const winsButton = document.getElementById("wins");
  const resultContainer = document.querySelector(".result-container");

  // Show user's listings by default
  if (username) {
    listedButton.classList.add("active");
    renderListingsByUser(username);
  } else {
    resultContainer.innerHTML = `<p class="text-red-500">Unable to load user listings. Please log in.</p>`;
  }

  // Handle "Items Listed" button
  listedButton.addEventListener("click", async () => {
    clearActiveButton();
    listedButton.classList.add("active");
    resultContainer.innerHTML = `<p>Loading your listings...</p>`;
    await renderListingsByUser(username);
  });

  // Handle "Bidded" button
  biddedButton.addEventListener("click", async () => {
    clearActiveButton();
    biddedButton.classList.add("active");
    resultContainer.innerHTML = `<p>Loading your bids...</p>`;
    try {
      const response = await readAllBidsByUser(12, 1, username);
      renderBidWins(response.data, "Bids");
    } catch (error) {
      console.error("Error fetching bids:", error);
      resultContainer.innerHTML = `<p class="text-red-500">Failed to load your bids.</p>`;
    }
  });

  // Handle "Wins" button
  winsButton.addEventListener("click", async () => {
    clearActiveButton();
    winsButton.classList.add("active");
    resultContainer.innerHTML = `<p>Loading your wins...</p>`;
    try {
      const response = await readAllWinsByUser(12, 1, username);
      renderBidWins(response.data, "Wins");
    } catch (error) {
      console.error("Error fetching wins:", error);
      resultContainer.innerHTML = `<p class="text-red-500">Failed to load your wins.</p>`;
    }
  });

  // Helper function to clear active button state
  function clearActiveButton() {
    document.querySelectorAll(".display-filter-btn button").forEach((button) => {
      button.classList.remove("active");
    });
  }
;

// Render bids or wins data
function renderBidWins(data, type) {
  const resultContainer = document.querySelector(".result-container");
  resultContainer.innerHTML = ""; // Clear the container

  if (!data || data.length === 0) {
    resultContainer.innerHTML = `<p>No ${type.toLowerCase()} found for this user.</p>`;
    return;
  }

  data.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "item-card bg-white border border-gray-300 rounded-lg p-4 flex items-center shadow-md";
    itemElement.innerHTML = `
      <h3 class="text-lg font-semibold">${item.title || "Unnamed Item"}</h3>
      <p class="text-gray-500">Amount: ${item.amount || "N/A"} NOK</p>
    `;
    resultContainer.appendChild(itemElement);
  });
}


