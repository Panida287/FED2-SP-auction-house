import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path"; // Ensure path is imported

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  appType: "mpa",
  base: "/FED2-SP-auction-house/", // Add this to specify the base path for GitHub Pages
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        login: path.resolve(__dirname, "auth/login/index.html"),
        register: path.resolve(__dirname, "auth/register/index.html"),
        profile: path.resolve(__dirname, "profile/index.html"),
        listing: path.resolve(__dirname, "listing/index.html"),
      },
    },
  },
});

