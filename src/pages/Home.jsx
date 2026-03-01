import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/stories", {
          headers: {
            Accept: "application/json",
          },
        });
        setStories(response.data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las historias.");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const scrollCarousel = (direction) => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-l3-paper">
            Historias recientes
          </h1>
          <p className="text-sm md:text-base text-l3-muted mt-1">
            Descubre los últimos libros publicados por la comunidad.
          </p>
        </div>

        {!loading && !error && stories.length > 0 && (
          <div className="hidden md:flex gap-2">
            <button
              type="button"
              onClick={() => scrollCarousel(-1)}
              className="w-8 h-8 rounded-full border border-l3-border bg-white/70 text-l3-muted hover:text-l3-paper hover:bg-white shadow-sm flex items-center justify-center"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel(1)}
              className="w-8 h-8 rounded-full border border-l3-border bg-white/70 text-l3-muted hover:text-l3-paper hover:bg-white shadow-sm flex items-center justify-center"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {loading && (
        <p className="text-gray-400 mb-4">Cargando historias...</p>
      )}

      {!loading && error && (
        <p className="text-red-400 mb-4">{error}</p>
      )}

      {!loading && !error && stories.length === 0 && (
        <p className="text-gray-400 mb-4">
          Todavía no hay historias creadas.
        </p>
      )}

      {!loading && !error && stories.length > 0 && (
        <div className="relative">
          {/* Botones flotantes en móvil */}
          <div className="flex justify-end gap-2 mb-2 md:hidden">
            <button
              type="button"
              onClick={() => scrollCarousel(-1)}
              className="w-8 h-8 rounded-full border border-l3-border bg-white/80 text-l3-muted flex items-center justify-center"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel(1)}
              className="w-8 h-8 rounded-full border border-l3-border bg-white/80 text-l3-muted flex items-center justify-center"
            >
              ›
            </button>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory"
          >
            {stories.map((story) => {
              const coverUrl = story.cover_image
                ? `http://localhost:8000/storage/${story.cover_image}`
                : null;

              return (
                <Link
                  key={story.id}
                  to={`/story/${story.id}`}
                  className="snap-start flex-shrink-0 w-40 md:w-48 bg-l3-card rounded-2xl p-4 shadow-md hover:shadow-lg border border-l3-border hover:-translate-y-0.5 transition transform"
                >
                  <div className="w-full aspect-[2/3] rounded-xl mb-3 overflow-hidden bg-gradient-to-br from-l3-gold/40 to-l3-brown/30 flex items-center justify-center">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="inline-flex px-2 py-1 rounded-full text-[11px] font-medium bg-l3-chip text-l3-muted">
                        #{story.id} · Historia
                      </span>
                    )}
                  </div>

                  <h2 className="font-semibold text-sm md:text-base text-l3-paper mb-1 line-clamp-2">
                    {story.title}
                  </h2>

                  <p className="text-[11px] md:text-xs text-l3-muted mb-3 line-clamp-3">
                    {story.description
                      ? `${story.description.slice(0, 140)}${
                          story.description.length > 140 ? "..." : ""
                        }`
                      : "Sin descripción por el momento."}
                  </p>

                  <div className="flex justify-between items-center text-[11px] md:text-xs text-l3-muted">
                    <span>{story.author?.name || "Autor desconocido"}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}