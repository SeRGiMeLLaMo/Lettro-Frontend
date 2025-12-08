export default function Search() {
    return (
    <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Buscar historias</h1>
            <input
                type="text"
                placeholder="Buscar por título, autor o tags"
                className="w-full p-3 rounded-xl border mb-6"
            />
        <div className="space-y-4">
            {[1,2,3].map((id) => (
            <div key={id} className="bg-white p-4 rounded-xl shadow">
                <h2 className="font-semibold">Resultado #{id}</h2>
                <p className="text-sm text-gray-600">Resumen breve...</p>
            </div>
            ))}
        </div>
    </div>
    );
}