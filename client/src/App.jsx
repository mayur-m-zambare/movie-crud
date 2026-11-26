import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Film,
  LayoutDashboard,
  Clapperboard,
  Plus,
  Search,
  Bell,
  Sparkles,
  SlidersHorizontal,
  Star,
  Trophy,
  Layers3,
  RefreshCw,
  Popcorn,
  Menu,
} from "lucide-react";
import { movieApi, getErrorMessage } from "./services/api";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("newest");
  const [modalMovie, setModalMovie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("dashboard");

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await movieApi.list({
        q: query,
        genre,
        rating,
        sort,
        favorite: activeView === "favorites" ? "true" : "",
      });
      setMovies(response.data.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [query, genre, rating, sort, activeView]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const stats = useMemo(() => {
    const total = movies.length;
    const average = total
      ? (movies.reduce((sum, m) => sum + m.rating, 0) / total).toFixed(1)
      : "0.0";
    const top = movies.filter((m) => m.rating === 5).length;
    const counts = movies.reduce((acc, m) => {
      acc[m.genre] = (acc[m.genre] || 0) + 1;
      return acc;
    }, {});
    const favorite =
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
    return { total, average, top, favorite };
  }, [movies]);

  async function saveMovie(payload) {
    setSaving(true);
    try {
      if (modalMovie) await movieApi.update(modalMovie._id, payload);
      else await movieApi.create(payload);
      setModalOpen(false);
      setModalMovie(null);
      setToast(
        modalMovie
          ? "Movie updated successfully."
          : "Movie added to your collection.",
      );
      await loadMovies();
    } catch (err) {
      setToast(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function deleteMovie(movie) {
    if (!window.confirm(`Delete "${movie.title}" from your collection?`))
      return;
    try {
      await movieApi.remove(movie._id);
      setToast("Movie deleted successfully.");
      await loadMovies();
    } catch (err) {
      setToast(getErrorMessage(err));
    }
  }

  async function toggleFavorite(movie) {
    try {
      await movieApi.toggleFavorite(movie._id);
      setToast(
        movie.favorite ? "Removed from My Movies." : "Added to My Movies.",
      );
      await loadMovies();
    } catch (err) {
      setToast(getErrorMessage(err));
    }
  }

  function showDashboard() {
    setActiveView("dashboard");
    setQuery("");
    setGenre("");
    setRating("");
  }

  function showFavorites() {
    setActiveView("favorites");
    setQuery("");
    setGenre("");
    setRating("");
  }

  function openAdd() {
    setModalMovie(null);
    setModalOpen(true);
  }
  function openEdit(movie) {
    setModalMovie(movie);
    setModalOpen(true);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Film size={23} />
          </div>
          <div>
            <strong>
              movie-crud<span> AI</span>
            </strong>
            <small>MOVIE TRACKER</small>
          </div>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <button
          className={`nav-item ${activeView === "dashboard" ? "active" : ""}`}
          onClick={showDashboard}
        >
          <LayoutDashboard size={17} />
          Dashboard
        </button>
        <button
          className={`nav-item ${activeView === "favorites" ? "active" : ""}`}
          onClick={showFavorites}
        >
          <Clapperboard size={17} />
          My Movies
        </button>
        <button className="nav-item" onClick={openAdd}>
          <Plus size={17} />
          Add Movie
        </button>
        <div className="sidebar-bottom">
          <div className="ai-card">
            <div className="ai-orb">
              <Sparkles size={19} />
            </div>
            <strong>AI assistant</strong>
            <p>Coming in Day 2. Your personal movie companion.</p>
            <span>IN DEVELOPMENT</span>
          </div>
          <div className="profile">
            <div className="avatar">M</div>
            <div>
              <strong>Movie Lover</strong>
              <small>Personal library</small>
            </div>
            <span className="online-dot" />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand">
            <Film size={20} /> movie-crud <b>AI</b>
          </div>
          <div className="breadcrumb">
            Workspace <span>/</span> <b>Dashboard</b>
          </div>
          <div className="top-actions">
            <span className="date-label">YOUR PERSONAL CINEMA</span>
            <button className="icon-btn" title="Notifications">
              <Bell size={18} />
            </button>
            <div className="avatar small">M</div>
          </div>
        </header>

        <section className="welcome-row">
          <div>
            <span className="eyebrow">YOUR COLLECTION, YOUR STORY</span>
            <h1>
              Good evening, <em>Movie Lover.</em>
            </h1>
            <p>Keep your favorites close. Discover your next obsession.</p>
          </div>
          <button className="btn btn-primary add-main" onClick={openAdd}>
            <Plus size={17} /> Add movie
          </button>
        </section>

        <section className="stats-grid">
          <Stat
            icon={<Clapperboard />}
            label="TOTAL MOVIES"
            value={stats.total}
            note="In your collection"
            color="purple"
          />
          <Stat
            icon={<Star />}
            label="AVERAGE RATING"
            value={stats.average}
            note="Out of 5.0"
            color="gold"
          />
          <Stat
            icon={<Trophy />}
            label="TOP PICKS"
            value={stats.top}
            note="Rated five stars"
            color="pink"
          />
          <Stat
            icon={<Layers3 />}
            label="FAVORITE GENRE"
            value={stats.favorite}
            note="Most collected genre"
            color="blue"
            compact
          />
        </section>

        <section className="section-heading">
          <div>
            <span className="eyebrow">
              {activeView === "favorites" ? "MY FAVORITES" : "THE COLLECTION"}
            </span>
            <h2>
              {activeView === "favorites" ? "My Movies" : "Your movies"}{" "}
              <span className="count-pill">{stats.total}</span>
            </h2>
          </div>
          <button className="text-btn" onClick={loadMovies}>
            <RefreshCw size={14} /> Refresh
          </button>
        </section>

        <section className="toolbar">
          <div className="search-box">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your movie collection..."
            />
            {query && <button onClick={() => setQuery("")}>×</button>}
          </div>
          <div className="filter-wrap">
            <SlidersHorizontal size={16} />
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="">All genres</option>
              {[
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
              ].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
          <select
            className="sort-select"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">All ratings</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} stars
              </option>
            ))}
          </select>
          <select
            className="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Recently added</option>
            <option value="oldest">Oldest first</option>
            <option value="ratingHigh">Highest rated</option>
            <option value="ratingLow">Lowest rated</option>
            <option value="title">Title A–Z</option>
          </select>
        </section>

        {error ? (
          <div className="state-panel error-panel">
            <strong>Could not load your movies</strong>
            <p>{error}</p>
            <button className="btn btn-secondary" onClick={loadMovies}>
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4].map((n) => (
              <div className="skeleton" key={n} />
            ))}
          </div>
        ) : movies.length ? (
          <section className="movie-grid">
            {movies.map((movie, index) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                index={index}
                onEdit={openEdit}
                onDelete={deleteMovie}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </section>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Popcorn size={30} />
            </div>
            <h3>
              {query || genre || rating
                ? "No matching movies"
                : activeView === "favorites"
                  ? "No favorites yet"
                  : "Your movie story starts here"}
            </h3>
            <p>
              {query || genre || rating
                ? "Try changing your search or filters."
                : activeView === "favorites"
                  ? "Use the heart button on a movie to add it here."
                  : "Add your first favorite movie and build your personal cinema."}
            </p>
            <button
              className="btn btn-primary"
              onClick={
                query || genre || rating
                  ? () => {
                      setQuery("");
                      setGenre("");
                      setRating("");
                    }
                  : openAdd
              }
            >
              {query || genre || rating ? (
                "Clear filters"
              ) : (
                <>
                  <Plus size={16} /> Add your first movie
                </>
              )}
            </button>
          </div>
        )}

        <footer className="footer">
          <span>© 2026 movie-crud AI</span>
          <span>
            <i /> DAY 1 BUILD · AI FEATURES ARRIVE TOMORROW
          </span>
        </footer>
      </main>
      {modalOpen && (
        <MovieModal
          movie={modalMovie}
          onClose={() => setModalOpen(false)}
          onSave={saveMovie}
          saving={saving}
        />
      )}
      {toast && (
        <div className="toast">
          <span>✓</span>
          {toast}
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value, note, color, compact }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div className="stat-copy">
        <span>{label}</span>
        <strong className={compact ? "compact-value" : ""}>{value}</strong>
        <small>{note}</small>
      </div>
    </article>
  );
}
