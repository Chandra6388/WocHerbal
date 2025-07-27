// export const API_URL = "http://localhost:5000/api";
// export const API_URL = "http://82.29.166.155:5000/api";
// export const API_URL = "https://wocherbal.com/backend/api";

// export const API_URL = `${window.location.origin}/backend/api`;

export const API_URL = window.location.origin.includes("localhost")
  ? "http://localhost:5000/api"
  : `${window.location.origin}/backend/api`;


