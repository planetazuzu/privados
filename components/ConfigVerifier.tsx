"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Settings, CheckCircle, XCircle, RefreshCw } from "lucide-react"

interface ConfigStatus {
  success: boolean
  timestamp: string
  email: {
    success: boolean
    config?: {
      serviceId: string
      templateId: string
      publicKeyPreview: string
      privateKeyConfigured: boolean
    }
    error?: string
  }
  vapid: {
    publicKey: string
    privateKey: string
  }
  environment: {
    nodeEnv: string
    emergencyEmail: string
  }
}

export default function ConfigVerifier() {
  const { toast } = useToast()
  const [config, setConfig] = useState<ConfigStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const verifyConfig = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/verify-config")

      if (!response.ok) {
        throw new Error("Error verificando configuración")
      }

      const data = await response.json()
      setConfig(data)

      toast({
        title: "Configuración verificada",
        description: "Se ha verificado el estado de la configuración del sistema",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo verificar la configuración",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    verifyConfig()
  }, [])

  const getStatusBadge = (status: boolean | string) => {
    if (typeof status === "boolean") {
      return status ? (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Configurado
        </Badge>
      ) : (
        <Badge className="bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          No configurado
        </Badge>
      )
    }

    return status === "Configurada" ? (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Configurada
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        No configurada
      </Badge>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Verificador de Configuración
          <Button
            onClick={verifyConfig}
            disabled={isLoading}
            size="sm"
            variant="outline"
            className="ml-auto bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && !config && <div className="text-center text-gray-500">Verificando configuración...</div>}

        {config && (
          <div className="space-y-4">
            {/* Estado general */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Estado del Sistema</span>
              {getStatusBadge(config.success)}
            </div>

            {/* Configuración de EmailJS */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">📧 Configuración de EmailJS</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm">Service ID</span>
                  {config.email.success && config.email.config ? (
                    <Badge variant="secondary">{config.email.config.serviceId}</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">No configurado</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm">Template ID</span>
                  {config.email.success && config.email.config ? (
                    <Badge variant="secondary">{config.email.config.templateId}</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">No configurado</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm">Public Key</span>
                  {config.email.success && config.email.config ? (
                    <Badge variant="secondary">{config.email.config.publicKeyPreview}</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">No configurado</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm">Private Key</span>
                  {getStatusBadge(config.email.config?.privateKeyConfigured || false)}
                </div>
              </div>
            </div>

            {/* Configuración de VAPID */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">🔐 Claves VAPID</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                  <span className="text-sm">Public Key</span>
                  {getStatusBadge(config.vapid.publicKey)}
                </div>

                <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                  <span className="text-sm">Private Key</span>
                  {getStatusBadge(config.vapid.privateKey)}
                </div>
              </div>
            </div>

            {/* Información del entorno */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">🌍 Entorno</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm">Modo</span>
                  <Badge variant="secondary">{config.environment.nodeEnv}</Badge>
                </div>

                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm">Email de Emergencias</span>
                  <Badge variant="secondary" className="text-xs">
                    {config.environment.emergencyEmail}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-xs text-gray-500 text-center pt-2 border-t">
              Última verificación: {new Date(config.timestamp).toLocaleString("es-ES")}
            </div>

            {/* Errores */}
            {config.email.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Error en EmailJS:</strong> {config.email.error}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
