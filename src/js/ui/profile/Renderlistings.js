import { readUserBidsWins,readListingsByUser } from "../../api/listing/read";
import { renderListingsToContainer } from "../listing/display";

export async function renderListingsByUser(username, page = 1, limit = 12) {
  const container = document.querySelector(".result-container");
  const messageContainer = document.querySelector(".message-container");
  const paginationContainer = document.querySelector(".pagination"); // Select the pagination container
  const paginationInfo = document.querySelector(".page-info");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  try {
    const response = await readListingsByUser(limit, page, username);
    const listings = response.data;
    const meta = response.meta;

    if (listings.length === 0) {
      messageContainer.textContent = `No listings found for user: ${username}`;
      paginationContainer.style.display = "hidden";
      container.innerHTML = ""; // Clear previous content
      return;
    }
    
    messageContainer.textContent = "";
    paginationContainer.style.display = "flex"; // Show pagination if listings are found

    renderListingsToContainer(listings, container);

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
    paginationContainer.style.display = "hidden"; // Hide pagination in case of error
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

    messageContainer.textContent = "";
    paginationContainer.style.display = "flex"; // Show pagination if bids are found

    container.innerHTML = ""; // Clear previous listings

    // Render each bid's associated listing
    bidData.forEach((bid) => {
      const { listing } = bid;
      if (!listing) return;
      renderListingsToContainer([listing], container);
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


  
  