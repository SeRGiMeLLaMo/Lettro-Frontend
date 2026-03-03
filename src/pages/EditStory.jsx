import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const genresList = [
  { id: 1, name: "Fantasía" },
  { id: 2, name: "Ciencia ficción" },
  { id: 3, name: "Romance" },
  { id: 4, name: "Terror" },
  { id: 5, name: "Misterio" },
  { id: 6, name: "Aventura" },
  { id: 7, name: "Drama" },
  { id: 8, name: "Comedia" },
  { id: 9, name: "Histórica" },
  { id: 10, name: "Juvenil" },
];

export default function EditStory() {
  const { id } = useParams();          // id de la historia
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    cover_image: null,
    genres: [],
  });
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [errors, setErrors] = useState(null);

  // 1) Cargar datos de la historia al entrar
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/stories/${id}`, {
          headers: { Accept: "application/json" },
        });

        const story = res.data;

        setForm({
          title: story.title || "",
          description: story.description || "",
          cover_image: null, // la imagen actual ya está en el servidor; solo cambiaremos si el usuario sube otra
          genres: (story.genres || []).map((g) => g.id),
        });
      } catch (error) {
        console.error(error);
        alert("No se pudo cargar la historia.");
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchStory();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    setForm({
      ...form,
      cover_image: e.target.files[0],
    });
  };

  const toggleGenre = (genreId) => {
    if (form.genres.includes(genreId)) {
      setForm({
        ...form,
        genres: form.genres.filter((g) => g !== genreId),
      });
    } else {
      setForm({
        ...form,
        genres: [...form.genres, genreId],
      });
    }
  };

  // 2) Enviar actualización (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);

    if (form.cover_image) {
      data.append("cover_image", form.cover_image);
    }

    form.genres.forEach((gid) => {
      data.append("genre_id[]", gid);
    });

    try {
      await axios.post(
        `http://localhost:8000/api/stories/${id}?_method=PUT`, // método spoofing
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      alert("Story actualizada correctamente");
      navigate(`/profile/1`); // o a donde quieras volver
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.errors);
      } else {
        console.error(error);
      }
    }

    setLoading(false);
  };

  if (loadingInitial) {
    return <p className="text-white text-center mt-10">Cargando historia...</p>;
  }

  return (
    <div className="min-h-screen bg-l3-bg text-white flex justify-center p-8">
      <div className="bg-l3-card p-8 rounded-2xl w-full max-w-2xl border border-purple-900/30 shadow-xl">
        <h1 className="text-3xl font-bold text-l3-neon mb-6 text-center">
          Editar Story
        </h1>

        {errors && (
          <div className="bg-red-500/20 border border-red-500 p-3 rounded mb-4">
            {Object.values(errors).map((err, i) => (
              <p key={i} className="text-red-400 text-sm">
                {err}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* TÍTULO */}
          <div>
            <label className="block mb-1 text-gray-300">Título</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-900 border border-purple-900/30 text-white"
              required
            />
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="block mb-1 text-gray-300">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-900 border border-purple-900/30 text-white h-32"
              required
            />
          </div>

          {/* IMAGEN NUEVA (opcional) */}
          <div>
            <label className="block mb-1 text-gray-300">
              Cambiar imagen de portada (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full text-gray-300"
            />
          </div>

          {/* GÉNEROS */}
          <div>
            <label className="block mb-2 text-gray-300">
              Géneros (puedes elegir varios)
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {genresList.map((genre) => (
                <label
                  key={genre.id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition
                    ${
                      form.genres.includes(genre.id)
                        ? "bg-purple-700/30 border-purple-500"
                        : "bg-gray-900 border-purple-900/30"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={form.genres.includes(genre.id)}
                    onChange={() => toggleGenre(genre.id)}
                    className="accent-purple-500"
                  />
                  {genre.name}
                </label>
              ))}
            </div>
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-l3-purple text-white py-3 rounded-xl hover:bg-l3-light transition shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}