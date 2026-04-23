import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function ChapterView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lógica de navegación
  const [prevId, setPrevId] = useState(null);
  const [nextId, setNextId] = useState(null);

  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/chapters/${id}`, {
          headers: { Accept: "application/json" },
        });
        const currentChapter = res.data;
        setChapter(currentChapter);

        // Calcular navegación
        const chapters = currentChapter.story?.chapters || [];
        const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
        
        if (currentIndex !== -1) {
          setPrevId(currentIndex > 0 ? chapters[currentIndex - 1].id : null);
          setNextId(currentIndex < chapters.length - 1 ? chapters[currentIndex + 1].id : null);
        }
      } catch (err) {
        console.error("Error al cargar el capítulo:", err);
        setError(err.response?.data?.message || err.message || "No se pudo cargar el capítulo.");
      } finally {
        setLoading(false);
        window.scrollTo(0, 0); // Volver arriba al cambiar de capítulo
      }
    };
    if (id) fetchChapter();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f5ebe0" }}>
        <p style={{ color: "#7b6f67", fontSize: "1.1rem" }}>Abriendo el libro...</p>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f5ebe0", padding: "2rem", textAlign: "center" }}>
        <h2 style={{ color: "#991b1b", marginBottom: "1rem" }}>¡Vaya! Página no encontrada</h2>
        <p style={{ color: "#7b6f67", marginBottom: "2rem" }}>{error || "El capítulo que buscas ha desaparecido de la estantería."}</p>
        <button 
          onClick={() => navigate(-1)}
          style={{ padding: "0.75rem 1.5rem", backgroundColor: "#d9a05b", color: "#fff7ec", border: "none", borderRadius: "0.5rem", fontWeight: "bold", cursor: "pointer" }}
        >
          Volver atrás
        </button>
      </div>
    );
  }

  const arrowStyle = {
    position: "fixed",
    top: "50%",
    transform: "translateY(-50%)",
    width: "60px",
    height: "120px",
    backgroundColor: "rgba(255, 247, 236, 0.7)",
    border: "1px solid #e0d1c3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderRadius: "12px",
    color: "#d9a05b",
    fontSize: "2rem",
    textDecoration: "none",
    transition: "all 0.3s ease",
    zIndex: 100,
    backdropFilter: "blur(5px)",
    boxShadow: "0 10px 30px rgba(139, 90, 43, 0.05)"
  };

  return (
    <div style={{ 
      backgroundColor: "#f5ebe0", 
      minHeight: "100vh", 
      padding: "2rem 1rem",
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>
      <style>{`
        .chapter-content {
          font-family: 'Georgia', 'Times New Roman', Times, serif;
          line-height: 2.1;
          font-size: 1.35rem;
          color: #2c2420;
          text-align: justify;
        }
        .chapter-content p {
          margin-bottom: 1.8rem;
          text-indent: 1.5rem;
        }
        .chapter-content h1, .chapter-content h2, .chapter-content h3 {
          font-family: 'Segoe UI', sans-serif;
          color: #3b2f2a;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          text-align: left;
           text-indent: 0;
        }
        .chapter-content ul, .chapter-content ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
          text-indent: 0;
        }
        @media (max-width: 1100px) {
          .nav-arrow { display: none !important; }
        }
        @media (max-width: 640px) {
          .chapter-content {
            font-size: 1.15rem;
            line-height: 1.7;
            text-align: left;
          }
          .card-reader {
            padding: 2.5rem 1.5rem !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Navegación entre capítulos (FIXED) */}
        {prevId && (
          <Link 
            to={`/chapters/${prevId}`} 
            className="nav-arrow"
            style={{ ...arrowStyle, left: "2rem" }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#fff7ec"; e.currentTarget.style.color = "#8b5a2b"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 247, 236, 0.7)"; e.currentTarget.style.color = "#d9a05b"; }}
          >
            ‹
          </Link>
        )}
        {nextId && (
          <Link 
            to={`/chapters/${nextId}`} 
            className="nav-arrow"
            style={{ ...arrowStyle, right: "2rem" }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#fff7ec"; e.currentTarget.style.color = "#8b5a2b"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 247, 236, 0.7)"; e.currentTarget.style.color = "#d9a05b"; }}
          >
            ›
          </Link>
        )}

        {/* Navegación superior */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
          <Link 
            to={`/story/${chapter.story_id}`}
            style={{ 
              color: "#d9a05b", 
              textDecoration: "none", 
              fontWeight: "bold", 
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            ← Volver al índice
          </Link>
          <div style={{ fontSize: "0.85rem", color: "#7b6f67", fontWeight: "500", textTransform: "uppercase", letterSpacing: "1px" }}>
            {chapter.story?.title || "LECTURA"}
          </div>
        </div>

        {/* Cabecera del capítulo */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#3b2f2a", lineHeight: "1.2", margin: "0 auto", maxWidth: "90%" }}>
            {chapter.title}
          </h1>
          <div style={{ width: "60px", height: "3px", backgroundColor: "#d9a05b", margin: "1.5rem auto" }}></div>
        </div>

        {/* El "Papel" del libro */}
        <div 
          className="card-reader"
          style={{ 
            backgroundColor: "#fff7ec",
            padding: "5rem 6rem",
            borderRadius: "4px",
            boxShadow: "0 10px 40px rgba(139, 90, 43, 0.08)",
            border: "1px solid #e0d1c3",
            position: "relative",
            minHeight: "700px"
          }}
        >
          <div 
            className="chapter-content"
            dangerouslySetInnerHTML={{ __html: chapter.content || "" }}
          />
        </div>

        {/* Navegación inferior (Visible también en móvil) */}
        <div style={{ 
          marginTop: "3rem", 
          display: "flex", 
          justifyContent: "space-between", 
          gap: "1rem",
          paddingBottom: "4rem"
        }}>
          {prevId ? (
            <Link to={`/chapters/${prevId}`} style={{ color: "#d9a05b", textDecoration: "none", fontWeight: "bold" }}>← Cap. Anterior</Link>
          ) : <div></div>}
          
          {nextId ? (
            <Link to={`/chapters/${nextId}`} style={{ color: "#d9a05b", textDecoration: "none", fontWeight: "bold" }}>Siguiente Cap. →</Link>
          ) : (
            <Link to={`/story/${chapter.story_id}`} style={{ color: "#3b2f2a", textDecoration: "none", fontWeight: "bold" }}>Fin de la obra</Link>
          )}
        </div>
      </div>
    </div>
  );
}
