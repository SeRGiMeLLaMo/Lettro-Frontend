// Página de inicio de sesión
export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      
      {/* Caja del formulario */}
      <div className="bg-white p-8 rounded-xl w-96">
        
        <h2 className="text-2xl font-bold mb-6 text-center">
          Iniciar sesión
        </h2>

        {/* Campo email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Campo contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-5 p-2 border rounded"
        />

        {/* Botón de login */}
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Entrar
        </button>
      </div>
    </div>
  );
}