import * as XLSX from "xlsx"
import type { FormData } from "@/types/formTypes"

export function generateExcel(data: FormData): ArrayBuffer {
  // Crear un nuevo libro de trabajo
  const workbook = XLSX.utils.book_new()

  // Datos principales
  const datosPrincipales = [
    ["DATOS PRINCIPALES", ""],
    ["Fecha", data.fecha],
    ["Nº de Servicio", data.numeroServicio],
    ["Vehículo", data.vehiculo],
    ["Técnico 1", data.tecnico1],
    ["Técnico 2", data.tecnico2],
    ["", ""],
  ]

  // Datos del paciente
  const datosPaciente = [
    ["DATOS DEL PACIENTE", ""],
    ["Nombre y Apellidos", data.nombreApellidos],
    ["DNI", data.dni],
    ["Teléfono", data.telefono],
    ["Posición", data.posicion],
    ["", ""],
  ]

  // Datos del traslado
  const datosTraslado = [
    ["DATOS DEL TRASLADO", ""],
    ["Dirección Origen", data.direccionOrigen],
    ["Localidad Origen", data.localidadOrigen],
    ["Dirección Destino", data.direccionDestino],
    ["Localidad Destino", data.localidadDestino],
    ["", ""],
  ]

  // Tipo de accidente
  const tipoAccidente = [
    ["TIPO DE ACCIDENTE", ""],
    ["Modalidad", data.modalidad],
    ["Interviene Policía Local", data.interviene.policiaLocal ? "Sí" : "No"],
    ["Interviene Guardia Civil", data.interviene.guardiaCivil ? "Sí" : "No"],
    ["Intervienen Otros", data.interviene.otros ? "Sí" : "No"],
    ["", ""],
  ]

  // Datos de vehículos
  const datosVehiculos = [["DATOS DE VEHÍCULOS", ""]]
  data.vehiculos.forEach((vehiculo, index) => {
    datosVehiculos.push(
      [`Vehículo ${index + 1}`, ""],
      ["Marca", vehiculo.marca],
      ["Modelo", vehiculo.modelo],
      ["Matrícula", vehiculo.matricula],
      ["Aseguradora", vehiculo.aseguradora],
      ["Nº de Póliza", vehiculo.numeroPoliza],
      ["Tomador", vehiculo.tomador],
      ["", ""],
    )
  })

  // Observaciones
  const observaciones = [
    ["OBSERVACIONES", ""],
    ["Observaciones", data.observaciones],
  ]

  // Combinar todos los datos
  const allData = [
    ...datosPrincipales,
    ...datosPaciente,
    ...datosTraslado,
    ...tipoAccidente,
    ...datosVehiculos,
    ...observaciones,
  ]

  // Crear hoja de trabajo
  const worksheet = XLSX.utils.aoa_to_sheet(allData)

  // Aplicar estilos básicos
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1")
  for (let row = range.s.r; row <= range.e.r; row++) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 })
    if (worksheet[cellAddress] && typeof worksheet[cellAddress].v === "string") {
      const cellValue = worksheet[cellAddress].v as string
      if (cellValue.includes("DATOS") || cellValue.includes("TIPO DE") || cellValue.includes("OBSERVACIONES")) {
        worksheet[cellAddress].s = {
          font: { bold: true, sz: 14 },
          fill: { fgColor: { rgb: "CCCCCC" } },
        }
      }
    }
  }

  // Ajustar ancho de columnas
  worksheet["!cols"] = [{ width: 25 }, { width: 40 }]

  // Añadir hoja al libro
  XLSX.utils.book_append_sheet(workbook, worksheet, "Emergencia")

  // Generar buffer
  return XLSX.write(workbook, { type: "array", bookType: "xlsx" })
}

// Función para enviar notificación después del envío exitoso
export async function sendSuccessNotification(formData: FormData): Promise<void> {
  try {
    // Construir URL completa para que funcione en el servidor
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    await fetch(`${baseUrl}/api/notifications/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Formulario enviado correctamente",
        body: `El formulario de emergencia ${formData.numeroServicio} ha sido enviado por email`,
        type: "form_sent",
        data: {
          numeroServicio: formData.numeroServicio,
          paciente: formData.nombreApellidos,
          timestamp: Date.now(),
        },
        requireInteraction: true,
      }),
    })
  } catch (error) {
    console.log("Error enviando notificación:", error)
  }
}
