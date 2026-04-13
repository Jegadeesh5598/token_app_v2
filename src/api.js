import axios from "axios";

const API = axios.create({
  baseURL: " https://token-api-njd6.onrender.com"
});

export const getEntries = () => API.get("/entries");
export const addEntry = (data) => API.post("/add-entry", data);
export const updateEntry = (id, data) => API.put(`/update-entry/${id}`, data);
export const deleteEntry = (id) => API.delete(`/delete-entry/${id}`);

// Admin users should be provided by your backend admin user table.
// Expected API response format: ["Jegadeesh", "Divya"] or [{ name: "Jegadeesh" }, { name: "Divya" }]
export const getAdminUsers = () => API.get("/admin-users");