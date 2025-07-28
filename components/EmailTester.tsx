"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Mail, Send } from "lucide-react"
import ClientEmailTester from "@/components/ClientEmailTester"

export default function EmailTester() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfig] = useState({
    serviceId: "",
    templateId: "",
    publicKey: "",
  })

  useEffect(() => {
    // Obtener configuración de EmailJS
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/verify-config")
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setConfig({
              serviceId: data.config.serviceId,
              templateId: data.config.templateId,
              publicKey: data.config.publicKeyPreview.replace("...", "M6wPFkV0_TidqqLWF").substring(0, 17), // Usar la clave completa
            })
          }
        }
      } catch (error) {
        console.error("Error obteniendo configuración:", error)
      }
    }
    fetchConfig()
  }, [])

  const sendTestEmailServer = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error enviando email de prueba")
      }

      const result = await response.json()

      toast({
        title: "Email enviado",
        description: "El email de prueba se ha enviado correctamente",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar el email de prueba",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-green-600 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Probador de Email
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>Prueba la configuración de EmailJS enviando un email de prueba al sistema.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Desde Servidor (API)</h4>
              <Button
                onClick={sendTestEmailServer}
                disabled={isLoading}
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Probar desde Servidor
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Desde Cliente (Navegador)</h4>
              {config.serviceId ? (
                <ClientEmailTester
                  serviceId={config.serviceId}
                  templateId={config.templateId}
                  publicKey="M6wPFkV0_TidqqLWF"
                />
              ) : (
                <Button disabled variant="outline" className="w-full">
                  Cargando configuración...
                </Button>
              )}
            </div>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>• <strong>Servidor:</strong> Usa API REST (puede fallar por restricciones)</p>
            <p>• <strong>Cliente:</strong> Usa SDK de navegador (más confiable)</p>
            <p>• Verifica tu bandeja de entrada después del envío</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
