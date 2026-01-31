import axios from "axios";

export default axios.create({
  baseURL: "https://backend-inventory-s63r.onrender.com/api",
  secure: true,
});
