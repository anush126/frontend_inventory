import axios from "axios";

// Backend: https://backend-inventory-s63r.onrender.com (set REACT_APP_API_URL in Vercel to override)
const backendUrl =
  process.env.NODE_ENV === "production"
    ? (process.env.REACT_APP_API_URL || "https://backend-inventory-s63r.onrender.com").replace(/\/$/, "")
    : "http://localhost:5000";

export default axios.create({
  baseURL: `${backendUrl}/api`
});
