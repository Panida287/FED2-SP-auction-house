import { renderListingById, renderPaginatedBids } from "../../ui/listing/display";
import { renderProfile, setupProfileButton } from "../../ui/profile/renderProfile";
import { setupBidForm } from "../../ui/listing/placeBid";
import { readListing } from "../../api/listing/read";
import { setupPreview } from "../../utilities/preview";
import { toggleContainer } from "../../utilities/toggleContainer";
import { onUpdate } from "../../ui/listing/update";
import { onDelete } from "../../ui/listing/delete";
import { setLogoutListener } from "../../ui/global/logout";
import { authGuard } from "../../utilities/authGuard";
import { backButton } from "../../ui/global/backBtn";

backButton();
setupProfileButton();
authGuard();
setLogoutListener();
renderListingById();
renderProfile();
setupBidForm();
setupUpdateListing();
deleteListing();
initializeBids();

/**
 * Sets up pagination buttons for bids.
 *
 * @param {Array<Object>} bids - The list of bids.
 * @param {HTMLElement} container - The DOM container to render the bids.
 * @param {number} perPage - The number of bids per page.
 */
function setupPaginationButtons(bids, container, perPage) {
  const paginationDiv = document.querySelector(".pagination");
  const prevButton = document.querySelector(".prev-btn");
  const nextButton = document.querySelector(".next-btn");
  const firstPageButton = document.querySelector(".first-page-btn");
  const lastPageButton = document.querySelector(".last-page-btn");
  const pageInfo = document.querySelector(".page-info");

  let currentPage = 1;
  const totalPages = Math.ceil(bids.length / perPage);

  const updatePagination = () => {
    pageInfo.textContent = `${currentPage} / ${totalPages}`;
    prevButton.disabled = currentPage <= 1;
    firstPageButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= totalPages;
    lastPageButton.disabled = currentPage >= totalPages;
    renderPaginatedBids(bids, currentPage, perPage, container);
    if (bids.length <= perPage) paginationDiv.classList.add("hidden");
  };

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
    currentPage = 1;
    updatePagination();
  });

  lastPageButton.addEventListener("click", () => {
    currentPage = totalPages;
    updatePagination();
  });

  updatePagination();
}

/**
 * Initializes the bids section with pagination.
 *
 * @async
 */
async function initializeBids() {
  const container = document.getElementById("last-bids");
  const bidsPerPage = 10;

  try {
    const listing = await readListing();
    const bids = listing.bids || [];
    setupPaginationButtons(bids, container, bidsPerPage);
  } catch (error) {
    console.error("Error initializing bids:", error);
  }
}

/**
 * Populates the update form with the selected listing data.
 *
 * @async
 */
async function populateUpdateForm() {
  try {
    const listing = await readListing();
    if (!listing) throw new Error("Failed to fetch listing data.");

    const titleInput = document.getElementById("listing-name");
    const descriptionInput = document.getElementById("listing-description");
    const categorySelect = document.getElementById("listing-category");
    const mediaUrlInput = document.getElementById("listing-image-url");
    const previewImage = document.getElementById("preview-image");

    titleInput.value = listing.title || "";
    mediaUrlInput.value = listing.media?.[0]?.url || "";
    descriptionInput.value = listing.description || "";
    setupPreview(mediaUrlInput, previewImage, titleInput.value);

    const selectedTag = listing.tags?.[0];
    let matchFound = false;
    Array.from(categorySelect.options).forEach((option) => {
      option.selected = option.value === selectedTag;
      if (option.value === selectedTag) matchFound = true;
    });
    if (!matchFound) categorySelect.selectedIndex = 0;
  } catch (error) {
    console.error("Error populating update form:", error);
  }
}

/**
 * Sets up the update listing modal and form submission.
 */
function setupUpdateListing() {
  const editBtn = document.getElementById("edit-listing-btn");
  const editListingContainer = document.getElementById("edit-listing-container");
  const listingForm = document.getElementById("edit-listing-form");
  const cancelBtn = document.getElementById("cancel-edit-btn");
  const overlay = document.querySelector(".overlay");

  if (editBtn && editListingContainer) {
    editBtn.addEventListener("click", async () => {
      if (editListingContainer.classList.contains("hidden")) {
        await populateUpdateForm();
        toggleContainer(editListingContainer, true);
        toggleContainer(overlay, true);
      }
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      toggleContainer(editListingContainer, false);
      toggleContainer(overlay, false);
      listingForm?.reset();
    });
  }

  listingForm?.addEventListener("submit", onUpdate);
}

/**
 * Sets up the delete listing modal and handles deletion.
 */
function deleteListing() {
  const deleteBtn = document.getElementById("delete-btn");
  const deleteModal = document.getElementById("delete-modal");
  const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
  const cancelDeleteBtn = document.getElementById("cancel-delete-btn");

  if (deleteBtn && deleteModal) {
    deleteBtn.addEventListener("click", () => {
      if (deleteModal.classList.contains("hidden")) toggleContainer(deleteModal, true);
    });
  }

  cancelDeleteBtn?.addEventListener("click", () => toggleContainer(deleteModal, false));
  confirmDeleteBtn?.addEventListener("click", onDelete);
}
