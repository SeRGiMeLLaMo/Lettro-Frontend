import { useRef } from "react";
import { Link } from "react-router-dom";

export default function StoryCarousel({ title, description, stories }) {
  const carouselRef = useRef(null);
  const STORAGE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace("/api", "/storage");

  const scrollCarousel = (direction) => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  if (!stories || stories.length === 0) return null;

  return (
    <div className="mb-8 md:mb-12">
      <div className="px-4 mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-extrabold text-l3-paper m-0 uppercase tracking-wide">
          {title}
        </h2>
        {description && (
          <p className="text-sm md:text-base text-l3-brown m-0 mt-1 italic font-medium">
            {description}
          </p>
        )}
      </div>

      <div className="relative">
        <div
          ref={carouselRef}
          className="flex gap-4 md:gap-6 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide"
        >
          {stories.map((story) => {
            const coverUrl = story.cover_image
              ? story.cover_image.startsWith("http")
                ? story.cover_image
                : `${STORAGE_URL}/${story.cover_image}`
              : null;

            return (
              <Link
                key={story.id}
                to={`/story/${story.id}`}
                className="snap-start shrink-0 w-[140px] md:w-[170px] flex flex-col no-underline bg-l3-card p-3 md:p-4 rounded-2xl border border-l3-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_20px_rgba(139,90,43,0.1)] cursor-pointer group"
              >
                <div className="w-full aspect-[2/3] rounded-xl overflow-hidden bg-l3-bg border border-l3-border mb-3 flex items-center justify-center relative">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-[10px] md:text-xs text-l3-muted text-center p-2 font-medium">
                      #{story.id}<br/>Historia
                    </span>
                  )}
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                </div>

                <h3 className="m-0 mb-2 text-sm md:text-base text-l3-paper font-bold line-clamp-2 leading-tight h-[2.4em] md:h-[2.8em]">
                  {story.title}
                </h3>

                <div className="flex flex-wrap gap-1 mb-2 h-7 overflow-hidden">
                  {story.genres?.slice(0, 2).map((genre) => (
                    <span
                      key={genre.id}
                      className="px-2 py-0.5 text-[0.6rem] md:text-xs border border-l3-border rounded-full bg-l3-gold/10 text-l3-brown font-bold whitespace-nowrap"
                    >
                      {genre.name}
                    </span>
                  ))}
                  {(!story.genres || story.genres.length === 0) && (
                    <span className="px-2 py-0.5 text-[0.6rem] md:text-xs border border-l3-border rounded-full text-l3-muted italic whitespace-nowrap">
                      General
                    </span>
                  )}
                </div>

                <div className="mt-auto text-[0.7rem] md:text-xs text-l3-muted whitespace-nowrap overflow-hidden flex justify-between items-center">
                  <span className="font-semibold truncate">{story.author?.name || story.author?.username || "Autor anónimo"}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CONTROLES DEL CARRUSEL (Ocultos en móvil porque se usa el scroll táctil) */}
        {stories.length > 5 && (
          <div className="hidden md:flex justify-center items-center gap-6 mt-6 pb-4">
            <button
              type="button"
              onClick={() => scrollCarousel(-1)}
              className="w-12 h-12 rounded-full border-2 border-l3-border bg-l3-card shadow-sm flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-l3-gold hover:border-l3-gold group"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-l3-brown group-hover:text-l3-card transition-colors">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="h-px w-20 bg-l3-border"></div>

            <button
              type="button"
              onClick={() => scrollCarousel(1)}
              className="w-12 h-12 rounded-full border-2 border-l3-border bg-l3-card shadow-sm flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-l3-gold hover:border-l3-gold group"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-l3-brown group-hover:text-l3-card transition-colors">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
