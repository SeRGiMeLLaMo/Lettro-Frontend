import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth.js";

export default function Story() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`${API_BASE}/stories/${id}`, {
          headers: { Accept: "application/json" },
        });
        const s = response.data;
        setStory(s);
        setLikesCount(s.likes_count || 0);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la historia.");
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id, API_BASE]);

  useEffect(() => {
    const authorId = story?.author?.id;
    if (!authorId) return;
    axios
      .get(`${API_BASE}/users/${authorId}/follow/status`, {
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        withCredentials: true,
      })
      .then((res) => {
        setFollowing(!!res.data?.following);
      })
      .catch(() => {
        setFollowing(false);
      });
  }, [story?.author?.id, API_BASE, token]);

  const handleToggleLike = async () => {
    if (!user) {
      navigate("/register");
      return;
    }
    // Evitar likes propios
    if (user?.id && story?.author?.id && user.id === story.author.id) {
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE}/likes/toggle`,
        { story_id: Number(id) },
        {
          headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          withCredentials: true,
        }
      );
      const nowLiked = !!res.data?.liked;
      setLiked(nowLiked);
      setLikesCount((c) => c + (nowLiked ? 1 : -1));
    } catch (err) {
      console.error(err);
      alert("Necesitas iniciar sesión para dar me gusta.");
    }
  };

  const handleToggleFollow = async () => {
    if (!user) {
      navigate("/register");
      return;
    }
    const authorId = story?.author?.id;
    if (!authorId) return;
    // Evitar seguirse a uno mismo
    if (user?.id && user.id === authorId) {
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE}/users/${authorId}/follow/toggle`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          withCredentials: true,
        }
      );
      setFollowing(!!res.data?.following);
    } catch (err) {
      console.error(err);
      alert("Debes iniciar sesión para seguir autores.");
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este capítulo? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/chapters/${chapterId}`, {
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        withCredentials: true,
      });

      // Actualizar la lista de capítulos localmente
      setStory((prev) => ({
        ...prev,
        chapters: prev.chapters.filter((ch) => ch.id !== chapterId),
      }));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el capítulo.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-gray-400">Cargando historia...</p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-red-400">
          {error || "La historia no existe o ha sido eliminada."}
        </p>
      </div>
    );
  }

  const chapters = story.chapters || [];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex flex-row gap-8">
        <div className="flex-shrink-0 w-[170px] sm:w-[200px] md:w-[240px] flex flex-col items-start gap-4">
          <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-md border border-l3-border bg-gradient-to-br from-l3-gold/40 to-l3-brown/30 flex items-center justify-center">
            {story.cover_image ? (
              <img
                src={`http://127.0.0.1:8000/storage/${story.cover_image}`}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-l3-muted px-4 text-center">
                Esta historia aún no tiene portada.
              </span>
            )}
          </div>
          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-l3-paper text-left">
              {story.title}
            </h1>
            <p className="text-sm md:text-base text-l3-muted text-left">
              {story.author?.id ? (
                <a
                  href={`/profile/${story.author.id}`}
                  className="text-l3-gold hover:underline"
                >
                  {story.author?.username || story.author?.name}
                </a>
              ) : (
                "Autor desconocido"
              )}
            </p>
          </div>
        </div>

        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <div className="bg-l3-card rounded-2xl shadow p-5 border border-l3-border">
            <p className="text-sm md:text-base text-l3-paper whitespace-pre-line">
              {story.description || "Esta historia aún no tiene descripción."}
            </p>
          </div>

          <div className="flex justify-end gap-3">
            {!(user?.id && story?.author?.id && user.id === story.author.id) && (
              <>
                <button
                  onClick={handleToggleLike}
                  className={`px-4 py-2 rounded-xl hover:opacity-90 ${
                    liked ? "bg-red-600 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  ❤️ Me gusta ({likesCount})
                </button>
                <button
                  onClick={handleToggleFollow}
                  className={`px-4 py-2 rounded-xl hover:opacity-90 ${
                    following ? "bg-gray-600 text-white" : "bg-gray-700 text-white"
                  }`}
                >
                  {following ? "Dejar de seguir" : "Seguir autor"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-l3-paper mb-2">Capítulos</h2>
        <div className="bg-l3-card rounded-2xl border border-purple-900/30 shadow max-h-64 overflow-y-auto p-4">
          {chapters.length === 0 ? (
            <p className="text-sm text-gray-400">
              Esta historia aún no tiene capítulos.
            </p>
          ) : (
            <ul className="space-y-2">
              {chapters
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((ch, index) => (
                <li
                  key={ch.id}
                  className="flex items-center justify-between text-sm text-l3-paper border-b border-l3-border/60 last:border-b-0 pb-2"
                >
                  <Link
                    to={`/chapters/${ch.id}`}
                    className="text-l3-paper hover:text-l3-gold font-medium truncate flex-1 mr-4"
                  >
                    {ch.order ? `${ch.order}. ` : `${index + 1}. `}
                    {ch.title}
                  </Link>

                  {user?.id && story?.author?.id && user.id === story.author.id && (
                    <div className="flex gap-2 flex-shrink-0">
                      <Link
                        to={`/chapters/${ch.id}/edit`}
                        className="p-1.5 rounded-lg bg-l3-gold text-white hover:opacity-90 transition-all shadow-sm flex items-center justify-center"
                        title="Editar capítulo"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDeleteChapter(ch.id)}
                        className="p-1.5 rounded-lg bg-red-500 text-white hover:opacity-90 transition-all shadow-sm flex items-center justify-center"
                        title="Eliminar capítulo"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="bg-l3-card rounded-2xl shadow p-4 border border-purple-900/30">
        <h2 className="font-semibold mb-2 text-white">Comentarios</h2>
        <p className="text-sm text-gray-400">Aún no hay comentarios.</p>
      </section>
    </div>
  );
}
