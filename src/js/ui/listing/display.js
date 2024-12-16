import {
  readListings,
  readListing,
  searchListings,
} from "../../api/listing/read";
import { FALLBACK_AVATAR, FALLBACK_IMG } from "../../api/constants";
import { updateCountdown } from "../../utilities/updateCountdown";
import { truncateText } from "../../utilities/truncateText";

/**
 * Generates stacked avatars for bidders and appends them to a container.
 *
 * @param {Array} bids - Array of bid objects.
 * @param {HTMLElement} container - The DOM element to render the avatars into.
 */
function renderBiddersAvatars(bids, container) {
  container.innerHTML = "";

  const maxAvatars = 3; 
  const uniqueBidders = [
    ...new Map(bids.map((bid) => [bid.bidder?.email, bid.bidder])).values(),
  ];
  const displayedBidders = uniqueBidders.slice(0, maxAvatars);

  displayedBidders.forEach((bidder, index) => {
    const avatarElement = document.createElement("img");
    avatarElement.className =
      "h-8 w-8 rounded-full border-2 border-white object-cover shadow-sm";
    avatarElement.src = bidder?.avatar?.url || FALLBACK_AVATAR;
    avatarElement.alt = bidder?.avatar?.alt || "Bidder Avatar";
    avatarElement.loading = "lazy";

    avatarElement.style.position = "relative";
    avatarElement.style.left = `${index * -10}px`;

    container.appendChild(avatarElement);
  });

  if (uniqueBidders.length > maxAvatars) {
    const remainingCount = uniqueBidders.length - maxAvatars;
    const moreIndicator = document.createElement("div");
    moreIndicator.className =
      "h-8 w-8 rounded-full bg-gray-500 text-white text-xs flex items-center justify-center border-2 border-white shadow-sm";
    moreIndicator.style.position = "relative";
    moreIndicator.style.left = `${maxAvatars * -10}px`;
    moreIndicator.textContent = `+${remainingCount}`;

    container.appendChild(moreIndicator);
  }

  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.position = "relative";
}

/**
 * Renders a list of listings into a given container.
 *
 * @param {Array} listings - Array of listing objects to render.
 * @param {HTMLElement} container - The DOM element where the listings will be appended.
 */
export function renderListingsToContainer(listings, container) {
  container.innerHTML = "";

  listings.forEach((listing) => {
    const now = new Date();
    const endDate = new Date(listing.endsAt);
    const listingCreated = new Date(listing.created);
    const isEnded = now > endDate;
    const countdownTimerId = `countdown-${listing.id}`;

    const listingElement = document.createElement("div");
    listingElement.className =
      "item-card bg-card backdrop-blur-lg rounded-2xl p-4 mx-auto mb-10 flex flex-col items-center shadow-md w-full max-w-[568px] lg:w-[360px]";

    const biddersContainer = document.createElement("div");
    biddersContainer.className = "flex items-center justify-start mt-2";

    renderBiddersAvatars(listing.bids || [], biddersContainer);

    const lastBidAmount = listing.bids?.length
      ? listing.bids[listing.bids.length - 1].amount
      : "0";

    listingElement.innerHTML = `
      <div class="flex w-full justify-between items-center mb-4">
        <div class="seller flex items-center">
          <img 
            class="w-10 h-10 rounded-full object-cover" 
            src="${listing.seller?.avatar?.url || FALLBACK_AVATAR}" 
            alt="${listing.seller?.avatar?.alt || "user's avatar"}"
            onerror="this.src='${FALLBACK_AVATAR}'" 
            loading="lazy"
          />
          <div class="flex flex-col pl-2">
            <p class="text-white text-sm flex items-center">
              Selling by
            </p>
            <p class="text-sm text-gray-400 font-semibold">
              ${listing.seller?.name || "Me"}
            </p>
          </div>
        </div>
      </div>
      <a class="relative w-full"
      href="/listing/?listingID=${listing.id}&_seller=true&_bids=true"
      aria-label="to see this listing detail">
        <img 
          src="${listing.media?.[0]?.url || FALLBACK_IMG}" 
          alt="${listing.media?.[0]?.alt || "Item image"}" 
          class="w-full max-w-[600px] h-[300px] object-cover rounded-lg"
          onerror="this.src='${FALLBACK_IMG}'"
          loading="lazy"
        />
        <div id="${countdownTimerId}" class="absolute bottom-2 left-1/2 transform -translate-x-1/2"></div>
        ${
          isEnded
            ? `<div class="absolute h-full w-full top-0 left-0 bg-black/50 flex justify-center items-center text-error font-bold text-lg">
                Auction Ended
              </div>`
            : ""
        }
      </a>
      <div class="item-details flex flex-col w-full mt-4">
        <h3 class="text-center text-lg text-white font-semibold break-words">${truncateText(listing.title,20,30)}</h3>
        <p class="text-sm font-light text-white bg-white/20 rounded-md p-4 mt-2 break-words">
        ${truncateText(listing.description, 40, 100)}
        </p>
        <div class="flex flex-col items-start">
          <div class="flex w-full justify-between items-center mt-2">
            <p class="text-gray-400 text-sm">Bids: <span class="font-bold">${
              listing._count?.bids
            }</span></p>
            <p class="text-gray-400 text-sm">Created: <span class="font-bold">
            ${listingCreated.toLocaleDateString()}</span>
            </p>
            <p class="text-gray-400 text-sm">Last bid: <span class="font-bold">${lastBidAmount} NOK</span></p>
          </div>
        </div>
        <!-- Insert the bidder container here -->
        <div class="bidder-container flex flex-row-reverse justify-between items-center mt-2">
            <a 
            href="/listing/?listingID=${listing.id}&_seller=true&_bids=true"
            class="pink-buttons mt-2 w-[50%]"
            aria-label="To bid on this listing">
              Bid now
              <i class="fa-solid fa-coins pl-1ss"></i>
            </a>
        </div>
      </div>
    `;

    const detailsContainer = listingElement.querySelector(
      ".item-details .bidder-container"
    );
    detailsContainer.appendChild(biddersContainer);

    container.appendChild(listingElement);

    if (!isEnded) {
      const timerElement = document.getElementById(countdownTimerId);
      updateCountdown(endDate, timerElement);
    }
  });
}

export async function renderListings(
  tag = null,
  page = 1,
  limit = 6,
  sortByBids = false,
  sortByEnding = false,
  query = null
) {
  const itemsSection = document.querySelector(".items-section");
  const messageContainer = document.querySelector(".message-container");
  const paginationContainer = document.querySelector(".pagination");
  const paginationInfo = document.querySelector(".page-info");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const firstPageBtn = document.querySelector(".first-page-btn");
  const lastPageBtn = document.querySelector(".last-page-btn");

  try {
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

    if (!listings || listings.length === 0) {
      messageContainer.textContent = "No listings found.";
      paginationContainer.classList.add("hidden");
      return;
    }

    const totalPages = Math.ceil(listings.length / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedListings = listings.slice(start, end);

    renderListingsToContainer(paginatedListings, itemsSection);

    if (totalPages > 1) {
      paginationContainer.classList.remove("hidden");
    } else {
      paginationContainer.classList.add("hidden");
    }

    paginationInfo.textContent = `${page} / ${totalPages}`;

    prevBtn.disabled = page <= 1;
    firstPageBtn.disabled = page <= 1;
    nextBtn.disabled = page >= totalPages;
    lastPageBtn.disabled = page >= totalPages;

    prevBtn.onclick = () => {
      if (page > 1) renderListings(tag, page - 1, limit, sortByBids, sortByEnding, query);
    };

    nextBtn.onclick = () => {
      if (page < totalPages) renderListings(tag, page + 1, limit, sortByBids, sortByEnding, query);
    };

    firstPageBtn.onclick = () => {
      if (page > 1) renderListings(tag, 1, limit, sortByBids, sortByEnding, query);
    };

    lastPageBtn.onclick = () => {
      if (page < totalPages) renderListings(tag, totalPages, limit, sortByBids, sortByEnding, query);
    };
  } catch (error) {
    console.error("Error rendering listings:", error);
    itemsSection.innerHTML = `<p class="text-error">Failed to load listings. Please try again later.</p>`;
    paginationContainer.classList.add("hidden");
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
  const itemImage = document.getElementById("item-image");
  const itemTitle = document.getElementById("item-title");
  const itemCategory = document.getElementById("item-category");
  const itemSeller = document.getElementById("item-seller");
  const itemDescription = document.getElementById("item-description");
  const price = document.getElementById("price");
  const biddingsCount = document.getElementById("biddings-count");
  const countdownTimer = document.getElementById("countdown-timer");
  const startPrice = document.getElementById("start-price");
  const bidInput = document.getElementById("bid-amount");
  const dateCreatedElement = document.getElementById("date-created");
  const winDetailsContainer = document.querySelector(".win-details");

  const auctionEndedOverlay = document.createElement("div");
  auctionEndedOverlay.className =
    "absolute top-1/2 left-0 w-full h-[35px] bg-white/70 flex justify-center items-center text-red-500 font-bold transform -rotate-12";

  try {
    const listing = await readListing();

    itemImage.src = listing.media?.[0]?.url || `${FALLBACK_IMG}`;
    itemImage.alt = listing.media?.[0]?.alt || "Item Image";

    itemImage.onerror = () => {
      itemImage.src = FALLBACK_IMG;
    };

    const now = new Date();
    const endDate = new Date(listing.endsAt);
    if (now > endDate) {
      auctionEndedOverlay.textContent = "Auction Ended";
      itemImage.parentElement.style.position = "relative";
      itemImage.parentElement.appendChild(auctionEndedOverlay);
    }

    const dateCreated = new Date(listing.created);
    dateCreatedElement.textContent = `${dateCreated.toLocaleDateString()}`;

    itemTitle.textContent = listing.title;
    itemCategory.innerHTML = `Category: <span class="font-medium">${
      listing.tags.join(", ") || "N/A"
    }</span>`;
    itemSeller.innerHTML = `Seller: <span class="font-medium">${
      listing.seller?.name || "Unknown"
    }</span>`;
    startPrice.innerHTML = `Start price: <span class="font-medium">${
      listing.bids?.[0]?.amount || "0"
    } NOK</span>`;

    itemDescription.textContent =
      listing.description || "No description available.";

    const loggedInUser = localStorage.getItem("userName");
    const editBtn = document.getElementById("edit-listing-btn");
    if (loggedInUser === listing.seller?.name && now < endDate) {
      editBtn.classList.remove("hidden");
      editBtn.classList.add("flex");
    } else {
      editBtn.classList.remove("flex");
      editBtn.classList.add("hidden");
    }

    const lastBidAmount =
      listing.bids && listing.bids.length > 0
        ? Math.max(...listing.bids.map((bid) => bid.amount))
        : "0";

    price.textContent = `${lastBidAmount || "0"} NOK`;
    biddingsCount.textContent = listing._count.bids || "0";

    const bidContainer = document.querySelector(".bid-container");
    if (now > endDate) {
      countdownTimer.textContent = `Ended: ${endDate.toLocaleString()}`;
      bidContainer.classList.add("hidden");
    } else {
      updateCountdown(endDate, countdownTimer);
    }

    if (now > endDate && listing.bids && listing.bids.length > 0) {
      const highestBid = listing.bids.reduce((maxBid, currentBid) =>
        currentBid.amount > maxBid.amount ? currentBid : maxBid
      );

      const winner = highestBid.bidder?.name || "Unknown";
      const winnerAvatar = highestBid.bidder?.avatar?.url || `${FALLBACK_AVATAR}`;
      const winnerAvatarAlt = highestBid.bidder?.avatar?.alt || "winner's avatar";
      const endedPrice = highestBid.amount || "0";

      const winDetails = document.createElement("div");
      winDetails.className = "flex flex-col text-text p-10 bg-card rounded-xl";
      winDetails.innerHTML = `
      <div class="flex flex-col gap-4">
        <p class="font-h text-xl font-bold flex w-full justify-center text-accent">Winner</p>
        <div class="flex">
          <img class="h-10 w-10 rounded-full object-cover mr-2" 
          src= ${winnerAvatar} 
          alt= ${winnerAvatarAlt}
          loading="lazy"> 
          <p class="flex items-center font-p">${winner}</p>
        </div>
      </div>
      <div class="flex mt-4">
        <p class="pr-2">Price won:</p>
        <p>${endedPrice} NOK</p>
      </div>
      `;
      countdownTimer.parentElement.appendChild(winDetails);
      winDetailsContainer.appendChild(winDetails);
    }

    bidInput.placeholder = `Enter more than ${lastBidAmount} NOK`;
    bidInput.min = lastBidAmount;

    const bidForm = document.getElementById("bid-form");
    if (loggedInUser === listing.seller?.name) {
      const bidNotAllowed = document.createElement("h2");
      bidNotAllowed.classList = "text-error";
      bidNotAllowed.textContent = "You cannot bid on your own listing";

      bidForm.classList = "hidden";

      bidContainer.appendChild(bidNotAllowed);
    }

  } catch (error) {
    console.error("Error rendering listings:", error);
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
export function renderPaginatedBids(bids, page, perPage, container) {
  container.innerHTML = "";

  const sortedBids = [...bids].sort(
    (a, b) => new Date(b.created) - new Date(a.created)
  );

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedBids = sortedBids.slice(start, end);

  if (paginatedBids.length === 0) {
    container.innerHTML = `<p class="text-gray-500">No bids available.</p>`;
    return;
  }

  paginatedBids.forEach((bid) => {
    const bidElement = document.createElement("div");
    bidElement.className = "flex border-b border-gray-300 pb-2";
    bidElement.innerHTML = `
      <div class="flex justify-start items-center gap-2 w-full">
        <img 
          class="h-8 w-8 rounded-full" 
          src="${bid?.bidder?.avatar?.url || FALLBACK_AVATAR}"
          alt="${bid?.bidder?.avatar?.alt || "Avatar"}"
          onerror="this.src='${FALLBACK_AVATAR}'"
          loading="lazy"
        >
        <p class="text-gray-300 font-medium">${
          bid?.bidder?.name || "Anonymous"
        }</p>
      </div>
      <div class="w-full flex flex-col justify-center items-end">
        <p class="text-gray-300 font-medium">Bidded ${bid?.amount} NOK</p>
        <p class="text-gray-400 text-sm">At: ${new Date(
          bid.created
        ).toLocaleString()}</p>
      </div>
    `;
    container.appendChild(bidElement);
  });
}


/**
 * Fetches listings and populates the existing carousel HTML structure.
 */
export async function renderCarousel() {
  const carouselItems = document.querySelectorAll(".carousel-item");

  try {
    const response = await readListings();
    const listings = response.data;

    const latestListings = listings
      .sort((a, b) => new Date(b.created) - new Date(a.created))
      .slice(0, 5);

    carouselItems.forEach((item, index) => {
      const listing = latestListings[index % latestListings.length];
      const now = new Date();
      const endDate = new Date(listing.endsAt);
      const isEnded = now > endDate;

      item.innerHTML = "";

      item.innerHTML = `
        <div class="block relative">
            <a href="/listing/?listingID=${listing.id}&_seller=true&_bids=true">
              <img
              src="${listing.media?.[0]?.url || FALLBACK_IMG}"
              alt="${listing.media?.[0]?.alt || "Item image"}"
              class="h-[300px] w-full max-w-[500px] object-cover rounded-lg"
              onerror="this.src='${FALLBACK_IMG}'"
              loading="lazy"
              />
            </a>
        </div>
      `;

      if (!isEnded) {
        const countdown = document.createElement("div");
        countdown.id = `countdown-carousel-${listing.id}`;
        countdown.className =
          "absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white";
        item.querySelector("a").appendChild(countdown);
        updateCountdown(endDate, countdown);
      }
    });
  } catch (error) {
    console.error("Error rendering listings:", error);
    carouselItems.forEach((item) => {
      item.innerHTML = `<p class="text-red-500 text-center mt-4">Failed to load data.</p>`;
    });
  }
}


