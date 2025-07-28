import { type NextRequest, NextResponse } from "next/server"
import { generateExcel, sendSuccessNotification } from "@/utils/excelUtils"
import type { FormData } from "@/types/formTypes"

// Función para enviar formulario por email usando Resend
async function sendFormByEmail(excelBuffer: ArrayBuffer, formData: FormData) {
  // Verificar si Resend está configurado
  if (!process.env.RESEND_API_KEY) {
    console.log("RESEND_API_KEY no configurado - saltando envío de email")
    return { 
      messageId: null, 
      skipped: true, 
      reason: "RESEND_API_KEY no configurado en variables de entorno" 
    }
  }

  try {
    // Importar Resend dinámicamente solo si la API key está disponible
    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)

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
            ${formData.dni ? `<p><strong>DNI:</strong> ${formData.dni}</p>` : ''}
            ${formData.telefono ? `<p><strong>Teléfono:</strong> ${formData.telefono}</p>` : ''}
            <p><strong>Modalidad:</strong> ${formData.modalidad || 'No especificada'}</p>
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

    return { messageId: result.data?.id, skipped: false }
  } catch (error: any) {
    console.error("Error enviando email con Resend:", error)
    throw new Error(`Error de email: ${error.message}`)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const formData: FormData = body
    const excelBase64 = body.excelBase64 // Opcional: Excel ya convertido desde el frontend

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

    // Generar Excel (usar el del frontend si está disponible, sino generarlo aquí)
    const excelBuffer = excelBase64 
      ? Buffer.from(excelBase64, 'base64').buffer as ArrayBuffer
      : generateExcel(formData)

    // Intentar envío por email
    const emailResult = await sendFormByEmail(excelBuffer, formData)

    // Enviar notificación de éxito (solo si está configurado)
    try {
      await sendSuccessNotification(formData)
    } catch (notificationError) {
      console.log("Error enviando notificación (no crítico):", notificationError)
    }

    const response: any = {
      success: true,
      emailSent: !emailResult.skipped,
      message: emailResult.skipped 
        ? "Formulario procesado correctamente. Email no enviado (RESEND_API_KEY no configurado)" 
        : "Formulario enviado correctamente por email",
      numeroServicio: formData.numeroServicio,
    }

    if (!emailResult.skipped) {
      response.messageId = emailResult.messageId
    } else {
      response.emailSkippedReason = emailResult.reason
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Error procesando formulario:", error)
    return NextResponse.json({ 
      error: error.message || "Error interno del servidor",
      success: false,
      emailSent: false 
    }, { status: 500 })
  }
}
