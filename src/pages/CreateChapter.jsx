import { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TextEditor from "../components/Tiptap";
import { useEditorState } from "@tiptap/react";
import Toolbar from "../components/Toolbar";

export default function CreateChapter() {
  const { id } = useParams();       // id de la historia
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  const [form, setForm] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
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
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      alert("No se encontró el ID de la historia.");
      return;
    }
    setLoading(true);
    setErrors(null);

    try {
      await axios.post(
        `${API_BASE}/chapters`,
        {
          title: form.title,
          content: form.content,
          story_id: id, // aquí se enlaza al {id} historia
        },
        {
          headers: { Accept: "application/json" },
        }
      );

      // opcional: volver a la página de la historia
      navigate(`/story/${id}`);
    } catch (error) {
      setErrors(error.response?.data?.errors);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Crear capítulo</h1>

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

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
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

        {/* WRAPPER: misma anchura que el editor para toolbar + editor */}
        <div className="w-[80vw] max-w-[1000px] mx-auto">
          {/* TOOLBAR */}
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
          {/* EDITOR */}
          <TextEditor
            value={form.content}
            onChange={(content) => setForm({ ...form, content })}
            onReady={(ed) => setEditor(ed)}
            placeholder="Aquí comienza tu historia..."
          />
        </div>

        <div className="w-[80vw] max-w-[1000px] mx-auto flex justify-center">
          <button
            className="bg-black text-white px-6 py-3 rounded-lg"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar capítulo"}
          </button>
        </div>
      </form>
    </div>
  );
}
