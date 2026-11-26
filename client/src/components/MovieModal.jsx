import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Star } from "lucide-react";

const API_URL = import.meta.env.BACK_API_URL || "http://localhost:5000";

const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Other",
];

export default function MovieModal({ movie, onClose, onSave, saving }) {
  const [form, setForm] = useState({ title: "", genre: "Action", rating: 5 });
  const [poster, setPoster] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (movie) {
      setForm({ title: movie.title, genre: movie.genre, rating: movie.rating });
      setPreview(movie.poster ? `${API_URL}${movie.poster}` : "");
    }
  }, [movie]);

  function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.genre.trim())
      return toast.error("Title and genre are required.");
    const rating = Number(form.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5)
      return toast.error("Rating must be from 1 to 5.");

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("genre", form.genre);
    formData.append("rating", String(rating));
    formData.append("favorite", String(movie?.favorite === true));
    if (poster) formData.append("poster", poster);
    onSave(formData);
  }

  function choosePoster(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return toast.error("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024)
      return toast.error("Poster must be 5 MB or smaller.");
    setPoster(file);
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">
              {movie ? "UPDATE COLLECTION" : "EXPAND YOUR COLLECTION"}
            </span>
            <h2>{movie ? "Edit movie" : "Add a movie"}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={19} />
          </button>
        </div>
        <form onSubmit={submit}>
          <label>
            Movie title
            <input
              autoFocus
              maxLength="120"
              placeholder="e.g. Interstellar"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label>
            Genre
            <select
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
            >
              {genres.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
          <label>
            Movie poster{" "}
            <span className="muted">— JPG, PNG, or other image (max 5 MB)</span>
          </label>
          <div className="poster-upload">
            {preview ? (
              <img src={preview} alt="Poster preview" />
            ) : (
              <div className="poster-placeholder">No poster selected</div>
            )}
            <input type="file" accept="image/*" onChange={choosePoster} />
          </div>
          <label>
            Your rating <span className="muted">— 1 to 5 stars</span>
          </label>
          <div className="rating-picker">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                className={n <= form.rating ? "picked" : ""}
                onClick={() => setForm({ ...form, rating: n })}
                aria-label={`${n} stars`}
              >
                <Star
                  size={25}
                  fill={n <= form.rating ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button disabled={saving} className="btn btn-primary">
              {saving ? "Saving..." : movie ? "Save changes" : "Add movie"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
