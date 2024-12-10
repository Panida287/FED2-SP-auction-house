import { renderListingById, renderPaginatedBids } from "../../ui/listing/display";
import { renderProfile } from "../../ui/profile/renderProfile";
import { setupBidForm } from "../../ui/listing/placeBid";
import { readListing } from "../../api/listing/read";
import { setupPreview } from "../../utilities/preview";
import { toggleContainer } from "../../utilities/toggleContainer";
import { onUpdate } from "../../ui/listing/update";
import { onDelete } from "../../ui/listing/delete";
import { setLogoutListener } from "../../ui/global/logout";
import { authGuard } from "../../utilities/authGuard";

authGuard();
setLogoutListener();
renderListingById();
renderProfile();
setupBidForm();
setupUpdateListing();
deleteListing();
initializeBids();

function setupPaginationButtons(bids, container, perPage) {
  const prevButton = document.querySelector(".prev-btn");
  const nextButton = document.querySelector(".next-btn");
  const firstPageButton = document.querySelector(".first-page-btn");
  const lastPageButton = document.querySelector(".last-page-btn");
  const pageInfo = document.querySelector(".page-info");

  let currentPage = 1; // Default page

  const totalPages = Math.ceil(bids.length / perPage);

  function updatePagination() {
    // Update page info
    pageInfo.textContent = `${currentPage} / ${totalPages}`;

    // Disable or enable buttons based on the current page
    prevButton.disabled = currentPage <= 1;
    firstPageButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= totalPages;
    lastPageButton.disabled = currentPage >= totalPages;

    // Render the current page of bids
    renderPaginatedBids(bids, currentPage, perPage, container);
  }

  // Add event listeners to the buttons
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updatePagination();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      updatePagination();
    }
  });

  firstPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage = 1;
      updatePagination();
    }
  });

  lastPageButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage = totalPages;
      updatePagination();
    }
  });

  // Initialize the pagination
  updatePagination();
}

async function initializeBids() {
  const container = document.getElementById("last-bids");
  const bidsPerPage = 10;

  try {
    const listing = await readListing(); // Fetch listing details
    const bids = listing.bids || []; // Get bids from the listing

    setupPaginationButtons(bids, container, bidsPerPage);
  } catch (error) {
    console.error("Error initializing bids:", error);
  }
}


async function populateUpdateForm() {
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

function deleteListing() {
  const deleteBtn = document.getElementById("delete-btn");
  const deleteModal = document.getElementById("delete-modal");
  const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
  const cancelDeleteBtn = document.getElementById("cancel-delete-btn");

  if (deleteBtn, deleteModal) {
    deleteBtn.addEventListener("click", () => {
      if (deleteModal.classList.contains("hidden")) {
        toggleContainer(deleteModal, true);
      }
    });
  }
   if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", ()=> {
      toggleContainer(deleteModal, false);
    });
   }

   confirmDeleteBtn.addEventListener("click", ()=> {
    onDelete();
   })

}

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

// Back Button Handling
const backButton = document.getElementById("back-btn");

if (backButton) {
  backButton.addEventListener("click", () => {
    if (document.referrer) {
      // Go back to the previous page in the history stack
      history.back();
    } else {
      // Fallback to a default page if there's no referrer
      window.location.href = "/";
    }
  });
}