import axios from "axios";
import { BASE_URL } from "./constants.js";
console.log({ BASE_URL });

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true,
});

export const googleAuth = (code) => api.get(`/auth/google?code=${code}`);
