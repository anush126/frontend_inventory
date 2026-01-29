import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://backend-inventory-sfi9.onrender.com/api"
    : "http://localhost:5000/api";

export default axios.create({
  baseURL
});
