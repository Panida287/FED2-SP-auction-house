import { readUserBidsWins,readListingsByUser } from "../../api/listing/read";
import { renderListingsToContainer } from "../listing/display";

export async function renderListingsByUser(username, page = 1, limit = 12) {
    const container = document.querySelector(".result-container");
    const messageContainer = document.querySelector(".message-container");
    const paginationInfo = document.querySelector(".page-info");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
  
    try {
      const response = await readListingsByUser(limit, page, username);
      const listings = response.data;
      const meta = response.meta;
  
      if (listings.length === 0) {
        messageContainer.textContent = `No listings found for user: ${username}`;
        return;
      }
      messageContainer.textContent = "";
  
      renderListingsToContainer(listings, container);
  
      paginationInfo.textContent = `Page ${meta.currentPage} of ${meta.pageCount}`;
      prevBtn.disabled = !meta.previousPage;
      nextBtn.disabled = !meta.nextPage;
  
      prevBtn.onclick = () => renderListingsByUser(username, page - 1, limit);
      nextBtn.onclick = () => renderListingsByUser(username, page + 1, limit);
    } catch (error) {
      console.error("Error rendering user listings:", error);
      container.innerHTML = `<p class="text-red-500">Failed to load listings. Please try again later.</p>`;
    }
  }


  export async function renderUserBidsListings(username, limit = 12, page = 1) {
    const container = document.querySelector(".result-container");
    const messageContainer = document.querySelector(".message-container");
    const paginationInfo = document.querySelector(".page-info");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
  
    try {
      // Fetch bids with associated listings using the corrected function
      const response = await readUserBidsWins("bids", limit, page, username);
      const bidData = response.data;
  
      if (!bidData || bidData.length === 0) {
        messageContainer.textContent = "You havn't bid on anything :(";
        container.innerHTML = ""; // Clear any previous content
        return;
      }
  
      messageContainer.textContent = "";
  
      // Clear the container
      container.innerHTML = "";
  
      // Render each bid with its associated listing
      bidData.forEach((bid) => {
        const { listing } = bid;
        if (!listing) return; // Skip if no listing is associated with the bid

        const now = new Date();
        const endDate = new Date(listing.endsAt);
        const isEnded = now > endDate;

        const media = listing.media[0]?.url
            ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt || "Listing image"}" class="w-24 h-24 object-cover rounded-lg" />`
            : `<div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">No Image</div>`;

        const listingElement = document.createElement("a");
        listingElement.href = `/listing/?listingID=${listing.id}`;
        listingElement.className = "item-card bg-white border border-gray-300 rounded-lg p-4 flex items-center shadow-md relative";

        listingElement.innerHTML = `
            <div class="relative">
                ${media}
                ${
                    isEnded
                        ? `<div class="absolute inset-0 bg-white/70 flex justify-center items-center text-red-500 font-bold">
                             Auction Ended
                           </div>`
                        : ""
                }
            </div>
            <div class="item-details ml-4">
                <h3 class="text-lg font-semibold">${listing.title}</h3>
                <div class="flex justify-between items-center mt-2">
                    <p class="text-gray-700 text-sm">Tags: ${listing.tags.join(", ")}</p>
                </div>
                ${
                    isEnded
                        ? `<p class="mt-2 text-sm text-gray-400">Ended: <span class="font-bold">${endDate.toLocaleString()}</span></p>`
                        : `<p class="mt-2 text-sm text-gray-400">Ends in: <span class="font-bold">${endDate.toLocaleString()}</span></p>`
                }
            </div>
        `;

        container.appendChild(listingElement);
      });
  
      // Update pagination information
      const meta = response.meta;
      paginationInfo.textContent = `Page ${meta.currentPage} of ${meta.pageCount}`;
      prevBtn.disabled = !meta.previousPage;
      nextBtn.disabled = !meta.nextPage;
  
      // Handle pagination
      prevBtn.onclick = () => renderUserBidsListings(username, limit, page - 1);
      nextBtn.onclick = () => renderUserBidsListings(username, limit, page + 1);
    } catch (error) {
      console.error("Error fetching bids with listings:", error);
      container.innerHTML = `<p class="text-red-500">Failed to load your bids.</p>`;
    }
  }

  export async function renderUserWinsListings(username, limit = 12, page = 1) {
    const container = document.querySelector(".result-container");
    const messageContainer = document.querySelector(".message-container");
    const paginationInfo = document.querySelector(".page-info");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
  
    try {
      // Fetch wins using the corrected function
      const response = await readUserBidsWins("wins", limit, page, username);
      const winData = response.data;
  
      if (!winData || winData.length === 0) {
        messageContainer.textContent = "You havn't won anything! Keep bidding!";
        container.innerHTML = ""; // Clear any previous content
        return;
      }
  
      messageContainer.textContent = "";
      container.innerHTML = ""; // Clear previous content
  
      // Render each win listing
      winData.forEach((listing) => {
        const now = new Date();
        const endDate = new Date(listing.endsAt);
        const isEnded = now > endDate;
  
        const media = listing.media[0]?.url
          ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt || "Listing image"}" class="w-24 h-24 object-cover rounded-lg" />`
          : `<div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">No Image</div>`;
  
        const listingElement = document.createElement("a");
        listingElement.href = `/listing/?listingID=${listing.id}`;
        listingElement.className =
          "item-card bg-white border border-gray-300 rounded-lg p-4 flex items-center shadow-md relative";
  
        listingElement.innerHTML = `
          <div class="relative">
            ${media}
            ${
              isEnded
                ? `<div class="absolute inset-0 bg-white/70 flex justify-center items-center text-red-500 font-bold">
                     Auction Ended
                   </div>`
                : ""
            }
          </div>
          <div class="item-details ml-4">
            <h3 class="text-lg font-semibold">${listing.title}</h3>
            <div class="flex justify-between items-center mt-2">
              <p class="text-gray-700 text-sm">Tags: ${listing.tags.join(", ")}</p>
            </div>
            ${
              isEnded
                ? `<p class="mt-2 text-sm text-gray-400">Ended: <span class="font-bold">${endDate.toLocaleString()}</span></p>`
                : `<p class="mt-2 text-sm text-gray-400">Ends in: <span class="font-bold">${endDate.toLocaleString()}</span></p>`
            }
          </div>
        `;
  
        container.appendChild(listingElement);
      });
  
      // Update pagination information
      const meta = response.meta;
      paginationInfo.textContent = `Page ${meta.currentPage} of ${meta.pageCount}`;
      prevBtn.disabled = !meta.previousPage;
      nextBtn.disabled = !meta.nextPage;
  
      // Handle pagination
      prevBtn.onclick = () => renderUserWinsListings(username, limit, page - 1);
      nextBtn.onclick = () => renderUserWinsListings(username, limit, page + 1);
    } catch (error) {
      console.error("Error fetching wins:", error);
      container.innerHTML = `<p class="text-red-500">Failed to load your wins.</p>`;
    }
  }
  
  