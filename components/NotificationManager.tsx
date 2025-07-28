"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Bell, BellOff, Send } from "lucide-react"
import { usePushNotifications } from "@/hooks/usePushNotifications"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function NotificationManager() {
  const { isSupported, isSubscribed, isLoading, error, subscribe, unsubscribe, sendTestNotification } =
    usePushNotifications()

  const [notificationStats, setNotificationStats] = useState({
    activeSubscriptions: 0,
    totalSubscriptions: 0,
  })

  useEffect(() => {
    // Cargar estadísticas de notificaciones
    const loadStats = async () => {
      try {
        const response = await fetch("/api/notifications/send")
        if (response.ok) {
          const stats = await response.json()
          setNotificationStats(stats)
        }
      } catch (error) {
        console.log("Error loading notification stats:", error)
      }
    }

    loadStats()
  }, [isSubscribed])

  // Escuchar mensajes del Service Worker
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "NOTIFICATION_ACTION") {
        console.log("Acción de notificación recibida:", event.data)
        // Manejar acciones específicas aquí
      }
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", handleMessage)
      return () => {
        navigator.serviceWorker.removeEventListener("message", handleMessage)
      }
    }
  }, [])

  if (!isSupported) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-600 flex items-center gap-2">
            <BellOff className="w-5 h-5" />
            Notificaciones Push
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Las notificaciones push no están soportadas en este navegador. Para recibir notificaciones, usa Chrome,
              Firefox, Safari o Edge.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-blue-600 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notificaciones Push
          {isSubscribed && <Badge className="bg-green-100 text-green-800">Activas</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Recibir notificaciones</h4>
              <p className="text-sm text-gray-600">
                Recibe notificaciones sobre el estado de tus formularios y alertas del sistema
              </p>
            </div>
            <Switch
              checked={isSubscribed}
              onCheckedChange={isSubscribed ? unsubscribe : subscribe}
              disabled={isLoading}
            />
          </div>

          {isSubscribed && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estado de la suscripción:</span>
                <Badge className="bg-green-100 text-green-800">Activa</Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={sendTestNotification}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Send className="w-4 h-4" />
                  Enviar prueba
                </Button>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>• Recibirás notificaciones cuando se envíen formularios</p>
                <p>• Se te notificará sobre formularios pendientes</p>
                <p>• Recibirás alertas importantes del sistema</p>
              </div>
            </div>
          )}

          {!isSubscribed && (
            <div className="text-sm text-gray-600">
              <p>Las notificaciones te ayudarán a:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Confirmar el envío exitoso de formularios</li>
                <li>Saber cuando hay formularios pendientes</li>
                <li>Recibir alertas importantes del sistema</li>
                <li>Mantenerte informado sobre el estado de la aplicación</li>
              </ul>
            </div>
          )}

          {notificationStats.activeSubscriptions > 0 && (
            <div className="pt-3 border-t">
              <div className="text-xs text-gray-500">
                <p>Dispositivos conectados: {notificationStats.activeSubscriptions}</p>
                <p>Total de suscripciones: {notificationStats.totalSubscriptions}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
