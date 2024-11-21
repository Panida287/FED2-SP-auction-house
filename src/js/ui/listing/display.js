import { readListings, searchListings, readListingsByUser } from "../../api/listing/read";

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

