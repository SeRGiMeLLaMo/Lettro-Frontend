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
      <div className="flex justify-center items-center min-h-screen bg-l3-bg">
        <p className="text-l3-muted text-lg">Abriendo el libro...</p>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-l3-bg p-8 text-center">
        <h2 className="text-red-700 mb-4 text-2xl font-bold">¡Vaya! Página no encontrada</h2>
        <p className="text-l3-muted mb-8 text-lg">{error || "El capítulo que buscas ha desaparecido de la estantería."}</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-l3-gold text-l3-card border-none rounded-xl font-bold cursor-pointer transition-transform hover:scale-105"
        >
          Volver atrás
        </button>
      </div>
    );
  }

  return (
    <div className="bg-l3-bg min-h-screen py-8 px-4 md:py-12 md:px-8 font-sans">
      <style>{`
        .chapter-content {
          font-family: 'Georgia', 'Times New Roman', Times, serif;
          line-height: 2.1;
          font-size: 1.15rem;
          color: #2c2420;
          text-align: left;
        }
        @media (min-width: 768px) {
          .chapter-content {
            font-size: 1.35rem;
            text-align: justify;
          }
        }
        .chapter-content p {
          margin-bottom: 1.8rem;
          text-indent: 0;
        }
        @media (min-width: 768px) {
          .chapter-content p {
            text-indent: 1.5rem;
          }
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
      `}</style>

      <div className="max-w-4xl mx-auto relative">
        
        {/* Navegación entre capítulos (FIXED SIDE ARROWS) */}
        {prevId && (
          <Link 
            to={`/chapters/${prevId}`} 
            className="hidden xl:flex fixed top-1/2 -translate-y-1/2 left-4 w-[60px] h-[120px] bg-l3-card/70 border border-l3-border items-center justify-center cursor-pointer rounded-2xl text-l3-gold text-4xl no-underline transition-all duration-300 z-50 backdrop-blur-sm shadow-md hover:bg-l3-card hover:text-l3-brown"
          >
            ‹
          </Link>
        )}
        {nextId && (
          <Link 
            to={`/chapters/${nextId}`} 
            className="hidden xl:flex fixed top-1/2 -translate-y-1/2 right-4 w-[60px] h-[120px] bg-l3-card/70 border border-l3-border items-center justify-center cursor-pointer rounded-2xl text-l3-gold text-4xl no-underline transition-all duration-300 z-50 backdrop-blur-sm shadow-md hover:bg-l3-card hover:text-l3-brown"
          >
            ›
          </Link>
        )}

        {/* Navegación superior */}
        <div className="flex justify-between items-center mb-8 md:mb-10">
          <Link 
            to={`/story/${chapter.story_id}`}
            className="text-l3-gold no-underline font-bold text-sm md:text-base flex items-center gap-2 hover:underline"
          >
            ← Volver al índice
          </Link>
          <div className="text-xs md:text-sm text-l3-muted font-semibold uppercase tracking-wider max-w-[50%] truncate text-right">
            {chapter.story?.title || "LECTURA"}
          </div>
        </div>

        {/* Cabecera del capítulo */}
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-extrabold text-l3-paper leading-tight mx-auto max-w-3xl">
            {chapter.title}
          </h1>
          <div className="w-16 h-1 bg-l3-gold mx-auto mt-6"></div>
        </div>

        {/* El "Papel" del libro */}
        <div 
          className="bg-l3-card py-10 px-6 md:py-20 md:px-20 rounded-xl shadow-[0_10px_40px_rgba(139,90,43,0.08)] border border-l3-border relative min-h-[500px] md:min-h-[700px]"
        >
          <div 
            className="chapter-content"
            dangerouslySetInnerHTML={{ __html: chapter.content || "" }}
          />
        </div>

        {/* Navegación inferior (Visible también en móvil) */}
        <div className="mt-10 md:mt-12 flex justify-between gap-4 pb-12 flex-wrap">
          {prevId ? (
            <Link to={`/chapters/${prevId}`} className="text-l3-gold no-underline font-bold hover:underline">← Cap. Anterior</Link>
          ) : <div></div>}
          
          {nextId ? (
            <Link to={`/chapters/${nextId}`} className="text-l3-gold no-underline font-bold hover:underline">Siguiente Cap. →</Link>
          ) : (
            <Link to={`/story/${chapter.story_id}`} className="text-l3-paper no-underline font-bold hover:underline">Fin de la obra</Link>
          )}
        </div>
      </div>
    </div>
  );
}
