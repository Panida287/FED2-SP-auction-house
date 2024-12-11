import { readUserBidsWins,readListingsByUser } from "../../api/listing/read";
import { renderListingsToContainer } from "../listing/display";
import { updateCountdown } from "../../utilities/updateCountdown";
import { FALLBACK_IMG } from "../../api/constants";

export async function renderListingsByUser(username, page = 1, limit = 12) {
  const container = document.querySelector(".result-container");
  const messageContainer = document.querySelector(".message-container");
  const paginationContainer = document.querySelector(".pagination");
  const paginationInfo = document.querySelector(".page-info");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  try {
    const response = await readListingsByUser(limit, page, username);
    const listings = response.data;
    const meta = response.meta;

    if (!listings || listings.length === 0) {
      messageContainer.textContent = `No listings found for user: ${username}`;
      container.innerHTML = ""; // Clear previous content
      paginationContainer.style.display = "none"; // Hide pagination
      return;
    }

    messageContainer.textContent = "";
    paginationContainer.style.display = "flex"; // Show pagination
    container.innerHTML = ""; // Clear existing content

    listings.forEach((listing) => {
      const now = new Date();
      const endDate = new Date(listing.endsAt);
      const listingCreated = new Date(listing.created);
      const isEnded = now > endDate;
      const countdownTimerId = `countdown-${listing.id}`;

      const listingElement = document.createElement("a");
      listingElement.className =
        "item-card bg-white/5 backdrop-blur-lg rounded-2xl p-4 pb-[80px] mx-auto w-[350px] flex items-start shadow-md w-full mb-4 md:w-[400px]";
      listingElement.href = `/listing/?listingID=${listing.id}&_seller=true&_bids=true`;

      const lastBidAmount = listing.bids?.length
        ? listing.bids[listing.bids.length - 1].amount
        : "0";

      listingElement.innerHTML = `
        <div class="listing-img h-[150px] w-[150px] rounded-lg overflow-hidden mr-4">
          <img 
            src="${listing.media?.[0]?.url || FALLBACK_IMG}"
            alt="${listing.media?.[0]?.alt || 'Listing Image'}"
            class="w-full h-full object-cover"
            onerror="this.src='/fallback-image.png'"
          />
        </div>
        <div class="listing-details flex flex-col justify-between h-full">
          <h3 class="listing-title text-gray-300 text-lg font-semibold -mt-1">
            ${listing.title || "No title"}
          </h3>
          <p class="listing-bids text-gray-400 text-sm mt-2">
            Bids: ${listing._count?.bids || 0}
          </p>
          <p class="listing-current-bid text-gray-400 text-sm">
            Last bid: ${lastBidAmount} NOK
          </p>
          <p class="listing-created text-gray-400 text-sm">
            Created: ${listingCreated.toLocaleDateString()}
          </p>
          <div id="${countdownTimerId}" class="countdown text-sm text-gray-400 mt-2"></div>
                  ${
          isEnded
            ? `<div class="absolute h-[80px] w-full bottom-0 left-0 flex justify-center items-center text-red-500 font-bold text-lg">
                Auction Ended
              </div>`
            : ""
        }
        </div>
      `;

      container.appendChild(listingElement);

      // Initialize countdown timer if the auction hasn't ended
      if (!isEnded) {
        const timerElement = document.getElementById(countdownTimerId);
        updateCountdown(endDate, timerElement);
      }
    });

    // Update pagination
    paginationInfo.textContent = `Page ${meta.currentPage} of ${meta.pageCount}`;
    prevBtn.disabled = !meta.previousPage;
    nextBtn.disabled = !meta.nextPage;

    // Add pagination functionality
    prevBtn.onclick = () => renderListingsByUser(username, page - 1, limit);
    nextBtn.onclick = () => renderListingsByUser(username, page + 1, limit);
  } catch (error) {
    console.error("Error rendering user listings:", error);
    container.innerHTML = `<p class="text-red-500">Failed to load listings. Please try again later.</p>`;
    paginationContainer.style.display = "none"; // Hide pagination in case of error
  }
}


export async function renderUserBidsListings(username, limit = 12, page = 1) {
  const container = document.querySelector(".result-container");
  const messageContainer = document.querySelector(".message-container");
  const paginationContainer = document.querySelector(".pagination"); // Select the pagination container
  const paginationInfo = document.querySelector(".page-info");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  try {
    const response = await readUserBidsWins("bids", limit, page, username);
    const bidData = response.data;

    if (!bidData || bidData.length === 0) {
      messageContainer.textContent = `${username} has not bid on anything yet.`;
      container.innerHTML = ""; // Clear previous content
      paginationContainer.style.display = "hidden"; // Hide pagination
      return;
    }

    if (bidData.length <= 12) {
      paginationContainer.style.display = "hidden"; // Hide pagination
      return;
    }

    messageContainer.textContent = "";
    paginationContainer.style.display = "flex"; // Show pagination if bids are found
    container.innerHTML = ""; // Clear existing content

    // Process each bid
    bidData.forEach((bid) => {
      const { listing, amount, created } = bid;

      if (!listing) return; // Skip if no listing data is available

      const now = new Date();
      const endDate = new Date(listing.endsAt);
      const isEnded = now > endDate;

      const card = document.createElement("div");
      card.className = "card bg-gray-800 text-white rounded-lg overflow-hidden shadow-md";
      card.innerHTML = `
        <a href="/listing/?listingID=${listing.id}" class="block relative">
          <img
            class="object-cover w-full h-48"
            src="${listing.media?.[0]?.url || '/fallback-image.png'}"
            alt="${listing.media?.[0]?.alt || 'Listing Image'}"
            onerror="this.src='/fallback-image.png'"
          />
          ${
            isEnded
              ? `<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-red-500 font-bold text-xl">
                  Auction Ended
                </div>`
              : ""
          }
        </a>
        <div class="p-4">
          <h3 class="text-lg font-bold">${listing.title}</h3>
          <p class="text-sm text-gray-400">${listing.description}</p>
          <div class="flex justify-between items-center mt-2">
            <span class="text-gray-300 text-sm">Your Bid: ${amount} NOK</span>
            <span class="text-gray-300 text-sm">Created: ${new Date(created).toLocaleDateString()}</span>
          </div>
          <div id="countdown-${listing.id}" class="text-sm text-gray-400 mt-2"></div>
        </div>
      `;

      container.appendChild(card);

      // Initialize countdown timer if the auction hasn't ended
      if (!isEnded) {
        const timerElement = document.getElementById(`countdown-${listing.id}`);
        updateCountdown(endDate, timerElement);
      }
    });

    // Update pagination
    const meta = response.meta;
    paginationInfo.textContent = `Page ${meta.currentPage} of ${meta.pageCount}`;
    prevBtn.disabled = !meta.previousPage;
    nextBtn.disabled = !meta.nextPage;

    // Add pagination functionality
    prevBtn.onclick = () => renderUserBidsListings(username, limit, page - 1);
    nextBtn.onclick = () => renderUserBidsListings(username, limit, page + 1);
  } catch (error) {
    console.error("Error fetching bids with listings:", error);
    container.innerHTML = `<p class="text-red-500">Failed to load user bids.</p>`;
    paginationContainer.style.display = "hidden"; // Hide pagination in case of error
  }
}

export async function renderUserWinsListings(username, limit = 12, page = 1) {
  const container = document.querySelector(".result-container");
  const messageContainer = document.querySelector(".message-container");
  const paginationContainer = document.querySelector(".pagination"); // Select pagination container
  const paginationInfo = document.querySelector(".page-info");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  try {
    const response = await readUserBidsWins("wins", limit, page, username);
    const winData = response.data;

    // Clear previous content
    container.innerHTML = "";
    messageContainer.textContent = "";

    // Check if no wins found
    if (!winData || winData.length === 0) {
      messageContainer.textContent = `${username} hasn't won anything yet.`;
      paginationContainer.style.display = "hidden"; // Hide pagination
      return;
    }

    // Show pagination if wins are found
    paginationContainer.style.display = "flex";

    // Render each win listing
    winData.forEach((listing) => {
      const listingElement = renderListingsToContainer([listing], container);
      container.appendChild(listingElement);
    });

    // Update pagination
    const meta = response.meta;
    paginationInfo.textContent = `Page ${meta.currentPage} of ${meta.pageCount}`;
    prevBtn.disabled = !meta.previousPage;
    nextBtn.disabled = !meta.nextPage;

    // Handle pagination functionality
    prevBtn.onclick = () => renderUserWinsListings(username, limit, page - 1);
    nextBtn.onclick = () => renderUserWinsListings(username, limit, page + 1);
  } catch (error) {
    console.error("Error fetching wins:", error);
    container.innerHTML = `<p class="text-red-500">Failed to load user wins.</p>`;
    paginationContainer.style.display = "hidden"; // Hide pagination in case of error
  }
}




  
  