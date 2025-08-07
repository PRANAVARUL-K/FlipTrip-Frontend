// utils/sessionUtils.js
// Centralized session management utilities

export const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=Strict`;
};

export const deleteAllCookies = () => {
  const cookies = ['userEmail', 'isLoggedIn', 'userName', 'rememberMe', 'userRole'];
  cookies.forEach(cookie => deleteCookie(cookie));
};

export const isAuthenticated = () => {
  const isLoggedIn = getCookie('isLoggedIn');
  const userEmail = getCookie('userEmail');
  return isLoggedIn === 'true' && userEmail !== null;
};

export const getUserInfo = () => {
  if (!isAuthenticated()) return null;
  
  return {
    email: getCookie('userEmail'),
    name: getCookie('userName'),
    role: getCookie('userRole') || 'User',
    isLoggedIn: true
  };
};

export const setUserSession = (userData, rememberMe = false) => {
  const cookieExpiry = rememberMe ? 30 : 7; // 30 days if remember me, else 7 days
  
  setCookie('userEmail', userData.email, cookieExpiry);
  setCookie('isLoggedIn', 'true', cookieExpiry);
  setCookie('userName', userData.name, cookieExpiry);
  setCookie('userRole', userData.role || 'User', cookieExpiry);
  
  if (rememberMe) {
    setCookie('rememberMe', 'true', cookieExpiry);
  }
};

export const clearUserSession = () => {
  deleteAllCookies();
  
  // Clear sessionStorage as well
  if (typeof Storage !== 'undefined') {
    sessionStorage.clear();
  }
  
  // Clear localStorage items related to user session (if any)
  if (typeof Storage !== 'undefined') {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('user') || key.startsWith('auth') || key.startsWith('session'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
};