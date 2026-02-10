// Página de inicio de sesión
export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-l3-bg">
      <div className="bg-l3-card p-8 rounded-2xl w-96 border border-purple-900/30 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-l3-neon">
          Iniciar sesión en L3ttro
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 rounded bg-gray-900 text-white border border-purple-900/30"
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-5 p-2 rounded bg-gray-900 text-white border border-purple-900/30"
        />

        <button className="w-full bg-l3-purple text-white py-2 rounded-xl hover:bg-l3-light transition">
          Entrar
        </button>
      </div>
    </div>
  );
}