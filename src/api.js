import axios from "axios";

// Backend: set REACT_APP_API_URL in Vercel to your Render URL (e.g. https://backend-inventory-sfi9.onrender.com)
const backendUrl =
  process.env.NODE_ENV === "production"
    ? (process.env.REACT_APP_API_URL || "https://backend-inventory-sfi9.onrender.com").replace(/\/$/, "")
    : "http://localhost:5000";

export default axios.create({
  baseURL: `${backendUrl}/api`
});
