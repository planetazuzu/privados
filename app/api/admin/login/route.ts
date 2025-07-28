import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Contraseña requerida" },
        { status: 400 }
      )
    }

    // Verificar contraseña (en producción usar hash)
    const adminPassword = process.env.ADMIN_PASSWORD || "emergencias2025"
    
    if (password === adminPassword) {
      return NextResponse.json({
        success: true,
        message: "Autenticación exitosa"
      })
    } else {
      return NextResponse.json(
        { success: false, error: "Contraseña incorrecta" },
        { status: 401 }
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Error del servidor" },
      { status: 500 }
    )
  }
}
