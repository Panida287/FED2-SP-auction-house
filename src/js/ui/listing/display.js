import { readListings,readListing , searchListings, readListingsByUser } from "../../api/listing/read";

// Function to fetch and render listings
export async function renderListings(tag = null, page = 1, limit = 12, sortByBids = false, query = null) {
  const itemsSection = document.querySelector(".items-section");
  const messageContainer = document.querySelector(".message-container");
  const paginationInfo = document.querySelector(".page-info");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  try {
    let response;

    if (query) {
      // Search listings if a query is provided
      response = await searchListings(query, limit, page);
    } else {
      // Fetch listings with the provided tag and sorting option
      response = await readListings(limit, page, tag, sortByBids);
    }

    const listings = response.data;
    const meta = response.meta;

    // Clear previous content
    itemsSection.innerHTML = "";

    // If no listings are found, display a message
    if (listings.length === 0) {
      messageContainer.textContent = `No listings found.`;
      return;
    }

    // Clear any previous message
    messageContainer.textContent = "";

    // Render the listings
    listings.forEach((listing) => {
      const media = listing.media[0]?.url
        ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt || 'Item image'}" class="w-24 h-24 object-cover rounded-lg"/>`
        : `<div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">No Image</div>`;

      const listingElement = document.createElement("a");
      listingElement.href = `/listing/?listingID=${listing.id}&_seller=true&_bids=true`;
      listingElement.setAttribute("data-listingID", listing.id);
      listingElement.className =
        "item-card bg-white border border-gray-300 rounded-lg p-4 flex items-center shadow-md";

      listingElement.innerHTML = `
        ${media}
        <div class="item-details ml-4">
          <h3 class="text-lg font-semibold">${listing.title}</h3>
          <p class="text-gray-500 text-sm">Author: ${listing.seller?.name || "Unknown"}</p>
          <div class="flex justify-between items-center mt-2">
            <p class="text-gray-700 text-sm">Biddings: <span class="font-bold">${listing._count.bids}</span></p>
            <p class="text-gray-700 text-sm">Offer: <span class="font-bold">${listing.bids?.[0]?.amount || "N/A"} NOK</span></p>
          </div>
          <p class="mt-2 text-sm text-gray-400">Ends in: <span class="font-bold">${new Date(listing.endsAt).toLocaleString()}</span></p>
        </div>
      `;

      itemsSection.appendChild(listingElement);
    });

    // Update pagination info
    paginationInfo.textContent = `Page ${meta.currentPage} of ${meta.pageCount}`;
    prevBtn.disabled = !meta.previousPage;
    nextBtn.disabled = !meta.nextPage;

    // Add pagination event listeners
    prevBtn.onclick = () => renderListings(tag, page - 1, limit, sortByBids, query);
    nextBtn.onclick = () => renderListings(tag, page + 1, limit, sortByBids, query);
  } catch (error) {
    console.error("Error rendering listings:", error);
    itemsSection.innerHTML = `<p class="text-red-500">Failed to load listings. Please try again later.</p>`;
  }
}


export async function renderListingsByUser(username, page = 1, limit = 12) {
  const resultContainer = document.querySelector(".result-container");
  const messageContainer = document.querySelector(".message-container");
  const paginationInfo = document.querySelector(".page-info");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  try {
    const response = await readListingsByUser(limit, page, username);
    const listings = response.data;
    const meta = response.meta;

    // Clear previous content
    resultContainer.innerHTML = "";

    // If no listings are found, display a message
    if (listings.length === 0) {
      messageContainer.textContent = `No listings found for user: ${username}`;
      return;
    }

    // Clear any previous message
    messageContainer.textContent = "";

    // Render the listings
    listings.forEach((listing) => {
      const media = listing.media[0]?.url
        ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt || 'Item image'}" class="w-24 h-24 object-cover rounded-lg"/>`
        : `<div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">No Image</div>`;

      const listingElement = document.createElement("a");
      listingElement.href = `/listing/?listingID=${listing.id}&_seller=true&_bids=true`;
      listingElement.setAttribute("data-listingID", listing.id);
      listingElement.className =
        "item-card bg-white border border-gray-300 rounded-lg p-4 flex items-center shadow-md";

      listingElement.innerHTML = `
        ${media}
        <div class="item-details ml-4">
          <h3 class="text-lg font-semibold">${listing.title}</h3>
          <p class="text-gray-500 text-sm">Description: ${listing.description || "No description provided"}</p>
          <p class="text-gray-500 text-sm">Tags: ${listing.tags.join(", ") || "None"}</p>
          <div class="flex justify-between items-center mt-2">
            <p class="text-gray-700 text-sm">Biddings: <span class="font-bold">${listing._count.bids}</span></p>
          </div>
          <p class="mt-2 text-sm text-gray-400">Ends on: <span class="font-bold">${new Date(listing.endsAt).toLocaleString()}</span></p>
        </div>
      `;

      resultContainer.appendChild(listingElement);
    });

    // Update pagination info
    if (paginationInfo) {
      paginationInfo.textContent = `Page ${meta.currentPage} of ${meta.pageCount}`;
    }

    if (prevBtn && nextBtn) {
      prevBtn.disabled = !meta.previousPage;
      nextBtn.disabled = !meta.nextPage;

      prevBtn.onclick = () => renderListingsByUser(username, page - 1, limit);
      nextBtn.onclick = () => renderListingsByUser(username, page + 1, limit);
    }
  } catch (error) {
    console.error("Error rendering user listings:", error);
    resultContainer.innerHTML = `<p class="text-red-500">Failed to load listings. Please try again later.</p>`;
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
  const userCredit = document.getElementById("user-credit");
  const price = document.getElementById("price");
  const biddingsCount = document.getElementById("biddings-count");
  const countdownTimer = document.getElementById("countdown-timer");
  const lastBidsContainer = document.getElementById("last-bids");
  const backButton = document.getElementById("back-btn");

  let currentPage = 1; // Default page for bids
  const bidsPerPage = 10; // Show 10 bids per page

  try {
    // Fetch the listing data
    const listing = await readListing();

    // Set the product image
    productImage.src = listing.media?.[0]?.url || "default-image.jpg";
    productImage.alt = listing.media?.[0]?.alt || "Product Image";

    // Set product details
    productTitle.textContent = listing.title;
    productCategory.innerHTML = `Category: <span class="font-medium">${listing.tags.join(", ") || "N/A"}</span>`;
    productSeller.innerHTML = `Seller: <span class="font-medium">${listing.seller?.name || "Unknown"}</span>`;
    productDescription.textContent = listing.description || "No description available.";

    // Set product stats
    price.textContent = `${listing.bids?.[0]?.amount || "0"} NOK`;
    biddingsCount.textContent = listing._count.bids || "0";

    // Countdown timer (if the listing has an end time)
    const endDate = new Date(listing.endsAt);
    updateCountdown(endDate, countdownTimer);

    // Add Back button functionality
    backButton.addEventListener("click", () => {
      window.history.back();
    });

    // Render paginated bids
    renderPaginatedBids(listing.bids || [], currentPage, bidsPerPage, lastBidsContainer);

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
        renderPaginatedBids(listing.bids, currentPage, bidsPerPage, lastBidsContainer);
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage * bidsPerPage >= listing.bids.length;
      }
    });

    nextButton.addEventListener("click", () => {
      if (currentPage * bidsPerPage < listing.bids.length) {
        currentPage++;
        renderPaginatedBids(listing.bids, currentPage, bidsPerPage, lastBidsContainer);
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
 * Updates the countdown timer for the auction end time.
 *
 * @param {Date} endDate - The end date of the auction.
 * @param {HTMLElement} timerElement - The DOM element to update the countdown.
 */
function updateCountdown(endDate, timerElement) {
  function calculateTimeLeft() {
    const now = new Date();
    const timeLeft = endDate - now;

    if (timeLeft <= 0) {
      timerElement.textContent = "Auction Ended";
      clearInterval(intervalId);
      return;
    }

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    timerElement.textContent = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  calculateTimeLeft(); // Initialize immediately
  const intervalId = setInterval(calculateTimeLeft, 1000);
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

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedBids = bids.slice(start, end);

  if (paginatedBids.length === 0) {
    container.innerHTML = `<p class="text-gray-500">No bids available.</p>`;
    return;
  }

  paginatedBids.forEach((bid) => {
    const bidElement = document.createElement("div");
    bidElement.className = "flex justify-between items-center border-b border-gray-300 pb-2";
    bidElement.innerHTML = `
      <p class="text-gray-600 font-medium">${bid.bidderName || "Anonymous"}</p>
      <p class="text-gray-400 text-sm">At: ${new Date(bid.created).toLocaleString()}</p>
    `;
    container.appendChild(bidElement);
  });
}


