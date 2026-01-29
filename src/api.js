import axios from "axios";

// Use Render backend in production, localhost in development
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://backend-inventory-sfi9.onrender.com/api"
    : "http://localhost:5000/api";

export default axios.create({
  baseURL
});
