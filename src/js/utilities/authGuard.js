import { renderProfile } from "../ui/profile/renderProfile";

export function authGuard() {
     const profileBtn = document.querySelector(".profile-btn");
     const credits = document.querySelectorAll(".credit");
     const headerElements = document.querySelector(".header-elements");
     const navBar = document.querySelector(".nav-bar");
     const mobileNavbar = document.querySelector(".mobile-nav");
     console.log(navBar);
   
     // Check if the user is authenticated
     const isAuthenticated = localStorage.getItem("accessToken");
   
     if (!isAuthenticated) {
       // If the user is not logged in, change the profile button's behavior
       profileBtn.classList.remove("flex"); // Remove the 'flex' class
       profileBtn.classList.add("hidden"); // Add the 'hidden' class

   
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
       loginLink.className = "pink-buttons"; // Add the class
       loginLink.textContent = "Login"; // Add text content
   
       // Append the link to the header container
       if (headerElements) {
         headerElements.appendChild(loginLink);
       }
     } else {
       renderProfile(); // Render the profile for authenticated users
     }
   }
   