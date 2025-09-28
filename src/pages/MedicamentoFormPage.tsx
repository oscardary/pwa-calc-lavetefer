// src/pages/MedicamentoFormPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "@/components/TopBar";
import InputLabelFloating from "@/components/InputLabelFloating";
import TextareaLabelFloating from "@/components/TextareaLabelFloating";
import ActionButtons from "@/components/ActionButtons";
import { UNIDADES_CONCENTRACION, UNIDADES_POSOLOGIA } from "@/constants/units";
import { useMedicamentos } from "@/hooks/useMedicamentos";
import { iMedicamentoId } from "@/domain/types";
import { Trash2 } from "lucide-react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function MedicamentoFormPage() {
  const { listaId, medId } = useParams();
  const nav = useNavigate();
  const { getMed, saveMed, removeMed } = useMedicamentos(listaId!);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [med, setMed] = useState<iMedicamentoId>({
    id: "",
    usuarioId: "",
    nombre: "",
    presentacion: "",
    concentracionValor: "",
    concentracionUnidad: "mg/ml",
    posologiaValor: "",
    posologiaUnidad: "mg/kg",
    comentario: "",
  });

  useEffect(() => {
    if (medId && medId !== "new") {
      getMed(medId).then((m) => m && setMed(m));
    }
  }, [medId]);

  return (
    <div>
      <TopBar />
      <main className="max-w-3xl mx-auto p-4 space-y-4 pb-24">
        <h1 className="text-xl font-semibold flex items-center justify-between">
          {medId === "new" ? "Agregar" : "Editar"} Medicamento
          {medId !== "new" && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </h1>
        <form
          className="grid gap-3 pb-20"
          onSubmit={(e) => {
            e.preventDefault();
            saveMed(med).then(() => nav(-1));
          }}
        >
          <InputLabelFloating
            id="nombre"
            type="text"
            label="Nombre"
            value={med.nombre}
            onChange={(e) => setMed({ ...med, nombre: e.target.value })}
            required
          />

          <InputLabelFloating
            id="presentacion"
            type="text"
            label="Presentación"
            value={med.presentacion}
            onChange={(e) => setMed({ ...med, presentacion: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-2">
            <InputLabelFloating
              id="valConcentracion"
              type="text"
              label="Concentración"
              value={med.concentracionValor}
              onChange={(e) =>
                setMed({ ...med, concentracionValor: e.target.value })
              }
              required
            />
            <select
              className="border rounded-xl px-3 py-2"
              value={med.concentracionUnidad}
              onChange={(e) =>
                setMed({ ...med, concentracionUnidad: e.target.value })
              }
            >
              {UNIDADES_CONCENTRACION.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <InputLabelFloating
              id="valPosologia"
              type="text"
              label="Posología"
              value={med.posologiaValor}
              onChange={(e) =>
                setMed({ ...med, posologiaValor: e.target.value })
              }
              required
            />
            <select
              className="border rounded-xl px-3 py-2"
              value={med.posologiaUnidad}
              onChange={(e) =>
                setMed({ ...med, posologiaUnidad: e.target.value })
              }
            >
              {UNIDADES_POSOLOGIA.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <TextareaLabelFloating
            id="comentario"
            label="Observaciones"
            value={med.comentario}
            onChange={(e) => setMed({ ...med, comentario: e.target.value })}
            required
          />
        </form>
      </main>
      <ActionButtons onSave={() => saveMed(med).then(() => nav(-1))} />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => removeMed(med.id).then(() => nav(-1))}
        title="Eliminar medicamento"
        message="¿Estás seguro? Este medicamento se eliminará también de todas las listas en las que esté asociado."
      />
    </div>
  );
}
