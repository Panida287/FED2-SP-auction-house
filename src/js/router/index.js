export default async function router(pathname = window.location.pathname) {
    switch (pathname) {
      case "/":
        await import("./router/views/home.js");
        break;
      case "/auth/":
        await import("./router/views/auth.js");
        break;
      case "/auth/login/":
        await import("./router/views/login.js");
        break;
      case "/auth/register/":
        await import("./router/views/register.js");
        break;
      case "/listing/":
        await import("./router/views/listing.js");
        break;
      case "/listing/edit/":
        await import("./router/views/listingEdit.js");
        break;
      case "/listing/create/":
        await import("./router/views/listingCreate.js");
        break;
      case "/profile/":
        await import("./router/views/profile.js");
        break;
      default:
        await import("./router/views/notFound.js");
    }
  }
  