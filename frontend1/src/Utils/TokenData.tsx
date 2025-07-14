import { jwtDecode } from "jwt-decode";

// Token ko cookie se nikaalne ka helper
function getTokenFromCookies() {
// Get token from document.cookie
const token = document.cookie
  .split('; ')
  .find(row => row.startsWith('token='))
  ?.split('=')[1]; 

  return token || null; 
}

// Token decode karne ka helper
export function getUserFromToken() {
  const token = getTokenFromCookies();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {

    return null;
  }
}