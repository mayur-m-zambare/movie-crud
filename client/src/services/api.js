import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const movieApi = {
  list: (params = {}) => api.get("/api/movies", { params }),
  create: (payload) => api.post("/api/movies", payload),
  update: (id, payload) => api.put(`/api/movies/${id}`, payload),
  toggleFavorite: (id) => api.patch(`/api/movies/${id}`),
  remove: (id) => api.delete(`/api/movies/${id}`),
};
export function getErrorMessage(error) {
  return (
    error.response?.data?.message || error.message || "Something went wrong."
  );
}
