"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import type { FormData } from "@/types/formTypes"

export function useResendEmail() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const sendFormByResend = async (excelBuffer: ArrayBuffer, formData: FormData) => {
    setIsLoading(true)

    try {
      // Convertir buffer a base64
      const base64String = Buffer.from(excelBuffer).toString("base64")

      // Usar la API optimizada de emergency-form que ya está configurada
      const response = await fetch("/api/emergency-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          // Indicar que queremos envío por email
          sendEmail: true,
          excelBase64: base64String,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error enviando formulario")
      }

      console.log("Formulario enviado exitosamente:", result)

      // Mostrar toast de éxito
      toast({
        title: result.emailSent ? "✅ Email enviado" : "📥 Formulario guardado",
        description: result.emailSent 
          ? `Formulario ${formData.numeroServicio} enviado por email con Excel adjunto`
          : `Formulario ${formData.numeroServicio} guardado. Email no disponible (Resend no configurado)`,
      })

      return {
        success: true,
        emailSent: result.emailSent,
        messageId: result.messageId,
        message: result.message,
      }
    } catch (error: any) {
      console.error("Error enviando formulario:", error)
      
      // Toast de error más informativo
      toast({
        title: "❌ Error al enviar",
        description: error.message.includes("RESEND_NOT_CONFIGURED") 
          ? "Resend no configurado - el formulario se guardará localmente"
          : `Error: ${error.message}`,
        variant: "destructive",
      })
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    sendFormByResend,
    isLoading,
  }
}
