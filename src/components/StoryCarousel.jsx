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
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ padding: "0 1rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#3b2f2a", margin: "0 0 0.25rem 0", textTransform: "uppercase", letterSpacing: "1px" }}>
          {title}
        </h2>
        {description && (
          <p style={{ fontSize: "0.95rem", color: "#8b5a2b", margin: 0, fontStyle: "italic", fontWeight: "500" }}>
            {description}
          </p>
        )}
      </div>

      <div style={{ position: "relative" }}>
        <div
          ref={carouselRef}
          style={{
            display: "flex",
            gap: "1.5rem",
            overflowX: "auto",
            padding: "1rem",
            scrollBehavior: "smooth",
            scrollSnapType: "x mandatory",
            // Hide scrollbar styles basic support
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
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
                style={{
                  scrollSnapAlign: "start",
                  flexShrink: 0,
                  width: "160px",
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  backgroundColor: "#fff7ec",
                  padding: "1rem",
                  borderRadius: "1rem",
                  border: "1px solid #e0d1c3",
                  boxShadow: "0 4px 6px rgba(139, 90, 43, 0.05)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 20px rgba(139, 90, 43, 0.1)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 6px rgba(139, 90, 43, 0.05)"; }}
              >
                <div style={{
                  width: "100%",
                  aspectRatio: "2/3",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  backgroundColor: "#f5ebe0",
                  border: "1px solid #e0d1c3",
                  marginBottom: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={story.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontSize: "11px", color: "#a89f91", textAlign: "center", padding: "0.5rem" }}>
                      #{story.id}<br/>Historia
                    </span>
                  )}
                </div>

                <h3 style={{ 
                  margin: "0 0 0.5rem 0", 
                  fontSize: "1rem", 
                  color: "#3b2f2a", 
                  fontWeight: "700",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: "1.2",
                  height: "2.4rem"
                }}>
                  {story.title}
                </h3>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginBottom: "0.5rem", height: "2rem", overflow: "hidden" }}>
                  {story.genres?.slice(0, 2).map((genre) => (
                    <span
                      key={genre.id}
                      style={{
                        padding: "0.15rem 0.4rem",
                        fontSize: "0.65rem",
                        border: "1px solid #e0d1c3",
                        borderRadius: "1rem",
                        backgroundColor: "rgba(217,160,91,0.05)",
                        color: "#8b5a2b",
                        fontWeight: "600",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {genre.name}
                    </span>
                  ))}
                  {(!story.genres || story.genres.length === 0) && (
                    <span style={{ padding: "0.15rem 0.4rem", fontSize: "0.65rem", border: "1px solid #e0d1c3", borderRadius: "1rem", color: "#a89f91", fontStyle: "italic" }}>
                      General
                    </span>
                  )}
                </div>

                <div style={{ marginTop: "auto", fontSize: "0.75rem", color: "#7b6f67", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis" }}>{story.author?.name || story.author?.username || "Autor anónimo"}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CONTROLES DEL CARRUSEL (Estilo flechas flotantes / botones de biblioteca) */}
        {stories.length > 5 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1.5rem", marginTop: "1.5rem", paddingBottom: "1rem" }}>
            <button
              type="button"
              onClick={() => scrollCarousel(-1)}
              style={{
                width: "48px", height: "48px",
                borderRadius: "50%",
                border: "2px solid #e0d1c3",
                backgroundColor: "#fff7ec",
                boxShadow: "0 4px 6px rgba(139, 90, 43, 0.05)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#d9a05b"; e.currentTarget.style.borderColor = "#d9a05b"; e.currentTarget.querySelector('svg').style.stroke = "#fff7ec"; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#fff7ec"; e.currentTarget.style.borderColor = "#e0d1c3"; e.currentTarget.querySelector('svg').style.stroke = "#8b5a2b"; }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5a2b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div style={{ height: "1px", width: "80px", backgroundColor: "#e0d1c3" }}></div>

            <button
              type="button"
              onClick={() => scrollCarousel(1)}
              style={{
                width: "48px", height: "48px",
                borderRadius: "50%",
                border: "2px solid #e0d1c3",
                backgroundColor: "#fff7ec",
                boxShadow: "0 4px 6px rgba(139, 90, 43, 0.05)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#d9a05b"; e.currentTarget.style.borderColor = "#d9a05b"; e.currentTarget.querySelector('svg').style.stroke = "#fff7ec"; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#fff7ec"; e.currentTarget.style.borderColor = "#e0d1c3"; e.currentTarget.querySelector('svg').style.stroke = "#8b5a2b"; }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5a2b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
