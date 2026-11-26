import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";
import Movie from "../models/Movie.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMovies = asyncHandler(async (req, res) => {
  const {
    q = "",
    genre = "",
    rating = "",
    sort = "newest",
    favorite = "",
  } = req.query;
  const filter = {};
  if (q.trim()) filter.title = { $regex: escapeRegex(q.trim()), $options: "i" };
  if (genre.trim()) filter.genre = genre.trim();
  if (rating !== "") {
    const parsed = Number(rating);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating filter must be between 1 and 5.",
      });
    }
    filter.rating = parsed;
  }
  if (favorite === "true") filter.favorite = true;

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    ratingHigh: { rating: -1, createdAt: -1 },
    ratingLow: { rating: 1, createdAt: -1 },
    title: { title: 1 },
  };
  const movies = await Movie.find(filter)
    .sort(sortMap[sort] || sortMap.newest)
    .lean();
  res.json({ success: true, count: movies.length, data: movies });
});

export const getMovie = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid movie ID." });
  }
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res
      .status(404)
      .json({ success: false, message: "Movie not found." });
  res.json({ success: true, data: movie });
});

export const createMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.create({
    title: req.body.title,
    genre: req.body.genre,
    rating: req.body.rating,
    poster: req.file ? `/uploads/posters/${req.file.filename}` : "",
    favorite: req.body.favorite === "true" || req.body.favorite === true,
  });
  res
    .status(201)
    .json({ success: true, message: "Movie added successfully.", data: movie });
});

export const updateMovie = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid movie ID." });
  }
  const existing = await Movie.findById(req.params.id);
  if (!existing)
    return res
      .status(404)
      .json({ success: false, message: "Movie not found." });

  const updates = {
    title: req.body.title,
    genre: req.body.genre,
    rating: req.body.rating,
    favorite: req.body.favorite === "true" || req.body.favorite === true,
  };
  if (req.file) {
    updates.poster = `/uploads/posters/${req.file.filename}`;
  }
  const movie = await Movie.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (req.file && existing.poster) removePoster(existing.poster);
  res.json({
    success: true,
    message: "Movie updated successfully.",
    data: movie,
  });
});

export const deleteMovie = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid movie ID." });
  }
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie)
    return res
      .status(404)
      .json({ success: false, message: "Movie not found." });
  if (movie.poster) removePoster(movie.poster);
  res.json({
    success: true,
    message: "Movie deleted successfully.",
    data: movie,
  });
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid movie ID." });
  }
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res
      .status(404)
      .json({ success: false, message: "Movie not found." });
  movie.favorite = !movie.favorite;
  await movie.save();
  res.json({ success: true, data: movie });
});

function removePoster(posterUrl) {
  const filename = path.basename(posterUrl);
  const filePath = path.resolve("uploads/posters", filename);
  fs.unlink(filePath, () => {});
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
