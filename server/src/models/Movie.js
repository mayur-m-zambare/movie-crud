import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 120,
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      trim: true,
      maxlength: 50,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    poster: { type: String, default: "" },
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true },
);

movieSchema.index({ title: "text", genre: 1 });
export default mongoose.model("Movie", movieSchema);
