import { iMedicamento } from "@/domain/types"
import { convertirDecimal, numeroAString } from "@/lib/conversionDecimal"

export const imprimir = (
  peso: number,
  medicamento: iMedicamento,
  posologia: any,
  concentracion: any,
  cantidad: number,
  volumen: number
) => {
  console.log("\n")
  console.log("Peso:", peso, "kg")

  console.log("Medicamento:", medicamento.nombre, medicamento.presentacion)
  console.log(">Concentración:", medicamento.concentracionValor, medicamento.concentracionUnidad)
  console.log(">Posología:", medicamento.posologiaValor, medicamento.posologiaUnidad)

  console.log("Convertir Posología:", posologia.cantidad, posologia.tipo)
  console.log("Convertir Concentración:", concentracion.cantidad, concentracion.tipo)

  console.log(":: cantidad = peso * posologia.cantidad =", cantidad, posologia.tipo)
  console.log(":: volumen = cantidad / concentracion.cantidad =", volumen, concentracion.tipo)

  console.log("Resultado:", `${volumen.toFixed(3)} ${concentracion.tipo}`)
}

const convertirPosologia = (valor: number, unidad: string) => {
  switch (unidad) {
    case "mg/kg":
      return { cantidad: valor, tipo: "mg" }
    case "mcg/kg":
      return { cantidad: valor / 1000, tipo: "mg" }
    case "g/kg":
      return { cantidad: valor * 1000, tipo: "mg" }
    case "UI/kg":
      return { cantidad: valor, tipo: "UI" }
    default:
      throw new Error(`Unidad de posología no soportada: ${unidad}`)
  }
}

const convertirConcentracion = (valor: number, unidad: string) => {
  switch (unidad) {
    case "mg/ml":
      return { cantidad: valor, tipo: "ml" }
    case "mcg/ml":
      return { cantidad: valor / 1000, tipo: "ml" }
    case "g/ml":
      return { cantidad: valor * 1000, tipo: "ml" }
    case "mg/tab":
      return { cantidad: valor, tipo: "tab" }
    case "UI/ml":
      return { cantidad: valor, tipo: "ml" }
    default:
      throw new Error(`Unidad de concentración no soportada: ${unidad}`)
  }
}

export const calcularDosis = (medicamento: iMedicamento, textoPeso: string): string => {
  const peso = convertirDecimal(textoPeso)
  if (peso === null) return "..."

  try {
    const posologiaValor = convertirDecimal(medicamento.posologiaValor)
    if (posologiaValor === null) return "Error posologiaValor"

    const posologia = convertirPosologia(posologiaValor, medicamento.posologiaUnidad)

    const concentracionValor = convertirDecimal(medicamento.concentracionValor)
    if (concentracionValor === null) return "Error concentracionValor"

    const concentracion = convertirConcentracion(concentracionValor, medicamento.concentracionUnidad)

    const cantidad = peso * posologia.cantidad
    const volumen = cantidad / concentracion.cantidad

    imprimir(peso, medicamento, posologia, concentracion, cantidad, volumen)

    return `${numeroAString(volumen, ",")} ${concentracion.tipo}`
  } catch (error: any) {
    console.error("❌ Error en cálculo:", error.message)
    return "Error"
  }
}
