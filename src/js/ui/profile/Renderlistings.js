import { readUserBidsWins, readListingsByUser } from "../../api/listing/read";
import { updateCountdown } from "../../utilities/updateCountdown";
import { FALLBACK_IMG } from "../../api/constants";
import { truncateText } from "../../utilities/truncateText";

export async function renderListingsByUser(username, page = 1, limit = 12) {
  const container = document.querySelector(".result-container");
  const resultTitle = document.querySelector(".result-title");
  const messageContainer = document.querySelector(".message-container");
  const paginationContainer = document.querySelector(".pagination");
  const paginationInfo = document.querySelector(".page-info");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  try {
    const response = await readListingsByUser(limit, page, username);
    const listings = response.data;
    const meta = response.meta;

    // Clear existing content
    container.innerHTML = "";
    messageContainer.textContent = "";
    resultTitle.textContent = "";

    if (!listings || listings.length === 0) {
      messageContainer.textContent = `No listings found for user: ${username}`;
      paginationContainer.classList.add("hidden"); // Hide pagination
      return;
    }

    // Show or hide pagination based on totalCount
    if (meta.totalCount > limit) {
      paginationContainer.classList.remove("hidden"); // Show pagination
      paginationContainer.classList.add("flex");
    } else {
      paginationContainer.classList.add("hidden"); // Hide pagination
    }

    resultTitle.textContent = `All listings sold by ${username}`;

    // Render listings
    listings.forEach((listing) => {
      const now = new Date();
      const endDate = new Date(listing.endsAt);
      const listingCreated = new Date(listing.created);
      const isEnded = now > endDate;
      const countdownTimerId = `countdown-${listing.id}`;

      const listingElement = document.createElement("a");
      listingElement.className =
        "item-card bg-card backdrop-blur-lg rounded-2xl p-4 pb-[80px] mx-auto flex items-start shadow-md w-full";
      listingElement.href = `/listing/?listingID=${listing.id}&_seller=true&_bids=true`;

      const lastBidAmount = listing.bids?.length
        ? listing.bids[listing.bids.length - 1].amount
        : "0";

      listingElement.innerHTML = `
        <div class="listing-img h-[150px] w-[150px] rounded-lg overflow-hidden mr-4">
          <img 
            src="${listing.media?.[0]?.url || FALLBACK_IMG}"
            alt="${listing.media?.[0]?.alt || "Listing Image"}"
            class="w-full h-full object-cover"
            onerror="this.src='/fallback-image.png'"
          />
        </div>
        <div class="listing-details flex flex-col justify-between items-start w-full h-full">
          <h3 class="listing-title text-gray-300 text-lg font-semibold -mt-1 flex w-full justify-center">
          ${truncateText(listing.title,20,40) || "No title"}
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
          <div id="${countdownTimerId}" class="absolute bottom-3 countdown text-sm text-gray-400 mt-2"></div>
                  ${
                    isEnded
                      ? `<div class="absolute h-[80px] w-full bottom-0 left-0 flex justify-center items-center text-red-500 font-bold text-lg">
                Auction ended on: ${endDate.toLocaleDateString()}
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
    paginationContainer.classList.add("hidden"); // Hide pagination in case of error
  }
}

export async function renderUserBidsListings(username, limit = 12, page = 1) {
  const container = document.querySelector(".result-container");
  const resultTitle = document.querySelector(".result-title");
  const messageContainer = document.querySelector(".message-container");
  const paginationContainer = document.querySelector(".pagination");
  const paginationInfo = document.querySelector(".page-info");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  try {
    const response = await readUserBidsWins("bids", limit, page, username);
    const bidData = response.data;

    // Clear previous content
    container.innerHTML = "";
    messageContainer.textContent = "";
    resultTitle.textContent = "";

    if (!bidData || bidData.length === 0) {
      messageContainer.textContent = `${username} has not bid on anything yet.`;
      paginationContainer.classList.add("hidden"); // Hide pagination
      return;
    }

    // Show or hide pagination based on totalCount
    if (bidData.length > limit) {
      paginationContainer.classList.remove("hidden"); // Show pagination
      paginationContainer.classList.add("flex");
    } else {
      paginationContainer.classList.add("hidden"); // Hide pagination
    }

    resultTitle.textContent = `All bids made by ${username}`;

    // Render each bid listing
    bidData.forEach((bid) => {
      const { listing, amount, created } = bid;

      if (!listing) return; // Skip if no listing data is available

      const now = new Date();
      const endDate = new Date(listing.endsAt);
      const isEnded = now > endDate;
      const countdownTimerId = `countdown-${listing.id}`;

      const card = document.createElement("a");
      card.className =
        "item-card bg-white/5 backdrop-blur-lg rounded-2xl p-4 pb-[80px] mx-auto flex items-start shadow-md w-full";
      card.href = `/listing/?listingID=${listing.id}`;

      card.innerHTML = `
        <div class="listing-img h-[150px] w-[150px] rounded-lg overflow-hidden mr-4">
          <img 
            src="${listing.media?.[0]?.url || FALLBACK_IMG}"
            alt="${listing.media?.[0]?.alt || "Listing Image"}"
            class="w-full h-full object-cover"
            onerror="this.src='/fallback-image.png'"
          />
        </div>
        <div class="listing-details flex flex-col justify-between w-full h-full">
          <h3 class="listing-title text-gray-300 text-lg font-semibold -mt-1 w-full flex justify-center">
          ${truncateText(listing.title, 20, 40) || "No title"}
          </h3>
          <p class="listing-bids text-gray-400 text-sm mt-2">
            Your Bid: ${amount} NOK
          </p>
          <p class="listing-current-bid text-gray-400 text-sm">
            Date Bided: ${new Date(created).toLocaleDateString()}
          </p>
          <div id="${countdownTimerId}" class="countdown absolute bottom-3 text-sm text-gray-400 mt-2"></div>
          ${
            isEnded
              ? `<div class="absolute h-[80px] w-full bottom-0 left-0 flex justify-center items-center text-red-500 font-bold text-lg">
                Auction ended on: ${endDate.toLocaleDateString()}
              </div>`
              : ""
          }
        </div>
      `;

      container.appendChild(card);

      // Initialize countdown timer if the auction hasn't ended
      if (!isEnded) {
        const timerElement = document.getElementById(countdownTimerId);
        updateCountdown(endDate, timerElement);
      }
    });

    // Update pagination
    paginationInfo.textContent = `Page ${page} of ${Math.ceil(bidData.length / limit)}`;

    // Add pagination functionality
    prevBtn.onclick = () => renderUserBidsListings(username, limit, page - 1);
    nextBtn.onclick = () => renderUserBidsListings(username, limit, page + 1);
  } catch (error) {
    console.error("Error fetching bids with listings:", error);
    container.innerHTML = `<p class="text-red-500">Failed to load user bids.</p>`;
    paginationContainer.classList.add("hidden"); // Hide pagination in case of error
  }
}


export async function renderUserWinsListings(username, limit = 12, page = 1) {
  const container = document.querySelector(".result-container");
  const resultTitle = document.querySelector(".result-title");
  const messageContainer = document.querySelector(".message-container");
  const paginationContainer = document.querySelector(".pagination");
  const paginationInfo = document.querySelector(".page-info");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  try {
    const response = await readUserBidsWins("wins", limit, page, username);
    const winData = response.data;

    // Clear previous content
    container.innerHTML = "";
    messageContainer.textContent = "";
    resultTitle.textContent = "";

    if (!winData || winData.length === 0) {
      messageContainer.textContent = `${username} hasn't won anything yet.`;
      paginationContainer.classList.add("hidden"); // Hide pagination
      return;
    }

    // Show pagination if wins are found
    if (winData.length > limit) {
      paginationContainer.classList.remove("hidden"); // Show pagination
      paginationContainer.classList.add("flex");
    } else {
      paginationContainer.classList.add("hidden"); // Hide pagination
    }

    resultTitle.textContent = `All listings won by ${username}`;

    // Render each win listing
    winData.forEach((listing) => {
      const { title, _count, endsAt, media } = listing;
      const endDate = new Date(endsAt);
      const card = document.createElement("div");
      card.className =
        "item-card bg-white/5 backdrop-blur-lg rounded-2xl p-4 mx-auto flex flex-col items-start shadow-md w-full";

      card.innerHTML = `
        <div class="listing-details flex flex-col justify-between w-full">
          <img 
            src="${media?.[0]?.url || FALLBACK_IMG}"
            alt="${media?.[0]?.alt || "Listing Image"}"
            class="w-full h-full object-cover rounded-lg mb-4"
            onerror="this.src='${FALLBACK_IMG}'"
          />
          <h3 class="listing-title text-gray-300 text-lg font-semibold -mt-1 w-full flex justify-center">
          ${truncateText(title, 20, 40) || "No title"}
          </h3>
          <p class="listing-bids text-gray-400 text-sm mt-2">
            Bids: ${_count?.bids || 0}
          </p>
          <p class="listing-ended text-gray-400 text-sm mt-2">
            Ended: ${endDate.toLocaleDateString()}
          </p>
        </div>
      `;

      container.appendChild(card);
    });

    // Update pagination
    paginationInfo.textContent = `Page ${page} of ${Math.ceil(winData.length / limit)}`;

    // Handle pagination functionality
    prevBtn.onclick = () => renderUserWinsListings(username, limit, page - 1);
    nextBtn.onclick = () => renderUserWinsListings(username, limit, page + 1);
  } catch (error) {
    console.error("Error fetching wins:", error);
    container.innerHTML = `<p class="text-red-500">Failed to load user wins.</p>`;
    paginationContainer.classList.add("hidden"); // Hide pagination in case of error
  }
}

