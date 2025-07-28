import { type NextRequest, NextResponse } from "next/server"
import webpush from "web-push"

// Configurar VAPID keys con las claves reales
const vapidKeys = {
  publicKey:
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    "BAzvU8j4w9S0XxQhXK9K6rJZT6slE9JhN6Hxf6iF59fQYaA_9nH0PZK0eUcIUXm8vFqhLUiwPq8G8PMePpYQQF8",
  privateKey: process.env.VAPID_PRIVATE_KEY || "HXZfAjEiVgF1wVqQbshzKj3n9kdrQv6GHX9aRkBdPuY",
}

webpush.setVapidDetails("mailto:admin@emergencias.com", vapidKeys.publicKey, vapidKeys.privateKey)

// Obtener suscripciones (en producción desde base de datos)
const subscriptions: any[] = []

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      body,
      type = "default",
      data = {},
      targetUserId,
      targetSubscriptionId,
      requireInteraction = false,
    } = await request.json()

    if (!title || !body) {
      return NextResponse.json({ error: "Title and body are required" }, { status: 400 })
    }

    // Filtrar suscripciones objetivo
    let targetSubscriptions = subscriptions.filter((sub) => sub.isActive)

    if (targetUserId) {
      targetSubscriptions = targetSubscriptions.filter((sub) => sub.userId === targetUserId)
    }

    if (targetSubscriptionId) {
      targetSubscriptions = targetSubscriptions.filter((sub) => sub.id === targetSubscriptionId)
    }

    if (targetSubscriptions.length === 0) {
      return NextResponse.json({ error: "No active subscriptions found" }, { status: 404 })
    }

    // Preparar payload de notificación
    const notificationPayload = {
      title,
      body,
      type,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: {
        ...data,
        id: Date.now().toString(),
        timestamp: Date.now(),
        type,
      },
      requireInteraction,
    }

    // Enviar notificaciones
    const results = await Promise.allSettled(
      targetSubscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(sub.subscription, JSON.stringify(notificationPayload))
          return { subscriptionId: sub.id, status: "sent" }
        } catch (error: any) {
          console.log(`Error enviando a ${sub.id}:`, error.message)

          // Si la suscripción es inválida, marcarla como inactiva
          if (error.statusCode === 410 || error.statusCode === 404) {
            sub.isActive = false
          }

          return { subscriptionId: sub.id, status: "failed", error: error.message }
        }
      }),
    )

    const successful = results.filter(
      (result) => result.status === "fulfilled" && result.value.status === "sent",
    ).length

    const failed = results.filter((result) => result.status === "fulfilled" && result.value.status === "failed").length

    return NextResponse.json({
      success: true,
      sent: successful,
      failed,
      total: targetSubscriptions.length,
      results: results.map((result) => (result.status === "fulfilled" ? result.value : { status: "error" })),
    })
  } catch (error) {
    console.error("Error enviando notificaciones:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// Endpoint para obtener estadísticas
export async function GET() {
  const activeSubscriptions = subscriptions.filter((sub) => sub.isActive).length
  const totalSubscriptions = subscriptions.length

  return NextResponse.json({
    activeSubscriptions,
    totalSubscriptions,
    inactiveSubscriptions: totalSubscriptions - activeSubscriptions,
  })
}
