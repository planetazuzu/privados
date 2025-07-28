"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PWAStatus() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [swRegistered, setSwRegistered] = useState(false)

  useEffect(() => {
    // Verificar si está instalada como PWA
    const checkInstalled = () => {
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes("android-app://")
      )
    }

    setIsInstalled(checkInstalled())

    // Verificar estado online/offline
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    // Verificar Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        setSwRegistered(!!registration)
      })
    }

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📱 Estado de la PWA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between">
            <span>Instalación:</span>
            <Badge variant={isInstalled ? "default" : "secondary"}>
              {isInstalled ? "✅ Instalada" : "📱 No instalada"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Conexión:</span>
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "🌐 Online" : "📴 Offline"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Service Worker:</span>
            <Badge variant={swRegistered ? "default" : "secondary"}>
              {swRegistered ? "🔧 Activo" : "❌ No registrado"}
            </Badge>
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            💡 <strong>Tip:</strong> Para instalar la app, busca la opción "Instalar" o "Añadir a pantalla de inicio" en el menú de tu navegador.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
