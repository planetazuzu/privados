"use client"

import { useState, useEffect } from "react"

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    // Verificar estado inicial
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      if (wasOffline) {
        // Intentar sincronizar datos pendientes
        if ("serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype) {
          navigator.serviceWorker.ready.then((registration) => {
            return registration.sync.register("sync-emergency-forms")
          })
        }
        setWasOffline(false)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [wasOffline])

  return { isOnline, wasOffline }
}
