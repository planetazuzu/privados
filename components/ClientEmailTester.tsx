"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import emailjs from "@emailjs/browser"

interface ClientEmailTesterProps {
  serviceId: string
  templateId: string
  publicKey: string
}

export default function ClientEmailTester({ serviceId, templateId, publicKey }: ClientEmailTesterProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const sendTestEmail = async () => {
    setIsLoading(true)

    try {
      const templateParams = {
        to_email: "planetazuzu@gmail.com",
        from_name: "Sistema de Emergencias Sanitarias",
        subject: "🧪 Prueba del Sistema de Emergencias",
        message: `Esta es una prueba del sistema de emergencias sanitarias.

🔧 INFORMACIÓN DE LA PRUEBA:
• Fecha: ${new Date().toLocaleString("es-ES")}
• Sistema: Funcionando correctamente
• Configuración: EmailJS conectado desde cliente
• Estado: Operativo

✅ FUNCIONALIDADES VERIFICADAS:
• Conexión con EmailJS desde navegador
• Envío de emails desde cliente
• Configuración de credenciales
• Formato de mensajes

Este email confirma que el sistema está listo para enviar formularios de emergencia.

---
Sistema de Emergencias Sanitarias
Prueba automática del ${new Date().toLocaleDateString("es-ES")}`,
      }

      console.log("Enviando email desde cliente...")

      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      )

      console.log("Email enviado exitosamente:", response)

      toast({
        title: "✅ Email enviado",
        description: "El email de prueba se ha enviado correctamente desde el cliente",
      })
    } catch (error: any) {
      console.error("Error enviando email:", error)
      toast({
        title: "❌ Error",
        description: `No se pudo enviar el email: ${error.message || error.text || "Error desconocido"}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={sendTestEmail}
      disabled={isLoading}
      className="w-full"
      variant="default"
    >
      {isLoading ? "Enviando..." : "📧 Enviar Email de Prueba (Cliente)"}
    </Button>
  )
}
