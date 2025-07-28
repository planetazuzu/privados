import { type NextRequest, NextResponse } from "next/server"
import { sendFormByEmail } from "@/app/actions/emailActions"
import { generateExcel, sendSuccessNotification } from "@/utils/excelUtils"
import type { FormData } from "@/types/formTypes"

export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json()

    // Validar solo campos esenciales
    const requiredFields = [
      { field: "fecha", name: "Fecha" },
      { field: "numeroServicio", name: "Número de Servicio" },
      { field: "nombreApellidos", name: "Nombre del Paciente" },
    ]

    for (const { field, name } of requiredFields) {
      if (!formData[field as keyof FormData]) {
        return NextResponse.json({ error: `${name} es obligatorio` }, { status: 400 })
      }
    }

    // Validar que al menos hay una dirección
    if (!formData.direccionOrigen && !formData.direccionDestino) {
      return NextResponse.json({ error: "Debe especificar al menos la dirección de origen o destino" }, { status: 400 })
    }

    // Generar Excel
    const excelBuffer = generateExcel(formData)

    // Enviar por email
    const emailResult = await sendFormByEmail(excelBuffer, formData)

    // Enviar notificación de éxito
    await sendSuccessNotification(formData)

    return NextResponse.json({
      success: true,
      message: "Formulario enviado correctamente",
      emailMessageId: emailResult.messageId,
      numeroServicio: formData.numeroServicio,
    })
  } catch (error: any) {
    console.error("Error procesando formulario:", error)
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 })
  }
}
