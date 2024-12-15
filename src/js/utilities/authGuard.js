import { renderProfile } from "../ui/profile/renderProfile";

export function authGuard() {
     const profile = document.querySelector(".profile");
     const credits = document.querySelectorAll(".credit");
     const headerElements = document.querySelector(".header-elements");
     const navBar = document.querySelector(".nav-bar");
     const mobileNavbar = document.querySelector(".mobile-nav");
     const bidContainer = document.querySelector(".bid-container");
   
     // Check if the user is authenticated
     const isAuthenticated = localStorage.getItem("accessToken");
   
     if (!isAuthenticated) {
       // If the user is not logged in, change the profile button's behavior
       profile.classList.remove("flex"); // Remove the 'flex' class
       profile.classList.add("hidden"); // Add the 'hidden' class

   
       // Hide navigation bars

       if (navBar) {
          navBar.classList.add("md:hidden"); // Add the 'hidden' class
          navBar.classList.remove("md:flex"); // Remove the 'flex' class
        }
        
       if (mobileNavbar) mobileNavbar.classList.add("hidden");
   
       // Loop through the NodeList to hide each credit element
       credits.forEach((credit) => {
         credit.classList.add("hidden");
       });
   
       // Dynamically create and append an <a> tag with a link to /login/
       const loginLink = document.createElement("a");
       loginLink.href = "auth/login/"; // Set the href to the login page
       loginLink.className = "pink-buttons z-10 mr-2"; // Add the class
       loginLink.textContent = "Login"; // Add text content
   
       // Append the link to the header container
       if (headerElements) {
         headerElements.appendChild(loginLink);
       }

       if (bidContainer) {
        const loginToBid = document.createElement("div");
        loginToBid.innerHTML = `
        <span class="login-to-bid h-full w-full absolute top-0 left-0 flex gap-2 font-bold justify-center items-center bg-white/80 backdrop-blur-md">
          Please
          <a href="/auth/login/"
          class="pink-buttons">
          Login
          </a>
          Or
          <a href="/auth/register/"
          class="pink-buttons">
          Register
          </a>
          to place bids
        </span>
        `
       bidContainer.appendChild(loginToBid);
       }

     } else {
       renderProfile(); // Render the profile for authenticated users
     }
   }
   