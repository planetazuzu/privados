"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Mail, Send } from "lucide-react"

export default function EmailTester() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    to: "",
    subject: "Prueba de email desde Emergency Form",
    message: "Este es un email de prueba enviado desde el sistema de formularios de emergencia."
  })

  const sendTestEmail = async () => {
    if (!formData.to.trim()) {
      toast({
        title: "Error",
        description: "Ingresa un email de destino",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Error enviando email de prueba")
      }

      const data = await response.json()

      toast({
        title: "✅ Email enviado",
        description: `Email de prueba enviado correctamente a ${formData.to}`,
      })

      console.log("Respuesta del servidor:", data)
    } catch (error: any) {
      console.error("Error enviando email:", error)
      toast({
        title: "❌ Error",
        description: error.message || "No se pudo enviar el email",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Prueba de Email (Resend)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email-to">Email de destino</Label>
          <Input
            id="email-to"
            type="email"
            placeholder="destinatario@ejemplo.com"
            value={formData.to}
            onChange={(e) => handleInputChange("to", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-subject">Asunto</Label>
          <Input
            id="email-subject"
            placeholder="Asunto del email"
            value={formData.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-message">Mensaje</Label>
          <Textarea
            id="email-message"
            placeholder="Contenido del email de prueba"
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            rows={4}
          />
        </div>

        <Button 
          onClick={sendTestEmail} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Send className="w-4 h-4 mr-2 animate-pulse" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enviar email de prueba
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Configuración: Solo Resend</p>
          <p>• Sistema limpio sin dependencias de EmailJS</p>
          <p>• Más confiable y seguro</p>
        </div>
      </CardContent>
    </Card>
  )
}