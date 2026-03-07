import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function ChapterView() {
  const { id } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        console.log("Intentando cargar capítulo con ID:", id);
        const res = await axios.get(`${API_BASE}/chapters/${id}`, {
          headers: { Accept: "application/json" },
        });
        
        if (!res.data) {
          throw new Error("El servidor devolvió un capítulo vacío.");
        }
        
        console.log("Respuesta del capítulo:", res.data);
        setChapter(res.data);
      } catch (err) {
        console.error("Error al cargar el capítulo:", err);
        const msg = err.response?.data?.message || err.message || "No se pudo cargar el capítulo.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchChapter();
    } else {
      setError("ID de capítulo no proporcionado.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <p className="text-gray-500 animate-pulse">Cargando capítulo...</p>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-4">
        <p className="text-red-500 font-medium">Error: {error || "Capítulo no disponible."}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-l3-paper text-white rounded-lg hover:opacity-90"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-l3-paper mb-8">{chapter.title}</h1>
      
      <div
        className="text-l3-paper rounded-3xl border-2 border-l3-border/40 shadow-xl overflow-hidden"
        style={{ 
          backgroundColor: "#ffffff", 
          borderRadius: "1.5rem", 
          padding: "3.5rem", 
          width: "100%",
          maxWidth: "85ch",
          lineHeight: "1.8",
          fontSize: "1.125rem"
        }}
        dangerouslySetInnerHTML={{ __html: chapter.content || "" }}
      />
    </div>
  );
}
