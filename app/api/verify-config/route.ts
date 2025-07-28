import { NextResponse } from "next/server"
import { verifyEmailConfig } from "@/app/actions/emailActions"

export async function GET() {
  try {
    const emailVerification = await verifyEmailConfig()

    const vapidConfig = {
      publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ? "Configurada" : "No configurada",
      privateKey: process.env.VAPID_PRIVATE_KEY ? "Configurada" : "No configurada",
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      email: emailVerification,
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
