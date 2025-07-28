import { type NextRequest, NextResponse } from "next/server"

// Almacenamiento temporal de confirmaciones (en producción usar base de datos)
const acknowledgments: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { notificationId, userId, timestamp } = await request.json()

    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 400 })
    }

    const acknowledgment = {
      id: Date.now().toString(),
      notificationId,
      userId: userId || "anonymous",
      timestamp: timestamp || Date.now(),
      acknowledgedAt: new Date().toISOString(),
    }

    acknowledgments.push(acknowledgment)

    console.log(`Notificación ${notificationId} confirmada por ${userId || "usuario anónimo"}`)

    return NextResponse.json({
      success: true,
      acknowledgmentId: acknowledgment.id,
      message: "Confirmación registrada",
    })
  } catch (error) {
    console.error("Error registrando confirmación:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    totalAcknowledgments: acknowledgments.length,
    recent: acknowledgments.slice(-10),
  })
}
