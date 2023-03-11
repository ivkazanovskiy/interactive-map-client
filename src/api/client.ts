import axios from "axios";
import { config } from "../config";

const client = axios.create({
  baseURL: config.backendUrl,
  headers: { Authorization: `Bearer ${localStorage.getItem("at")}` },
});

export { client };
