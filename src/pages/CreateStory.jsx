import { useState } from "react";

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

export default function CreateStory() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    cover_image: null,
    genres: [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setForm({ ...form, cover_image: e.target.files[0] });
  };

  const toggleGenre = (id) => {
    const exists = form.genres.includes(id);

    if (exists) {
      setForm({
        ...form,
        genres: form.genres.filter((g) => g !== id),
      });
    } else {
      setForm({
        ...form,
        genres: [...form.genres, id],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("cover_image", form.cover_image);

    form.genres.forEach((id) => {
      data.append("genre_id[]", id);
    });

    console.log("Datos listos para enviar a Laravel:", form);

    // Luego aquí harías:
    // axios.post("http://localhost:8000/api/stories", data)
  };

  return (
    <div className="min-h-screen bg-l3-bg text-white flex justify-center p-8">
      <div className="bg-l3-card p-8 rounded-2xl w-full max-w-2xl border border-purple-900/30 shadow-xl">
        <h1 className="text-3xl font-bold text-l3-neon mb-6 text-center">
          Crear nueva Story
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* TITLE */}
          <div>
            <label className="block mb-1 text-gray-300">Título</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-900 border border-purple-900/30 text-white"
              placeholder="Ej: El reino de las sombras"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block mb-1 text-gray-300">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-900 border border-purple-900/30 text-white h-32"
              placeholder="Describe tu historia..."
              required
            />
          </div>

          {/* COVER IMAGE */}
          <div>
            <label className="block mb-1 text-gray-300">
              Imagen de portada
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full text-gray-300"
              required
            />
          </div>

          {/* GENRES CHECKBOX */}
          <div>
            <label className="block mb-2 text-gray-300">
              Géneros (puedes elegir varios)
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {genresList.map((genre) => (
                <label
                  key={genre.id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer border 
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

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-l3-purple text-white py-3 rounded-xl hover:bg-l3-light transition shadow-lg shadow-purple-500/20"
          >
            Crear Story
          </button>
        </form>
      </div>
    </div>
  );
}