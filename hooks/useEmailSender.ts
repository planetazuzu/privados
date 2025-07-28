"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import emailjs from "@emailjs/browser"
import type { FormData } from "@/types/formTypes"

export function useEmailSender() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const sendFormByEmailClient = async (excelBuffer: ArrayBuffer, formData: FormData) => {
    setIsLoading(true)

    try {
      // Inicializar EmailJS si no está inicializado
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "M6wPFkV0_TidqqLWF")

      // NO enviamos el archivo Excel, solo la información
      const templateParams = {
        to_email: process.env.EMERGENCY_EMAIL || "planetazuzu@gmail.com",
        from_name: "Sistema de Emergencias",
        subject: `Emergencia ${formData.numeroServicio}`,
        message: `Nuevo formulario de emergencia registrado:

Servicio: ${formData.numeroServicio}
Fecha: ${formData.fecha} ${formData.hora}
Paciente: ${formData.nombreApellidos}
DNI: ${formData.dni}
Teléfono: ${formData.telefono}

Traslado:
Origen: ${formData.direccionOrigen}, ${formData.localidadOrigen}
Destino: ${formData.direccionDestino}, ${formData.localidadDestino}

Vehículo: ${formData.vehiculo}
Técnicos: ${formData.tecnico1} ${formData.tecnico2 ? '/ ' + formData.tecnico2 : ''}

Observaciones: ${formData.observaciones || 'Sin observaciones'}

NOTA: El archivo Excel se ha descargado localmente con todos los detalles completos.`,
        
        servicio: formData.numeroServicio,
        fecha: formData.fecha,
        paciente: formData.nombreApellidos
      }

      console.log("Enviando formulario de emergencia por email...")

      const response = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_4x46jw8",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_7kai7z5",
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "M6wPFkV0_TidqqLWF"
      )

      console.log("Formulario enviado exitosamente:", response)

      return {
        success: true,
        messageId: response.text,
        status: response.status
      }
    } catch (error: any) {
      console.error("Error enviando formulario por email:", error)
      
      // Manejo específico de errores de EmailJS
      let errorMessage = "Error desconocido"
      
      if (error.status) {
        switch (error.status) {
          case 400:
            errorMessage = "Datos del formulario inválidos"
            break
          case 401:
            errorMessage = "Credenciales de EmailJS incorrectas"
            break
          case 402:
            errorMessage = "Límite de emails alcanzado"
            break
          case 403:
            errorMessage = "Servicio no autorizado"
            break
          case 404:
            errorMessage = "Servicio o template no encontrado"
            break
          case 413:
            errorMessage = "Email demasiado grande"
            break
          case 422:
            errorMessage = "Plantilla de email inválida"
            break
          case 429:
            errorMessage = "Demasiadas solicitudes, intenta más tarde"
            break
          case 500:
            errorMessage = "Error del servidor de EmailJS"
            break
          default:
            errorMessage = `Error HTTP ${error.status}: ${error.text || error.message}`
        }
      } else if (error.text) {
        errorMessage = error.text
      } else if (error.message) {
        errorMessage = error.message
      }
      
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    sendFormByEmailClient,
    isLoading
  }
}
