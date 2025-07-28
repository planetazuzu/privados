"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import DatosPrincipales from "@/components/DatosPrincipales"
import DatosPaciente from "@/components/DatosPaciente"
import DatosTraslado from "@/components/DatosTraslado"
import TipoAccidente from "@/components/TipoAccidente"
import DatosVehiculos from "@/components/DatosVehiculos"
import Observaciones from "@/components/Observaciones"
import { generateExcel } from "@/utils/excelUtils"
import type { FormData } from "@/types/formTypes"
import { useOffline } from "@/hooks/useOffline"
import ConnectionStatus from "@/components/ConnectionStatus"
import { saveFormData, loadFormData, clearFormData, savePendingForm } from "@/utils/offlineStorage"
import PendingForms from "@/components/PendingForms"
import { usePushNotifications } from "@/hooks/usePushNotifications"
import { useResendEmail } from "@/hooks/useResendEmail"

export default function EmergencyForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isOnline } = useOffline()
  const { isSupported, subscribe } = usePushNotifications()
  const { sendFormByResend, isLoading: isResendLoading } = useResendEmail()

  const [formData, setFormData] = useState<FormData>({
    fecha: "",
    hora: "",
    numeroServicio: "",
    vehiculo: "",
    tecnico1: "",
    tecnico2: "",
    nombreApellidos: "",
    dni: "",
    telefono: "",
    posicion: "",
    direccionOrigen: "",
    localidadOrigen: "",
    direccionDestino: "",
    localidadDestino: "",
    modalidad: "",
    interviene: {
      policiaLocal: false,
      guardiaCivil: false,
      otros: false,
    },
    vehiculos: [],
    observaciones: "",
  })

  useEffect(() => {
    const savedData = loadFormData()
    if (savedData) {
      setFormData(savedData)
      toast({
        title: "Datos recuperados",
        description: "Se han cargado los datos guardados anteriormente",
      })
    }
  }, [])

  useEffect(() => {
    const autoEnableNotifications = async () => {
      if (isSupported && Notification.permission === "default") {
        try {
          await subscribe()
        } catch (error) {
          console.log("Notificaciones no activadas:", error)
        }
      }
    }
    autoEnableNotifications()
  }, [isSupported, subscribe])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveFormData(formData)
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [formData])

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = (): boolean => {
    // SOLO CAMPOS REALMENTE ESENCIALES
    const requiredFields = [
      { field: "fecha", label: "Fecha" },
      { field: "numeroServicio", label: "Número de Servicio" },
      { field: "nombreApellidos", label: "Nombre del Paciente" },
    ]

    for (const { field, label } of requiredFields) {
      if (!formData[field as keyof FormData]) {
        toast({
          title: "Campo obligatorio",
          description: `${label} es obligatorio para continuar`,
          variant: "destructive",
        })
        return false
      }
    }

    // Validación adicional: al menos una dirección
    if (!formData.direccionOrigen && !formData.direccionDestino) {
      toast({
        title: "Información de traslado",
        description: "Debe especificar al menos la dirección de origen o destino",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    setIsSubmitting(true)

    try {
      if (isOnline) {
        // Generar Excel
        const excelBuffer = generateExcel(formData)
        
        try {
          // Intentar envío por Resend primero (con archivos adjuntos)
          const resendResult = await sendFormByResend(excelBuffer, formData)
          
          // También descargar como backup
          const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `emergencia_${formData.numeroServicio}_${new Date().toISOString().split("T")[0]}.xlsx`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          toast({
            title: "✅ Formulario enviado y descargado",
            description: `Formulario ${formData.numeroServicio} enviado por email con Excel adjunto y descargado como backup`,
          })
          clearFormData()
        } catch (resendError: any) {
          // Si falla Resend, solo descargar localmente
          const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `emergencia_${formData.numeroServicio}_${new Date().toISOString().split("T")[0]}.xlsx`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          toast({
            title: "⚠️ Email no disponible - Descargado localmente",
            description: `No se pudo enviar por email. Excel descargado correctamente. Error: ${resendError.message}`,
            variant: "destructive",
          })
        }
      } else {
        savePendingForm(formData)
        toast({
          title: "💾 Guardado offline",
          description: "El formulario se enviará automáticamente cuando vuelva la conexión",
        })
      }

      // Limpiar formulario
      setFormData({
        fecha: "",
        hora: "",
        numeroServicio: "",
        vehiculo: "",
        tecnico1: "",
        tecnico2: "",
        nombreApellidos: "",
        dni: "",
        telefono: "",
        posicion: "",
        direccionOrigen: "",
        localidadOrigen: "",
        direccionDestino: "",
        localidadDestino: "",
        modalidad: "",
        interviene: { policiaLocal: false, guardiaCivil: false, otros: false },
        vehiculos: [],
        observaciones: "",
      })
    } catch (error: any) {
      savePendingForm(formData)
      toast({
        title: "⚠️ Error de envío",
        description: "El formulario se ha guardado y se enviará cuando sea posible",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = () => {
    if (!validateForm()) return

    try {
      const excelBuffer = generateExcel(formData)
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `emergencia_${formData.numeroServicio}_${new Date().toISOString().split("T")[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "📥 Descarga completada",
        description: "El archivo Excel ha sido descargado correctamente",
      })
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Error al generar el archivo Excel",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-red-600">FORMULARIO DE EMERGENCIAS SANITARIAS</CardTitle>
            <CardDescription className="text-lg">
              Sistema de recogida de datos para servicios de emergencia
              <br />
              <span className="text-sm text-gray-600">Solo los campos marcados con * son obligatorios</span>
            </CardDescription>
          </CardHeader>
        </Card>

        <PendingForms />

        <div className="space-y-6">
          <DatosPrincipales data={formData} updateField={updateField} />

          <DatosPaciente data={formData} updateField={updateField} />

          <DatosTraslado data={formData} updateField={updateField} />

          <TipoAccidente data={formData} updateField={updateField} />

          <DatosVehiculos
            vehiculos={formData.vehiculos}
            onChange={(vehiculos) => updateField("vehiculos", vehiculos)}
          />

          <Observaciones
            observaciones={formData.observaciones}
            onChange={(observaciones) => updateField("observaciones", observaciones)}
          />

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isResendLoading}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
                >
                  {isSubmitting || isResendLoading ? "Procesando..." : isOnline ? "📧 Enviar Formulario" : "💾 Guardar Offline"}
                </Button>

                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 text-lg bg-transparent"
                >
                  📥 Descargar Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ConnectionStatus />
      
      {/* Enlace discreto al panel de administración */}
      <div className="text-center mt-8 pb-4">
        <a 
          href="/admin" 
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          title="Panel de administración"
        >
          ⚙️
        </a>
      </div>
      
      <Toaster />
    </div>
  )
}
