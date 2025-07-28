import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message } = await request.json()

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "RESEND_API_KEY no configurado",
        message: "Para enviar emails de prueba, configura RESEND_API_KEY en las variables de entorno",
      }, { status: 400 })
    }

    if (!to) {
      return NextResponse.json({
        success: false,
        error: "Email de destino es requerido"
      }, { status: 400 })
    }

    // Importar Resend dinámicamente
    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)

    const result = await resend.emails.send({
      from: "Emergency Form <onboarding@resend.dev>",
      to: [to],
      subject: subject || "Prueba de email desde Emergency Form",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">🚨 Prueba de Email - Emergency Form</h2>
          <p style="color: #666;">Este es un email de prueba enviado desde el sistema de formularios de emergencia.</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Mensaje:</strong></p>
            <p style="margin: 0;">${message || "Email de prueba exitoso."}</p>
          </div>
          <p style="color: #999; font-size: 12px;">
            Enviado por Emergency Form - Sistema de gestión de emergencias
          </p>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Email de prueba enviado correctamente",
      messageId: result.data?.id,
    })
  } catch (error: any) {
    console.error("Error enviando email de prueba:", error)
    return NextResponse.json({ 
      success: false,
      error: error.message || "Error enviando email de prueba" 
    }, { status: 500 })
  }
}
