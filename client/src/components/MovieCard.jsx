import { Film, Pencil, Trash2, Star, Heart } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const palettes = [
  "poster-violet",
  "poster-blue",
  "poster-rose",
  "poster-amber",
  "poster-teal",
  "poster-indigo",
];
export default function MovieCard({
  movie,
  index,
  onEdit,
  onDelete,
  onToggleFavorite,
}) {
  const initials = movie.title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <article className="movie-card">
      <div className={`poster ${palettes[index % palettes.length]}`}>
        {movie.poster && (
          <img
            className="poster-image"
            src={`${API_URL}${movie.poster}`}
            alt={`${movie.title} poster`}
          />
        )}
        <div className="poster-glow" />
        <Film size={27} className="poster-icon" />
        <span className="poster-initials">{initials}</span>
        {movie.rating === 5 && <span className="top-pick">★ TOP PICK</span>}
        <span className="poster-title">{movie.title}</span>
      </div>
      <div className="movie-info">
        <div className="movie-title-row">
          <h3 title={movie.title}>{movie.title}</h3>
          <span className="rating">
            <Star size={13} fill="currentColor" />
            {movie.rating.toFixed(1)}
          </span>
        </div>
        <p>{movie.genre}</p>
        <div className="movie-actions">
          <span className="movie-status">
            {movie.rating === 5 ? "Your top pick" : "In your collection"}
          </span>
          <div>
            <button
              className={movie.favorite ? "favorite-active" : ""}
              onClick={() => onToggleFavorite(movie)}
              aria-label={
                movie.favorite ? "Remove from My Movies" : "Add to My Movies"
              }
            >
              <Heart
                size={15}
                fill={movie.favorite ? "currentColor" : "none"}
              />
            </button>
            <button onClick={() => onEdit(movie)} aria-label="Edit movie">
              <Pencil size={15} />
            </button>
            <button onClick={() => onDelete(movie)} aria-label="Delete movie">
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
