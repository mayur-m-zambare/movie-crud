import { Router } from "express";
import {
  createMovie,
  deleteMovie,
  getMovie,
  getMovies,
  toggleFavorite,
  updateMovie,
} from "../controllers/movieController.js";
import { uploadPoster } from "../middleware/uploadPoster.js";

const router = Router();
router.route("/").get(getMovies).post(uploadPoster, createMovie);
router
  .route("/:id")
  .get(getMovie)
  .put(uploadPoster, updateMovie)
  .patch(toggleFavorite)
  .delete(deleteMovie);
export default router;
