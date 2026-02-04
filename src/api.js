import axios from "axios";

// Use local backend when app is at localhost (dev), otherwise Render (deployed build)
const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
const baseURL = isLocal
  ? "http://localhost:5000/api"
  : "https://backend-inventory-s63r.onrender.com/api";

export default axios.create({
  baseURL,
});
