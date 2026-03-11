import { useRef } from "react";
import { Link } from "react-router-dom";

export default function StoryCarousel({ title, description, stories }) {
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  if (stories.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-l3-paper uppercase tracking-wide">
          {title}
        </h2>
        {description && (
          <p className="text-sm md:text-base text-l3-muted mt-1 italic">
            {description}
          </p>
        )}
      </div>

      <div className="relative group">
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-hide"
        >
          {stories.map((story) => {
            const coverUrl = story.cover_image
              ? `http://localhost:8000/storage/${story.cover_image}`
              : null;

            return (
              <Link
                key={story.id}
                to={`/story/${story.id}`}
                className="snap-start flex-shrink-0 w-36 md:w-40 min-w-[144px] md:min-w-[160px] max-w-[144px] md:max-w-[160px] bg-l3-card rounded-2xl p-4 shadow-md hover:shadow-lg border border-l3-border hover:-translate-y-0.5 transition transform overflow-hidden"
              >
                <div className="w-full max-w-[140px] md:max-w-[160px] aspect-[2/3] rounded-xl mb-3 overflow-hidden bg-gradient-to-br from-l3-gold/40 to-l3-brown/30 flex items-center justify-center mx-auto">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="inline-flex px-2 py-1 rounded-full text-[11px] font-medium bg-l3-chip text-l3-muted truncate max-w-full">
                      #{story.id} · Historia
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-sm md:text-base text-l3-paper mb-2 line-clamp-2 break-words overflow-hidden min-h-[2.5rem] md:min-h-[3rem]">
                  {story.title}
                </h3>

                <div className="flex flex-wrap gap-1 mb-3 h-14 overflow-hidden">
                  {story.genres?.slice(0, 3).map((genre) => (
                    <span
                      key={genre.id}
                      className="px-2 py-0.5 text-[10px] font-medium border border-l3-border rounded-md bg-white/50 text-l3-muted whitespace-nowrap"
                    >
                      {genre.name}
                    </span>
                  ))}
                  {(!story.genres || story.genres.length === 0) && (
                    <span className="px-2 py-0.5 text-[10px] font-medium border border-l3-border rounded-md bg-white/50 text-l3-muted italic">
                      Sin género
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center text-[11px] md:text-xs text-l3-muted">
                  <span className="truncate">{story.author?.name || "Autor desconocido"}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Botones de navegación elegantes estilo biblioteca */}
        <div className="flex justify-center items-center gap-10 mt-12 pb-4">
          <button
            type="button"
            onClick={() => scrollCarousel(-1)}
            className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-l3-border bg-l3-card shadow-lg hover:bg-l3-gold hover:border-l3-gold hover:scale-110 transition-all duration-300 flex items-center justify-center group active:scale-90"
            aria-label="Anterior"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b2f2a"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:stroke-white group-hover:-translate-x-1 transition-all duration-300"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="h-px w-24 bg-gradient-to-r from-transparent via-l3-border to-transparent opacity-60 hidden md:block"></div>

          <button
            type="button"
            onClick={() => scrollCarousel(1)}
            className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-l3-border bg-l3-card shadow-lg hover:bg-l3-gold hover:border-l3-gold hover:scale-110 transition-all duration-300 flex items-center justify-center group active:scale-90"
            aria-label="Siguiente"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b2f2a"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:stroke-white group-hover:translate-x-1 transition-all duration-300"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
