import { data } from "react-router-dom";
import { apiClient } from "./client";

export const register = (data) => {
    return apiClient.post('/auth/register', data)
}

export const login = (data) => {
    return apiClient.post('/auth/login', data)
}

export const getMe = () => apiClient.get("/auth/me");

export const checkId = (id) => apiClient.get("/auth/id-check", {params: { id }});

export const logout = () => apiClient.post("/auth/logout");
