import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const movieApi = {
  list: (params = {}) => api.get("/movies", { params }),
  create: (payload) => api.post("/movies", payload),
  update: (id, payload) => api.put(`/movies/${id}`, payload),
  toggleFavorite: (id) => api.patch(`/movies/${id}`),
  remove: (id) => api.delete(`/movies/${id}`),
};
export function getErrorMessage(error) {
  return (
    error.response?.data?.message || error.message || "Something went wrong."
  );
}
