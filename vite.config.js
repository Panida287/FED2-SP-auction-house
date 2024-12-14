import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  appType: "mpa", // Multi-Page Application
  base: "", // Add your repository name here
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
