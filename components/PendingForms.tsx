"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Send, Trash2 } from "lucide-react"
import { getPendingForms, removePendingForm } from "@/utils/offlineStorage"
import { useToast } from "@/hooks/use-toast"

export default function PendingForms() {
  const [pendingForms, setPendingForms] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const loadPendingForms = () => {
      const forms = getPendingForms()
      setPendingForms(forms)
    }

    loadPendingForms()

    // Actualizar cada 10 segundos
    const interval = setInterval(loadPendingForms, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleRemoveForm = (formId: string) => {
    removePendingForm(formId)
    setPendingForms((prev) => prev.filter((form) => form.id !== formId))

    toast({
      title: "Formulario eliminado",
      description: "El formulario pendiente ha sido eliminado",
    })
  }

  const handleRetryForm = async (form: any) => {
    // Aquí implementarías la lógica para reintentar el envío
    toast({
      title: "Reintentando envío",
      description: "Intentando enviar el formulario...",
    })
  }

  // Solo mostrar si hay formularios pendientes
  if (pendingForms.length === 0) {
    return null
  }

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-orange-600 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Formularios Pendientes ({pendingForms.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingForms.map((form) => (
            <div
              key={form.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200 shadow-sm"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">Servicio #{form.numeroServicio}</span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Pendiente
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Paciente: {form.nombreApellidos}</p>
                  <p>Fecha: {new Date(form.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRetryForm(form)}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemoveForm(form.id)}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ Información:</strong> Estos formularios se enviarán automáticamente cuando vuelva la conexión a
            internet.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
