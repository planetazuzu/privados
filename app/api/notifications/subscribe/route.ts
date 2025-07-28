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

// Almacenamiento temporal de suscripciones (en producción usar base de datos)
let subscriptions: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { subscription, userId, deviceInfo } = await request.json()

    if (!subscription) {
      return NextResponse.json({ error: "Subscription is required" }, { status: 400 })
    }

    // Verificar que la suscripción es válida
    const isValidSubscription =
      subscription.endpoint && subscription.keys && subscription.keys.p256dh && subscription.keys.auth

    if (!isValidSubscription) {
      return NextResponse.json({ error: "Invalid subscription format" }, { status: 400 })
    }

    // Guardar suscripción (en producción guardar en base de datos)
    const subscriptionData = {
      id: Date.now().toString(),
      subscription,
      userId: userId || "anonymous",
      deviceInfo: deviceInfo || {},
      createdAt: new Date().toISOString(),
      isActive: true,
    }

    // Eliminar suscripciones duplicadas del mismo endpoint
    subscriptions = subscriptions.filter((sub) => sub.subscription.endpoint !== subscription.endpoint)

    // Añadir nueva suscripción
    subscriptions.push(subscriptionData)

    console.log(`Nueva suscripción registrada: ${subscriptionData.id}`)

    // Enviar notificación de bienvenida
    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: "🔔 ¡Notificaciones activadas!",
          body: "Recibirás notificaciones sobre el estado de tus formularios de emergencia",
          type: "welcome",
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          data: { subscriptionId: subscriptionData.id },
        }),
      )
    } catch (pushError) {
      console.log("Error enviando notificación de bienvenida:", pushError)
    }

    return NextResponse.json({
      success: true,
      subscriptionId: subscriptionData.id,
      message: "Suscripción registrada correctamente",
    })
  } catch (error) {
    console.error("Error registrando suscripción:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    subscriptions: subscriptions.length,
    vapidPublicKey: vapidKeys.publicKey,
  })
}

export async function DELETE(request: NextRequest) {
  try {
    const { endpoint } = await request.json()

    if (!endpoint) {
      return NextResponse.json({ error: "Endpoint is required" }, { status: 400 })
    }

    // Eliminar suscripción
    const initialLength = subscriptions.length
    subscriptions = subscriptions.filter((sub) => sub.subscription.endpoint !== endpoint)

    const removed = initialLength - subscriptions.length

    return NextResponse.json({
      success: true,
      removed,
      message: removed > 0 ? "Suscripción eliminada" : "Suscripción no encontrada",
    })
  } catch (error) {
    console.error("Error eliminando suscripción:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
