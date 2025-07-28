"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Send, TestTube, CheckCircle, AlertCircle, Clock, Bell } from "lucide-react"

export default function NotificationTester() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [testData, setTestData] = useState({
    title: "Prueba de Notificación",
    body: "Esta es una notificación de prueba del sistema de emergencias",
    type: "test",
  })

  const notificationTypes = [
    { value: "test", label: "Prueba", icon: TestTube },
    { value: "form_sent", label: "Formulario Enviado", icon: CheckCircle },
    { value: "form_pending", label: "Formulario Pendiente", icon: Clock },
    { value: "system_alert", label: "Alerta del Sistema", icon: AlertCircle },
    { value: "reminder", label: "Recordatorio", icon: Bell },
  ]

  const predefinedMessages = {
    test: {
      title: "Prueba de Notificación",
      body: "Esta es una notificación de prueba del sistema de emergencias",
    },
    form_sent: {
      title: "Formulario enviado correctamente",
      body: "El formulario de emergencia #12345 ha sido enviado exitosamente",
    },
    form_pending: {
      title: "Formulario pendiente de envío",
      body: "Tienes 1 formulario pendiente que se enviará cuando vuelva la conexión",
    },
    system_alert: {
      title: "Alerta del Sistema",
      body: "Actualización importante: Nueva versión de la aplicación disponible",
    },
    reminder: {
      title: "Recordatorio",
      body: "No olvides completar los formularios pendientes",
    },
  }

  const handleTypeChange = (type: string) => {
    setTestData({
      ...testData,
      type,
      ...predefinedMessages[type as keyof typeof predefinedMessages],
    })
  }

  const sendTestNotification = async () => {
    if (!testData.title || !testData.body) {
      toast({
        title: "Error",
        description: "El título y el mensaje son obligatorios",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: testData.title,
          body: testData.body,
          type: testData.type,
          data: {
            test: true,
            timestamp: Date.now(),
            source: "notification-tester",
          },
          requireInteraction: testData.type === "system_alert",
        }),
      })

      if (!response.ok) {
        throw new Error("Error enviando notificación")
      }

      const result = await response.json()

      toast({
        title: "Notificación enviada",
        description: `Se enviaron ${result.sent} notificaciones correctamente`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la notificación de prueba",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendBulkNotifications = async () => {
    setIsLoading(true)

    try {
      const notifications = [
        {
          title: "Sistema iniciado",
          body: "El sistema de emergencias está funcionando correctamente",
          type: "system_alert",
        },
        {
          title: "Formulario de prueba",
          body: "Formulario #TEST001 procesado exitosamente",
          type: "form_sent",
        },
        {
          title: "Recordatorio diario",
          body: "Revisa los formularios pendientes del día",
          type: "reminder",
        },
      ]

      for (const notification of notifications) {
        await fetch("/api/notifications/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notification),
        })

        // Esperar 2 segundos entre notificaciones
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      toast({
        title: "Notificaciones enviadas",
        description: `Se enviaron ${notifications.length} notificaciones de prueba`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Error enviando notificaciones múltiples",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-purple-600 flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Probador de Notificaciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="notification-type">Tipo de Notificación</Label>
            <Select value={testData.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {notificationTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notification-title">Título</Label>
            <Input
              id="notification-title"
              value={testData.title}
              onChange={(e) => setTestData({ ...testData, title: e.target.value })}
              placeholder="Título de la notificación"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="notification-body">Mensaje</Label>
            <Textarea
              id="notification-body"
              value={testData.body}
              onChange={(e) => setTestData({ ...testData, body: e.target.value })}
              placeholder="Contenido de la notificación"
              className="mt-1 min-h-[80px]"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={sendTestNotification} disabled={isLoading} className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              {isLoading ? "Enviando..." : "Enviar Prueba"}
            </Button>

            <Button
              onClick={sendBulkNotifications}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Bell className="w-4 h-4" />
              Enviar Múltiples
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Las notificaciones solo se envían a dispositivos suscritos</p>
            <p>• Asegúrate de tener las notificaciones activadas</p>
            <p>• Las notificaciones múltiples se envían con 2 segundos de intervalo</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
