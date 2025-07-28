"use client"

import { useOffline } from "@/hooks/useOffline"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wifi, WifiOff, Clock } from "lucide-react"
import { getPendingForms } from "@/utils/offlineStorage"
import { useEffect, useState } from "react"

export default function ConnectionStatus() {
  const { isOnline, wasOffline } = useOffline()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    const updatePendingCount = () => {
      const pending = getPendingForms()
      setPendingCount(pending.length)
    }

    updatePendingCount()

    // Actualizar cada 5 segundos
    const interval = setInterval(updatePendingCount, 5000)

    return () => clearInterval(interval)
  }, [isOnline])

  if (isOnline && !wasOffline && pendingCount === 0) {
    return null // No mostrar nada si está online y no hay problemas
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {!isOnline && (
        <Alert className="mb-2 border-orange-200 bg-orange-50">
          <WifiOff className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Sin conexión</strong> - Los datos se guardan localmente y se enviarán cuando vuelva la conexión.
          </AlertDescription>
        </Alert>
      )}

      {isOnline && wasOffline && (
        <Alert className="mb-2 border-green-200 bg-green-50">
          <Wifi className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Conexión restaurada</strong> - Sincronizando datos pendientes...
          </AlertDescription>
        </Alert>
      )}

      {pendingCount > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>
              {pendingCount} formulario{pendingCount > 1 ? "s" : ""} pendiente{pendingCount > 1 ? "s" : ""}
            </strong>{" "}
            de envío
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
