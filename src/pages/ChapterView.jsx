import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ChapterView() {
  const { id } = useParams();
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await axios.get(`${API_BASE}/chapters/${id}`, {
          headers: { Accept: "application/json" },
        });
        setChapter(res.data);
      } catch {
        setError("No se pudo cargar el capítulo.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchChapter();
  }, [id, API_BASE]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-500">Cargando capítulo...</p>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-500">{error || "Capítulo no disponible."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <h1 className="text-2xl font-bold text-center">{chapter.title}</h1>
      <div
        className="text-l3-paper rounded-3xl border-2 border-l3-border/60 max-w-[95ch] mx-auto shadow-md overflow-hidden"
        style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", padding: "3rem", marginTop: "5rem" }}
        dangerouslySetInnerHTML={{ __html: chapter.content || "" }}
      />
    </div>
  );
}
