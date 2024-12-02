import {
  readListings,
  readListing,
  searchListings,
} from "../../api/listing/read";

import { FALLBACK_AVATAR, FALLBACK_IMG } from "../../api/constants";
import { updateCountdown } from "../../utilities/updateCountdown";

/**
 * Renders a list of listings into a given container.
 *
 * @param {Array} listings - Array of listing objects to render.
 * @param {HTMLElement} container - The DOM element where the listings will be appended.
 */
export function renderListingsToContainer(listings, container) {
  container.innerHTML = ""; // Clear previous content

  listings.forEach((listing) => {
    const now = new Date();
    const endDate = new Date(listing.endsAt);
    const isEnded = now > endDate;
    const lastBidAmount = listing.bids?.length
      ? listing.bids[listing.bids.length - 1].amount
      : "0";

    const listingElement = document.createElement("a");
    listingElement.href = `/listing/?listingID=${listing.id}&_seller=true&_bids=true`;
    listingElement.className =
      "item-card bg-white border border-gray-300 rounded-lg p-4 mx-4 flex flex-col items-center shadow-md relative";

    const countdownTimerId = `countdown-${listing.id}`; // Unique ID for each timer

    listingElement.innerHTML = `
      <div class="flex w-full justify-between items-center mb-4">
        <div class="seller flex items-center">
          <img 
            class="w-10 h-10 rounded-full object-cover" 
            src="${listing.seller?.avatar?.url || FALLBACK_AVATAR}" 
            onerror="this.src='${FALLBACK_AVATAR}'" 
          />
          <div class="flex flex-col pl-2">
            <p class="text-gray-500 text-sm flex items-center">
              Selling by
            </p>
            <p class="text-sm font-semibold">
              ${listing.seller?.name || "Me"}
            </p>
          </div>
        </div>
        <button id="fav-btn" class="text-gray-500 hover:text-red-500">
          <i class="fa-regular fa-heart"></i>
        </button>
      </div>
      <div class="relative w-full">
        <img 
          src="${listing.media?.[0]?.url || FALLBACK_IMG}" 
          alt="${listing.media?.[0]?.alt || "Item image"}" 
          class="w-full h-[200px] object-cover rounded-lg"
          onerror="this.src='${FALLBACK_IMG}'"
        />
        <div id="${countdownTimerId}" class="absolute bottom-2 left-1/2 transform -translate-x-1/2"></div>
        ${
          isEnded
            ? `<div class="absolute h-full w-full top-0 left-0 bg-black/50 flex justify-center items-center text-red-500 font-bold text-lg">
                Auction Ended
              </div>`
            : ""
        }
      </div>
      <div class="item-details flex flex-col w-full mt-4">
        <h3 class="text-lg font-semibold">${listing.title}</h3>
        <div class="flex justify-between items-center mt-2">
          <p class="text-gray-700 text-sm">Bids: <span class="font-bold">${
            listing._count?.bids
          }</span></p>
          <p class="text-gray-700 text-sm">Last bid: <span class="font-bold">${lastBidAmount} NOK</span></p>
        </div>
      </div>
    `;

    container.appendChild(listingElement);

    // Initialize countdown timer if the auction hasn't ended
    if (!isEnded) {
      const timerElement = document.getElementById(countdownTimerId);
      updateCountdown(endDate, timerElement);
    }
  });
}


export async function renderListings(
  tag = null,
  page = 1,
  limit = 12,
  sortByBids = false,
  sortByEnding = false,
  query = null
) {
  const itemsSection = document.querySelector(".items-section");
  const messageContainer = document.querySelector(".message-container");
  const paginationInfo = document.querySelector(".page-info");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  try {
    // Clear the container and message at the start
    itemsSection.innerHTML = "";
    messageContainer.textContent = "";

    let response;

    if (query) {
      response = await searchListings(query);
      sortByBids = false;
      sortByEnding = false;
    } else {
      response = await readListings(tag, sortByBids, sortByEnding);
    }

    const listings = response.data;
    console.log(listings);

    // Update pagination information
    const totalPages = Math.ceil(listings.length / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedListings = listings.slice(start, end);

    // Render listings into the container
    renderListingsToContainer(paginatedListings, itemsSection);

    if (listings.length === 0) {
      messageContainer.textContent = `No listings found.`;
      paginationInfo.textContent = "";
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    } else {
      messageContainer.textContent = "";
    }

    paginationInfo.textContent = `Page ${page} of ${totalPages}`;
    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= totalPages;

    // Pagination button handlers
    prevBtn.onclick = () =>
      renderListings(tag, page - 1, limit, sortByBids, query);
    nextBtn.onclick = () =>
      renderListings(tag, page + 1, limit, sortByBids, query);
  } catch (error) {
    console.error("Error rendering listings:", error);
    itemsSection.innerHTML = `<p class="text-red-500">Failed to load listings. Please try again later.</p>`;
  }
}

/**
 * Renders a single auction listing based on its ID from the URL.
 *
 * @async
 * @function renderListingById
 * @returns {Promise<void>}
 */
export async function renderListingById() {
  const productImage = document.getElementById("product-image");
  const productTitle = document.getElementById("product-title");
  const productCategory = document.getElementById("product-category");
  const productSeller = document.getElementById("product-seller");
  const productDescription = document.getElementById("product-description");
  const price = document.getElementById("price");
  const biddingsCount = document.getElementById("biddings-count");
  const countdownTimer = document.getElementById("countdown-timer");
  const lastBidsContainer = document.getElementById("last-bids");
  const backButton = document.getElementById("back-btn");
  const startPrice = document.getElementById("start-price");
  const bidInput = document.getElementById("bid-amount");

  const auctionEndedOverlay = document.createElement("div"); // Overlay for auction ended
  auctionEndedOverlay.className =
    "absolute top-1/2 left-0 w-full h-[35px] bg-white/70 flex justify-center items-center text-red-500 font-bold transform -rotate-12";

  let currentPage = 1; // Default page for bids
  const bidsPerPage = 10; // Show 10 bids per page

  try {
    // Fetch the listing data
    const listing = await readListing();
    console.log(listing);

    // Set the product image
    productImage.src = listing.media?.[0]?.url || `${FALLBACK_IMG}`;
    productImage.alt = listing.media?.[0]?.alt || "Product Image";

    // Fallback to default if the image fails to load
    productImage.onerror = () => {
      productImage.src = FALLBACK_IMG;
    };

    // Add auction ended overlay if auction has ended
    const now = new Date();
    const endDate = new Date(listing.endsAt);
    if (now > endDate) {
      auctionEndedOverlay.textContent = "Auction Ended";
      productImage.parentElement.style.position = "relative";
      productImage.parentElement.appendChild(auctionEndedOverlay);
    }

    // Set product details
    productTitle.textContent = listing.title;
    productCategory.innerHTML = `Category: <span class="font-medium">${
      listing.tags.join(", ") || "N/A"
    }</span>`;
    productSeller.innerHTML = `Seller: <span class="font-medium">${
      listing.seller?.name || "Unknown"
    }</span>`;
    startPrice.innerHTML = `Start price: <span class="font-medium">${
      listing.bids?.[0]?.amount || "0"
    } NOK</span>`;

    productDescription.textContent =
      listing.description || "No description available.";

    // Logic for the edit button visibility
    const loggedInUser = localStorage.getItem("userName");
    const editBtn = document.getElementById("edit-listing-btn");
    if (loggedInUser === listing.seller?.name && now < endDate) {
      // Show the edit button
      editBtn.classList.remove("hidden");
      editBtn.classList.add("flex");
    } else {
      // Hide the edit button
      editBtn.classList.remove("flex");
      editBtn.classList.add("hidden");
    }

    // Set product stats
    const lastBidAmount =
      listing.bids && listing.bids.length > 0
        ? listing.bids[listing.bids.length - 1].amount
        : "0";

    price.textContent = `${lastBidAmount || "0"} NOK`;
    biddingsCount.textContent = listing._count.bids || "0";

    // Display "Ended: (date and time)" if the auction has ended
    if (now > endDate) {
      countdownTimer.textContent = `Ended: ${endDate.toLocaleString()}`;
      countdownTimer.classList.add("text-red-500");
    } else {
      updateCountdown(endDate, countdownTimer);
    }

    // Display win details if auction ended
    if (now > endDate && listing.bids && listing.bids.length > 0) {
      const winner =
        listing.bids[listing.bids.length - 1].bidder.name || "Unknown";
      const winnerAvatar =
        listing.bids[listing.bids.length - 1].bidder.avatar?.url ||
        `${FALLBACK_AVATAR}`;
      const endedPrice = listing.bids[listing.bids.length - 1].amount || "0";
      const winDetails = document.createElement("div");
      winDetails.className = "flex justify-center mt-4 w-[full] text-gray-800";
      winDetails.innerHTML = `
        <p class=""flex items-center"><strong>Win:</strong><img class= h-10 w-10 rounded-full src= ${winnerAvatar}> ${winner}</p>
        <p><strong>Price:</strong> ${endedPrice} NOK</p>
      `;
      countdownTimer.parentElement.appendChild(winDetails);
    }

    // Set bid amount placeholder and minimum bid
    bidInput.placeholder = `Enter more than ${lastBidAmount} NOK`;
    bidInput.min = lastBidAmount;

    // set to hide bidding section from own listing
    const bidForm = document.getElementById("bid-form");
    const bidContainer = document.querySelector(".bid-container");
    if (loggedInUser === listing.seller?.name) {
      const bidNotAllowed = document.createElement("h2");
      bidNotAllowed.classList = "text-red-500";
      bidNotAllowed.textContent = "You cannot bid on your own listing";

      bidForm.classList = "hidden";

      bidContainer.appendChild(bidNotAllowed);
    }

    // Add Back button functionality
    backButton.addEventListener("click", () => {
      window.history.back();
    });

    // Render paginated bids
    renderPaginatedBids(
      listing.bids || [],
      currentPage,
      bidsPerPage,
      lastBidsContainer
    );

    // Add pagination buttons
    const paginationButtons = document.createElement("div");
    paginationButtons.className = "flex justify-between mt-4 pb-10";

    const prevButton = document.createElement("button");
    prevButton.className = "bg-gray-300 text-gray-800 px-4 py-2 rounded";
    prevButton.textContent = "Previous";
    prevButton.disabled = currentPage === 1;

    const nextButton = document.createElement("button");
    nextButton.className = "bg-gray-300 text-gray-800 px-4 py-2 rounded";
    nextButton.textContent = "Next";
    nextButton.disabled = listing.bids.length <= bidsPerPage;

    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderPaginatedBids(
          listing.bids,
          currentPage,
          bidsPerPage,
          lastBidsContainer
        );
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage * bidsPerPage >= listing.bids.length;
      }
    });

    nextButton.addEventListener("click", () => {
      if (currentPage * bidsPerPage < listing.bids.length) {
        currentPage++;
        renderPaginatedBids(
          listing.bids,
          currentPage,
          bidsPerPage,
          lastBidsContainer
        );
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage * bidsPerPage >= listing.bids.length;
      }
    });

    paginationButtons.appendChild(prevButton);
    paginationButtons.appendChild(nextButton);
    lastBidsContainer.parentElement.appendChild(paginationButtons);
  } catch (error) {
    console.error("Error rendering listing:", error);
    document.body.innerHTML = `<p class="text-red-500 text-center mt-4">Failed to load listing. Please try again later.</p>`;
  }
}

/**
 * Renders paginated bids in the "Last Bids" section.
 *
 * @param {Array} bids - The array of bid objects.
 * @param {number} page - The current page number.
 * @param {number} perPage - The number of bids to display per page.
 * @param {HTMLElement} container - The DOM element to render the bids into.
 */
function renderPaginatedBids(bids, page, perPage, container) {
  container.innerHTML = ""; // Clear existing bids

  // Sort bids by created date (most recent first)
  const sortedBids = [...bids].sort(
    (a, b) => new Date(b.created) - new Date(a.created)
  );

  // Paginate the sorted bids
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedBids = sortedBids.slice(start, end);

  if (paginatedBids.length === 0) {
    container.innerHTML = `<p class="text-gray-500">No bids available.</p>`;
    return;
  }

  // Render the paginated and sorted bids
  paginatedBids.forEach((bid) => {
    const bidElement = document.createElement("div");
    bidElement.className = "flex border-b border-gray-300 pb-2";
    bidElement.innerHTML = `
      <div class="flex justify-start items-center gap-2 w-full">
        <img class="h-8 w-8 rounded-full" src="${
          bid?.bidder?.avatar?.url || "default-avatar.jpg"
        }" alt="${bid?.bidder?.avatar?.alt || "Avatar"}">
        <p class="text-gray-600 font-medium">${
          bid?.bidder?.name || "Anonymous"
        }</p>
      </div>
      <div class="flex flex-col justify-between items-end">
        <p class="text-gray-600 font-medium">Bidded ${bid?.amount} NOK</p>
        <p class="text-gray-400 text-sm">At: ${new Date(
          bid.created
        ).toLocaleString()}</p>
      </div>
    `;
    container.appendChild(bidElement);
  });
}
