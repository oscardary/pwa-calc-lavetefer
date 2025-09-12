import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Medicamento {
  id: string;
  nombre: string;
  presentacion: string;
}

export default function ListaFormPage() {
  const { id } = useParams<{ id: string }>();
  const [listaNombre, setListaNombre] = useState("Cargando...");
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    // TODO: cargar datos reales de la lista por id
    setListaNombre("Tratamientos Perros");

    // TODO: cargar medicamentos del usuario
    setMedicamentos([
      { id: "m1", nombre: "Amoxicilina", presentacion: "500mg" },
      { id: "m2", nombre: "Ivermectina", presentacion: "1%" },
      { id: "m3", nombre: "Doxiciclina", presentacion: "200mg" },
    ]);
  }, [id]);

  const toggleMedicamento = (medId: string) => {
    setSeleccionados((prev) =>
      prev.includes(medId) ? prev.filter((x) => x !== medId) : [...prev, medId]
    );
  };

  const medicamentosFiltrados = medicamentos.filter((m) =>
    m.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{listaNombre}</h1>

      {/* Filtro */}
      <input
        type="text"
        placeholder="Buscar medicamento..."
        className="w-full p-2 border rounded mb-4"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <div className="grid gap-4">
        {medicamentosFiltrados.map((med) => (
          <div
            key={med.id}
            className="p-4 rounded-2xl shadow hover:shadow-md bg-white flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{med.nombre}</h2>
              <p className="text-gray-500 text-sm">{med.presentacion}</p>
            </div>
            <button
              onClick={() => toggleMedicamento(med.id)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                seleccionados.includes(med.id)
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              ✓
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
