import { renderProfile } from "../ui/profile/renderProfile";

export function authGuard() {
     const profile = document.querySelector(".profile");
     const credits = document.querySelectorAll(".credit");
     const headerElements = document.querySelector(".header-elements");
     const navBar = document.querySelector(".nav-bar");
     const mobileNavbar = document.querySelector(".mobile-nav");
     const bidContainer = document.querySelector(".bid-container");
   
     const isAuthenticated = localStorage.getItem("accessToken");
   
     if (!isAuthenticated) {
       profile.classList.remove("flex");
       profile.classList.add("hidden"); 

       if (navBar) {
          navBar.classList.add("md:hidden");
          navBar.classList.remove("md:flex");
        }
        
       if (mobileNavbar) mobileNavbar.classList.add("hidden");
   
       credits.forEach((credit) => {
         credit.classList.add("hidden");
       });
   
       const loginLink = document.createElement("a");
       loginLink.href = "auth/login/";
       loginLink.className = "pink-buttons z-10 mr-2";
       loginLink.textContent = "Login";
   
       if (headerElements) {
         headerElements.appendChild(loginLink);
       }

       if (bidContainer) {
        const loginToBid = document.createElement("div");
        loginToBid.innerHTML = `
        <span class="login-to-bid h-full w-full bg-white/60 absolute top-0 left-0 flex gap-2 font-bold justify-center items-center backdrop-blur-md md:bg-transparent md:relative md:-translate-y-[50px] md:h-[60px] md:rounded-xl">
          Please
          <a href="/auth/login/"
          class="pink-buttons">
          Login
          </a>
          Or
          <a href="/auth/register/"
          class="text-accent hover:underline">
          Register
          </a>
          to place bids
        </span>
        `
       bidContainer.appendChild(loginToBid);
       }

     } else {
       renderProfile();
     }
   }
   