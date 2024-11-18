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
      case "/item/":
        await import("./router/views/item.js");
        break;
      case "/item/edit/":
        await import("./router/views/itemEdit.js");
        break;
      case "/item/create/":
        await import("./router/views/itemCreate.js");
        break;
      case "/profile/":
        await import("./router/views/profile.js");
        break;
      default:
        await import("./router/views/notFound.js");
    }
  }
  