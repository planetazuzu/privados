import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { generateExcel, sendSuccessNotification } from "@/utils/excelUtils"
import type { FormData } from "@/types/formTypes"

const resend = new Resend(process.env.RESEND_API_KEY)

// Función para enviar formulario por email usando Resend
async function sendFormByEmail(excelBuffer: ArrayBuffer, formData: FormData) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY no configurado")
  }

  const emergencyEmail = process.env.EMERGENCY_EMAIL || "emergencias@hospital.com"
  
  const result = await resend.emails.send({
    from: "Emergency Form <onboarding@resend.dev>",
    to: [emergencyEmail],
    subject: `🚨 EMERGENCIA - Servicio ${formData.numeroServicio}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">🚨 FORMULARIO DE EMERGENCIA</h2>
        <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #dc2626;">Información del Servicio</h3>
          <p><strong>Número de Servicio:</strong> ${formData.numeroServicio}</p>
          <p><strong>Fecha:</strong> ${formData.fecha}</p>
          <p><strong>Paciente:</strong> ${formData.nombreApellidos}</p>
          <p><strong>Edad:</strong> ${formData.edad} años</p>
          <p><strong>Tipo de Accidente:</strong> ${formData.tipoAccidente}</p>
        </div>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0;">Direcciones:</h4>
          ${formData.direccionOrigen ? `<p><strong>Origen:</strong> ${formData.direccionOrigen}</p>` : ''}
          ${formData.direccionDestino ? `<p><strong>Destino:</strong> ${formData.direccionDestino}</p>` : ''}
        </div>
        ${formData.observaciones ? `
          <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #f59e0b;">Observaciones:</h4>
            <p style="margin: 0;">${formData.observaciones}</p>
          </div>
        ` : ''}
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          📎 Se adjunta archivo Excel con todos los detalles del formulario.
        </p>
      </div>
    `,
    attachments: [
      {
        filename: `emergencia_${formData.numeroServicio}_${new Date().toISOString().split('T')[0]}.xlsx`,
        content: Buffer.from(excelBuffer),
      },
    ],
  })

  return { messageId: result.data?.id }
}

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
