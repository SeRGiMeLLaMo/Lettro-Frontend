import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TextEditor from "../components/Tiptap";
import { useEditorState } from "@tiptap/react";
import Toolbar from "../components/Toolbar";
import { useAuth } from "../hooks/useAuth.js";

export default function EditChapter() {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  const [form, setForm] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [errors, setErrors] = useState(null);
  const [editor, setEditor] = useState(null);

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

  useEffect(() => {
    if (!token || !user) {
      alert("Debes iniciar sesión para editar capítulos.");
      navigate("/login");
      return;
    }

    const fetchChapter = async () => {
      try {
        const res = await axios.get(`${API_BASE}/chapters/${chapterId}`, {
          headers: { Accept: "application/json" },
        });
        setForm({
          title: res.data.title || "",
          content: res.data.content || "",
        });
      } catch (err) {
        console.error(err);
        alert("No se pudo cargar el capítulo.");
        navigate(`/story/${storyId}`);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchChapter();
  }, [chapterId, storyId, token, user, navigate, API_BASE]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    const headers = { Accept: "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      await axios.put(
        `${API_BASE}/chapters/${chapterId}`,
        {
          title: form.title,
          content: form.content,
        },
        {
          headers,
          withCredentials: true,
        }
      );
      navigate(`/story/${storyId}`);
    } catch (error) {
      setErrors(error.response?.data?.errors);
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center">
        <p className="text-gray-500 animate-pulse">Cargando capítulo...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editar capítulo</h1>
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Cancelar
        </button>
      </div>

      {errors && (
        <div className="bg-red-500/20 border border-red-500 p-3 rounded mb-4">
          {Object.values(errors)
            .flat()
            .map((err, i) => (
              <p key={i} className="text-red-500 text-sm">
                {err}
              </p>
            ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TÍTULO */}
        <div className="w-[80vw] max-w-[1000px] mx-auto text-center">
          <label className="block mb-2 font-medium">Título</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded-lg p-3 text-center"
            required
          />
        </div>

        {/* EDITOR */}
        <div className="w-[80vw] max-w-[1000px] mx-auto">
          {editor && (
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
          )}
          <TextEditor
            value={form.content}
            onChange={(content) => setForm({ ...form, content })}
            onReady={(ed) => setEditor(ed)}
            placeholder="Modifica tu capítulo..."
          />
        </div>

        <div className="w-[80vw] max-w-[1000px] mx-auto flex justify-center gap-4">
          <button
            type="submit"
            className="btnGuardar"
            style={{ 
              padding: '10px 24px', 
              fontSize: '16px',
              marginTop: '20px'
            }}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
