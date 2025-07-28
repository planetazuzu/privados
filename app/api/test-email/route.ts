import { type NextRequest, NextResponse } from "next/server"
import { sendTestEmail } from "@/app/actions/emailActions"

export async function POST(request: NextRequest) {
  try {
    const result = await sendTestEmail()

    return NextResponse.json({
      success: true,
      message: "Email de prueba enviado correctamente",
      messageId: result.messageId,
    })
  } catch (error: any) {
    console.error("Error enviando email de prueba:", error)
    return NextResponse.json({ error: error.message || "Error enviando email de prueba" }, { status: 500 })
  }
}
