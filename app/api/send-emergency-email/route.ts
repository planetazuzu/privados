import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { formData, excelBase64 } = await request.json()

    const emailContent = `
Nuevo formulario de emergencia registrado:

📋 DATOS DEL SERVICIO:
• Número de Servicio: ${formData.numeroServicio}
• Fecha: ${formData.fecha} ${formData.hora}
• Vehículo: ${formData.vehiculo}
• Técnico 1: ${formData.tecnico1}
• Técnico 2: ${formData.tecnico2 || "No asignado"}

👤 DATOS DEL PACIENTE:
• Nombre: ${formData.nombreApellidos}
• DNI: ${formData.dni}
• Teléfono: ${formData.telefono}
• Posición: ${formData.posicion}

🚑 DATOS DEL TRASLADO:
• Origen: ${formData.direccionOrigen}, ${formData.localidadOrigen}
• Destino: ${formData.direccionDestino}, ${formData.localidadDestino}

🚨 TIPO DE ACCIDENTE:
• Modalidad: ${formData.modalidad}
• Interviene Policía Local: ${formData.interviene.policiaLocal ? "Sí" : "No"}
• Interviene Guardia Civil: ${formData.interviene.guardiaCivil ? "Sí" : "No"}
• Intervienen Otros: ${formData.interviene.otros ? "Sí" : "No"}

🚗 VEHÍCULOS IMPLICADOS: ${formData.vehiculos.length}
${formData.vehiculos
  .map(
    (v: any, i: number) => `• Vehículo ${i + 1}: ${v.marca} ${v.modelo} (${v.matricula})
  Aseguradora: ${v.aseguradora} - Póliza: ${v.numeroPoliza}`
  )
  .join("\n")}

📝 OBSERVACIONES:
${formData.observaciones || "Sin observaciones adicionales"}

---
Generado automáticamente por el Sistema de Emergencias Sanitarias
Fecha de envío: ${new Date().toLocaleString("es-ES")}
    `

    const data = await resend.emails.send({
      from: "emergencias@resend.dev", // Dominio de prueba de Resend
      to: [process.env.EMERGENCY_EMAIL || "planetazuzu@gmail.com"],
      subject: `🚨 Emergencia - Servicio ${formData.numeroServicio}`,
      text: emailContent,
      attachments: [
        {
          filename: `emergencia_${formData.numeroServicio}_${new Date().toISOString().split("T")[0]}.xlsx`,
          content: excelBase64,
          contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
    })

    return NextResponse.json({
      success: true,
      messageId: data.data?.id ?? null,
    })
  } catch (error: any) {
    console.error("Error enviando email:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}
