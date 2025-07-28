"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Verificar si ya está instalada
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Escuchar evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    // Escuchar cuando se instala
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      console.log("Usuario aceptó instalar la PWA")
    } else {
      console.log("Usuario rechazó instalar la PWA")
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Guardar en localStorage que el usuario desestimó la instalación
    localStorage.setItem("pwa-install-dismissed", "true")
  }

  // No mostrar si ya está instalada o fue desestimada
  if (
    isInstalled ||
    !showInstallPrompt ||
    localStorage.getItem("pwa-install-dismissed") === "true"
  ) {
    return null
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 border-blue-200 bg-blue-50 shadow-lg md:left-auto md:right-4 md:w-96">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📱</div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900">¡Instala la App!</h3>
            <p className="text-sm text-blue-700 mb-3">
              Instala la aplicación en tu dispositivo para acceso rápido y uso offline.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleInstallClick} size="sm" className="bg-blue-600 hover:bg-blue-700">
                📥 Instalar
              </Button>
              <Button onClick={handleDismiss} variant="outline" size="sm">
                Ahora no
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
