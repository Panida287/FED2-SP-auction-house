import { readUserBidsWins,readListingsByUser } from "../../api/listing/read";
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
    paginationContainer.style.display = "none"; // Hide pagination in case of error
  }
}

export async function renderUserBidsListings(username, limit = 12, page = 1) {
  const container = document.querySelector(".result-container");
  const messageContainer = document.querySelector(".message-container");
  const paginationContainer = document.querySelector(".pagination");
  const paginationInfo = document.querySelector(".page-info");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  try {
    const response = await readUserBidsWins("bids", limit, page, username);
    const bidData = response.data;

    if (!bidData || bidData.length === 0) {
      messageContainer.textContent = `${username} has not bid on anything yet.`;
      container.innerHTML = ""; // Clear previous content
      paginationContainer.style.display = "none"; // Hide pagination
      return;
    }

    messageContainer.textContent = "";
    paginationContainer.style.display = "flex"; // Show pagination if bids are found
    container.innerHTML = ""; // Clear existing content

    bidData.forEach((bid) => {
      const { listing, amount, created } = bid;

      if (!listing) return; // Skip if no listing data is available

      const now = new Date();
      const endDate = new Date(listing.endsAt);
      const isEnded = now > endDate;
      const countdownTimerId = `countdown-${listing.id}`;

      const card = document.createElement("a");
      card.className =
        "item-card bg-white/5 backdrop-blur-lg rounded-2xl p-4 pb-[80px] mx-auto w-[350px] flex items-start shadow-md w-full mb-4 md:w-[400px]";
      card.href = `/listing/?listingID=${listing.id}`;

      card.innerHTML = `
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
            Your Bid: ${amount} NOK
          </p>
          <p class="listing-current-bid text-gray-400 text-sm">
            Date Bided: ${new Date(created).toLocaleDateString()}
          </p>
          <div id="${countdownTimerId}" class="countdown text-sm text-gray-400 mt-2"></div>
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
    paginationContainer.style.display = "none"; // Hide pagination in case of error
  }
}

export async function renderUserWinsListings(username, limit = 12, page = 1) {
  const container = document.querySelector(".result-container");
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

    // Check if no wins found
    if (!winData || winData.length === 0) {
      messageContainer.textContent = `${username} hasn't won anything yet.`;
      paginationContainer.style.display = "none"; // Hide pagination
      return;
    }

    // Show pagination if wins are found
    paginationContainer.style.display = "flex";

    // Render each win listing
    winData.forEach((listing) => {
      const { title, _count, endsAt, media } = listing;
      const endDate = new Date(endsAt);
      const card = document.createElement("div");
      card.className = "item-card bg-white/5 backdrop-blur-lg rounded-2xl p-4 mx-auto w-[350px] flex flex-col items-start shadow-md w-full mb-4 md:w-[400px]";

      card.innerHTML = `
        <div class="listing-details flex flex-col justify-between w-full">
          <img 
            src="${media?.[0]?.url || FALLBACK_IMG}"
            alt="${media?.[0]?.alt || 'Listing Image'}"
            class="w-full h-full object-cover rounded-lg mb-4"
            onerror="this.src='${FALLBACK_IMG}'"
          />
          <h3 class="listing-title text-gray-300 text-lg font-semibold -mt-1">
            ${title || "No title"}
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
    paginationContainer.style.display = "none"; // Hide pagination in case of error
  }
}

    