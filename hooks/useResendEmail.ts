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

      const response = await fetch("/api/send-emergency-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          excelBase64: base64String,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error enviando email")
      }

      console.log("Email enviado exitosamente con Resend:", result)

      return {
        success: true,
        messageId: result.messageId,
      }
    } catch (error: any) {
      console.error("Error enviando email con Resend:", error)
      throw new Error(`Error al enviar por email: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    sendFormByResend,
    isLoading,
  }
}
