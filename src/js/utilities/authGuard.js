export function authGuard() {
    if (!localStorage.accessToken) {
         // Authentication logic will go here
    }
  }