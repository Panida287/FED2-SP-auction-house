import { renderProfile } from "../ui/profile/renderProfile";

export function authGuard() {
     const profile = document.querySelector(".profile");
     const credits = document.querySelectorAll(".credit");
     const headerElements = document.querySelector(".header-elements");
     const navBar = document.querySelector(".nav-bar");
     const mobileNavbar = document.querySelector(".mobile-nav");
     const bidContainer = document.querySelector(".bid-container");
     const submitBidBtn = document.getElementById("submit-bid")
   
     const isAuthenticated = localStorage.getItem("accessToken");
   
     if (!isAuthenticated) {
       profile.classList.remove("flex");
       profile.classList.add("hidden"); 
       if (submitBidBtn) {
       submitBidBtn.disabled = true;
       }

       if (navBar) {
          navBar.classList.add("md:hidden");
          navBar.classList.remove("md:flex");
        }
        
       if (mobileNavbar) mobileNavbar.classList.add("hidden");
   
       credits.forEach((credit) => {
         credit.classList.add("hidden");
       });
   
       const loginLink = document.createElement("a");
       loginLink.href = "/auth/login/";
       loginLink.className = "pink-buttons z-10 mr-2";
       loginLink.textContent = "Login";
   
       if (headerElements) {
         headerElements.appendChild(loginLink);
       }

       if (bidContainer) {
        const loginToBid = document.createElement("div");
        loginToBid.innerHTML = `
        <span class="login-to-bid h-full w-full flex bg-white/60 absolute -translate-y-[105px] md:flex-col md:top-0 left-0 gap-2 font-bold justify-center items-center backdrop-blur-md md:bg-transparent md:relative md:-translate-y-[100px] md:h-[100px] md:rounded-xl md:text-xs">
          <div>
            Please
            <a href="/auth/login/"
            class="pink-buttons">
            Login
            </a>
          </div>
          <div>
            Or
            <a href="/auth/register/"
            class="text-accent hover:underline">
            Register
            </a>
            to place bids
          </div>
        </span>
        `
       bidContainer.appendChild(loginToBid);
       }

     } else {
       renderProfile();
     }
   }
   