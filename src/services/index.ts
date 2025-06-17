import { getAccessToken } from '@privy-io/react-auth';
import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL as string;

export const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use(async config => {
  // const token = localStorage.getItem("privy:token");
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});
