import { useState } from "react";
import axios from "axios";
import TextEditor from "../components/Tiptap";

export default function CreateChapter({ storyId }) {

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrors(null);

    try {
      await axios.post("http://localhost:8000/api/chapters", {
        ...form,
        story_id: storyId
      });

    } catch (error) {
      setErrors(error.response?.data?.errors);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Crear capítulo
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* TITLE */}
        <div>
          <label className="block mb-2 font-medium">
            Título
          </label>

          <input
            type="text"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* EDITOR */}
        <TextEditor
          value={form.content}
          onChange={(content) =>
            setForm({ ...form, content })
          }
        />

        <button
          className="bg-black text-white px-6 py-3 rounded-lg"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Crear capítulo"}
        </button>

      </form>

    </div>
  );
}