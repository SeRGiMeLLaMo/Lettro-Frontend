import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TextEditor from "../../components/Tiptap";
import { useEditorState } from "@tiptap/react";
import Toolbar from "../../components/Toolbar";
import { useAuth } from "../../hooks/useAuth.js";
import { toast } from "react-hot-toast";

export default function CreateChapter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  const [form, setForm] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (!token || !user) {
      toast.error("Debes iniciar sesión para crear capítulos.");
      navigate("/login");
    }
  }, [token, user, navigate]);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      const ed = ctx?.editor;
      if (!ed) {
        return {
          isBold: false,
          isItalic: false,
          isUnderline: false,
          isHeading1: false,
          isHeading2: false,
          isHeading3: false,
          isParagraph: true,
          isOrderedList: false,
          isBulletList: false,
        };
      }
      return {
        isBold: ed.isActive('bold'),
        isItalic: ed.isActive('italic'),
        isUnderline: ed.isActive('underline'),
        isHeading1: ed.isActive('heading', { level: 1 }),
        isHeading2: ed.isActive('heading', { level: 2 }),
        isHeading3: ed.isActive('heading', { level: 3 }),
        isParagraph: ed.isActive('paragraph'),
        isOrderedList: ed.isActive('orderedList'),
        isBulletList: ed.isActive('bulletList'),
      };
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      toast.error("No se encontró el ID de la historia.");
      return;
    }
    setLoading(true);
    setErrors(null);

    const headers = { Accept: "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      await axios.post(
        `${API_BASE}/chapters`,
        {
          title: form.title,
          content: form.content,
          story_id: id,
        },
        {
          headers,
          withCredentials: true,
        }
      );

      toast.success("Capítulo creado correctamente 🎉");
      navigate(`/story/${id}`);
    } catch (error) {
      setErrors(error.response?.data?.errors);
    }

    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "0.75rem 0.5rem",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "2px solid #e0d1c3",
    outline: "none",
    color: "#3b2f2a",
    fontSize: "1.25rem",
    textAlign: "center",
    transition: "all 0.2s ease",
    fontWeight: "600"
  };

  return (
    <div style={{ 
      backgroundColor: "#f5ebe0", 
      minHeight: "calc(100vh - 80px)", 
      padding: "2rem 1rem",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#3b2f2a", margin: 0 }}>
            Escribir nuevo capítulo
          </h1>
          <p style={{ color: "#7b6f67", marginTop: "0.5rem" }}>Continúa expandiendo tu universo</p>
        </div>

        {errors && (
          <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "1rem", color: "#991b1b" }}>
            {Object.entries(errors).map(([key, messages], i) => (
              <div key={i} style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                <strong>{key}:</strong> {Array.isArray(messages) ? messages.join(", ") : messages}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Tarjeta del Título */}
          <div style={{ 
            backgroundColor: "#fff7ec", 
            padding: "2rem", 
            borderRadius: "1.5rem", 
            border: "1px solid #e0d1c3", 
            boxShadow: "0 10px 30px rgba(139, 90, 43, 0.05)",
            boxSizing: "border-box"
          }}>
            <label style={{ display: "block", textAlign: "center", color: "#7b6f67", fontSize: "0.875rem", fontWeight: "600", marginBottom: "1rem" }}>
              TÍTULO DEL CAPÍTULO
            </label>
            <input
              type="text"
              placeholder="Ej: El inicio de la aventura..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderBottomColor = "#d9a05b"}
              onBlur={(e) => e.target.style.borderBottomColor = "#e0d1c3"}
              required
            />
          </div>

          {/* Editor Area */}
          <div style={{ 
            backgroundColor: "#fff7ec", 
            borderRadius: "1.5rem", 
            border: "1px solid #e0d1c3", 
            overflow: "hidden",
            boxShadow: "0 15px 35px rgba(139, 90, 43, 0.05)",
            boxSizing: "border-box"
          }}>
            {editor && (
              <div style={{ borderBottom: "1px solid #e0d1c3", backgroundColor: "rgba(217,160,91,0.03)" }}>
                <Toolbar
                  showSave={false}
                  functions={{
                    toggleBold: () => editor && !editor.isDestroyed && editor.chain().focus().toggleBold().run(),
                    toggleItalic: () => editor && !editor.isDestroyed && editor.chain().focus().toggleItalic().run(),
                    toggleUnderline: () => editor && !editor.isDestroyed && editor.chain().focus().toggleUnderline().run(),
                    toggleH1: () => editor && !editor.isDestroyed && editor.chain().focus().toggleHeading({ level: 1 }).run(),
                    toggleH2: () => editor && !editor.isDestroyed && editor.chain().focus().toggleHeading({ level: 2 }).run(),
                    toggleH3: () => editor && !editor.isDestroyed && editor.chain().focus().toggleHeading({ level: 3 }).run(),
                    toggleParagraph: () => editor && !editor.isDestroyed && editor.chain().focus().setParagraph().run(),
                    toggleOrderedList: () => editor && !editor.isDestroyed && editor.chain().focus().toggleOrderedList().run(),
                    toggleBulletList: () => editor && !editor.isDestroyed && editor.chain().focus().toggleBulletList().run(),
                  }}
                  editorState={editorState}
                />
              </div>
            )}
            
            <div style={{ padding: "2rem" }}>
              <style>{`
                .ProseMirror { outline: none !important; min-height: 400px; color: #3b2f2a; }
                .ProseMirror p.is-editor-empty:first-child::before {
                  content: attr(data-placeholder);
                  float: left;
                  color: #adb5bd;
                  pointer-events: none;
                  height: 0;
                }
              `}</style>
              <TextEditor
                value={form.content}
                onChange={(content) => setForm({ ...form, content })}
                onReady={(ed) => setEditor(ed)}
                placeholder="Aquí comienza tu historia..."
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
             <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                padding: "0.875rem 2.5rem",
                borderRadius: "1rem",
                border: "1px solid #7b6f67",
                backgroundColor: "transparent",
                color: "#7b6f67",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(123,111,103,0.1)"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.875rem 3rem",
                borderRadius: "1rem",
                border: "none",
                backgroundColor: "#d9a05b",
                color: "#fff7ec",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 10px 20px rgba(217, 160, 91, 0.2)"
              }}
              onMouseOver={(e) => { if(!loading) e.currentTarget.style.backgroundColor = "#c68c4a" }}
              onMouseOut={(e) => { if(!loading) e.currentTarget.style.backgroundColor = "#d9a05b" }}
              onMouseDown={(e) => { if(!loading) e.currentTarget.style.transform = "scale(0.97)" }}
              onMouseUp={(e) => { if(!loading) e.currentTarget.style.transform = "scale(1)" }}
            >
              {loading ? "Guardando..." : "Publicar capítulo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
