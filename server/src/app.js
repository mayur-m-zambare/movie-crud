import express from "express";
import cors from "cors";
import path from "node:path";
import movieRoutes from "./routes/movieRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://movie-crud-azure.vercel.app",
  "https://movie-crud-front-end.onrender.com",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "movie-crud API is running." });
});
app.use("/api/movies", movieRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
