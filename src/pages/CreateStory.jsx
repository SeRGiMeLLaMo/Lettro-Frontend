// useState → para guardar datos del formulario en memoria
import { useState } from "react";

// axios → para hacer peticiones HTTP a Laravel
import axios from "axios";


// Lista temporal de géneros (más adelante lo ideal es traerlos desde Laravel)
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

  // Estado principal del formulario
  // Aquí guardamos lo que el usuario escribe
  const [form, setForm] = useState({
    title: "",
    description: "",
    cover_image: null,
    genres: [], // aquí guardamos varios géneros seleccionados
  });

  // Estado para mostrar loading mientras se envía
  const [loading, setLoading] = useState(false);

  // Estado para mostrar errores que vienen de Laravel
  const [errors, setErrors] = useState(null);


  // Se ejecuta cuando el usuario escribe en título o descripción
  const handleChange = (e) => {
    setForm({ 
      ...form, // mantiene lo que ya había
      [e.target.name]: e.target.value // actualiza solo el campo cambiado
    });
  };


  // Se ejecuta cuando el usuario selecciona una imagen
  const handleImage = (e) => {
    setForm({ 
      ...form, 
      cover_image: e.target.files[0] // guardamos el archivo
    });
  };


  // Función para seleccionar o deseleccionar géneros
  const toggleGenre = (id) => {

    // Si ya está seleccionado lo quitamos
    if (form.genres.includes(id)) {
      setForm({
        ...form,
        genres: form.genres.filter((g) => g !== id),
      });
    } 
    // Si no está seleccionado lo añadimos
    else {
      setForm({
        ...form,
        genres: [...form.genres, id],
      });
    }
  };


  // Se ejecuta cuando el usuario envía el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // evita que la página se recargue

    setLoading(true);
    setErrors(null);

    // FormData se usa porque estamos enviando archivos (imagen)
    const data = new FormData();

    // Añadimos los campos básicos
    data.append("title", form.title);
    data.append("description", form.description);

    // Añadimos la imagen solo si existe
    if (form.cover_image) {
      data.append("cover_image", form.cover_image);
    }

    // Añadimos varios géneros como array
    form.genres.forEach((id) => {
      data.append("genre_id[]", id);
    });

    try {

      // Petición POST a Laravel
      const response = await axios.post(
        "http://localhost:8000/api/stories",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
          },
        }
      );

      // Si todo sale bien
      alert("Story creada correctamente 🎉");

      // Reseteamos formulario
      setForm({
        title: "",
        description: "",
        cover_image: null,
        genres: [],
      });

      console.log(response.data);

    } catch (error) {

      // Si Laravel devuelve errores de validación
      if (error.response) {
        setErrors(error.response.data.errors);
      } else {
        console.error(error);
      }

    }

    setLoading(false);
  };


  return (
    <div className="min-h-screen bg-l3-bg text-white flex justify-center p-8">
      <div className="bg-l3-card p-8 rounded-2xl w-full max-w-2xl border border-purple-900/30 shadow-xl">

        <h1 className="text-3xl font-bold text-l3-neon mb-6 text-center">
          Crear nueva Story
        </h1>

        {/* Mostrar errores si existen */}
        {errors && (
          <div className="bg-red-500/20 border border-red-500 p-3 rounded mb-4">
            {Object.values(errors).map((err, i) => (
              <p key={i} className="text-red-400 text-sm">{err}</p>
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

          {/* IMAGEN */}
          <div>
            <label className="block mb-1 text-gray-300">
              Imagen de portada
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
            {loading ? "Creando..." : "Crear Story"}
          </button>

        </form>
      </div>
    </div>
  );
}
