"use client"

import { useState, useEffect, useCallback } from "react"

interface PushSubscriptionState {
  isSupported: boolean
  isSubscribed: boolean
  isLoading: boolean
  subscription: PushSubscription | null
  error: string | null
}

export function usePushNotifications() {
  const [state, setState] = useState<PushSubscriptionState>({
    isSupported: false,
    isSubscribed: false,
    isLoading: true,
    subscription: null,
    error: null,
  })

  // Verificar soporte y estado inicial
  useEffect(() => {
    const checkSupport = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setState((prev) => ({
          ...prev,
          isSupported: false,
          isLoading: false,
          error: "Las notificaciones push no están soportadas en este navegador",
        }))
        return
      }

      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()

        setState((prev) => ({
          ...prev,
          isSupported: true,
          isSubscribed: !!subscription,
          subscription,
          isLoading: false,
        }))
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isSupported: true,
          isLoading: false,
          error: "Error verificando el estado de las notificaciones",
        }))
      }
    }

    checkSupport()
  }, [])

  // Suscribirse a notificaciones push (silenciosamente)
  const subscribe = useCallback(async () => {
    if (!state.isSupported) {
      return false
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Solicitar permiso silenciosamente
      const permission = await Notification.requestPermission()

      if (permission !== "granted") {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Permiso de notificaciones denegado",
        }))
        return false
      }

      // Obtener clave pública VAPID
      const vapidResponse = await fetch("/api/notifications/subscribe")
      const { vapidPublicKey } = await vapidResponse.json()

      // Crear suscripción
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      // Enviar suscripción al servidor
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          userId: localStorage.getItem("userId") || `user_${Date.now()}`,
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Error registrando suscripción en el servidor")
      }

      setState((prev) => ({
        ...prev,
        isSubscribed: true,
        subscription,
        isLoading: false,
      }))

      // Guardar ID de usuario si no existe
      if (!localStorage.getItem("userId")) {
        localStorage.setItem("userId", `user_${Date.now()}`)
      }

      return true
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }))

      return false
    }
  }, [state.isSupported])

  // Desuscribirse de notificaciones push
  const unsubscribe = useCallback(async () => {
    if (!state.subscription) return false

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Desuscribirse localmente
      await state.subscription.unsubscribe()

      // Notificar al servidor
      await fetch("/api/notifications/subscribe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: state.subscription.endpoint,
        }),
      })

      setState((prev) => ({
        ...prev,
        isSubscribed: false,
        subscription: null,
        isLoading: false,
      }))

      return true
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }))

      return false
    }
  }, [state.subscription])

  // Enviar notificación de prueba
  const sendTestNotification = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Notificación de prueba",
          body: "Esta es una notificación de prueba del sistema de emergencias",
          type: "test",
          data: { test: true },
        }),
      })

      if (!response.ok) {
        throw new Error("Error enviando notificación de prueba")
      }

      return true
    } catch (error) {
      return false
    }
  }, [])

  return {
    ...state,
    subscribe,
    unsubscribe,
    sendTestNotification,
  }
}

// Función auxiliar para convertir clave VAPID
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
