// src/utils/auth.js (update or remove these functions)
import store from "@/store/store";

export const isAuthenticated = () => {
  const token = store.getState()?.auth?.token;
  return !!token;
};

export const getUserRole = () => {
  const role = store.getState()?.auth?.role;
  return role;
};
