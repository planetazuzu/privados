import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar configuración de Resend
    const resendConfig = {
      success: !!process.env.RESEND_API_KEY,
      configured: !!process.env.RESEND_API_KEY,
      error: !process.env.RESEND_API_KEY ? "RESEND_API_KEY no configurado" : undefined,
    }

    const vapidConfig = {
      publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ? "Configurada" : "No configurada",
      privateKey: process.env.VAPID_PRIVATE_KEY ? "Configurada" : "No configurada",
    }

    return NextResponse.json({
      success: !!process.env.RESEND_API_KEY,
      timestamp: new Date().toISOString(),
      resend: resendConfig,
      vapid: vapidConfig,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        emergencyEmail: process.env.EMERGENCY_EMAIL || "emergencias@hospital.com",
      },
    })
  } catch (error: any) {
    console.error("Error verificando configuración:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
