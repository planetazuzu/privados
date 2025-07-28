const CACHE_NAME = "emergencias-v1.0.0"
const STATIC_CACHE = "emergencias-static-v1.0.0"
const DYNAMIC_CACHE = "emergencias-dynamic-v1.0.0"

// Archivos que se cachearán inmediatamente
const STATIC_FILES = [
  "/",
  "/manifest.json",
  "/icon-192.svg",
  "/icon-512.svg",
  "/placeholder-logo.png",
  "/_next/static/css/app/layout.css",
  "/_next/static/chunks/webpack.js",
  "/_next/static/chunks/main.js",
  "/_next/static/chunks/pages/_app.js",
]

// Instalar Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...")

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static files")
        return cache.addAll(STATIC_FILES)
      })
      .catch((error) => {
        console.log("Service Worker: Error caching static files", error)
      }),
  )

  self.skipWaiting()
})

// Activar Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...")

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log("Service Worker: Deleting old cache", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )

  self.clients.claim()
})

// Interceptar peticiones
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== "GET") return

  if (STATIC_FILES.some((file) => request.url.includes(file))) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request)
      }),
    )
    return
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        return caches.match(request).then((response) => {
          if (response) {
            return response
          }
          if (request.headers.get("accept").includes("text/html")) {
            return caches.match("/")
          }
        })
      }),
  )
})

// 🔔 MANEJO DE NOTIFICACIONES PUSH
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push notification received")

  let notificationData = {
    title: "Emergencias Sanitarias",
    body: "Nueva notificación",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: "default",
    data: {},
    actions: [],
    requireInteraction: false,
  }

  if (event.data) {
    try {
      const pushData = event.data.json()
      notificationData = { ...notificationData, ...pushData }
    } catch (error) {
      console.log("Error parsing push data:", error)
      notificationData.body = event.data.text()
    }
  }

  // Configurar acciones según el tipo de notificación
  switch (notificationData.type) {
    case "form_sent":
      notificationData.actions = [
        { action: "view", title: "Ver detalles", icon: "/icon-192.png" },
        { action: "close", title: "Cerrar", icon: "/icon-192.png" },
      ]
      notificationData.requireInteraction = true
      break

    case "form_pending":
      notificationData.actions = [
        { action: "retry", title: "Reintentar", icon: "/icon-192.png" },
        { action: "view", title: "Ver formulario", icon: "/icon-192.png" },
      ]
      break

    case "system_alert":
      notificationData.requireInteraction = true
      notificationData.actions = [{ action: "acknowledge", title: "Entendido", icon: "/icon-192.png" }]
      break

    case "reminder":
      notificationData.actions = [
        { action: "open", title: "Abrir app", icon: "/icon-192.png" },
        { action: "dismiss", title: "Descartar", icon: "/icon-192.png" },
      ]
      break
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: notificationData.actions,
      requireInteraction: notificationData.requireInteraction,
      silent: false,
      vibrate: [200, 100, 200],
      timestamp: Date.now(),
    }),
  )
})

// Manejar clics en notificaciones
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event)

  const notification = event.notification
  const action = event.action
  const data = notification.data || {}

  notification.close()

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      })

      // Buscar si ya hay una ventana abierta
      const existingClient = clients.find((client) => client.url.includes(self.location.origin))

      switch (action) {
        case "view":
        case "open":
          if (existingClient) {
            existingClient.focus()
            existingClient.postMessage({
              type: "NOTIFICATION_ACTION",
              action: "view",
              data: data,
            })
          } else {
            self.clients.openWindow("/")
          }
          break

        case "retry":
          if (existingClient) {
            existingClient.focus()
            existingClient.postMessage({
              type: "NOTIFICATION_ACTION",
              action: "retry",
              data: data,
            })
          } else {
            self.clients.openWindow("/")
          }
          break

        case "acknowledge":
          // Marcar como leída en el servidor
          fetch("/api/notifications/acknowledge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notificationId: data.id }),
          })
          break

        case "dismiss":
        case "close":
          // No hacer nada, solo cerrar
          break

        default:
          // Clic en la notificación sin acción específica
          if (existingClient) {
            existingClient.focus()
          } else {
            self.clients.openWindow("/")
          }
          break
      }
    })(),
  )
})

// Manejar cierre de notificaciones
self.addEventListener("notificationclose", (event) => {
  console.log("Service Worker: Notification closed", event)

  const notification = event.notification
  const data = notification.data || {}

  // Registrar que la notificación fue cerrada
  if (data.trackClose) {
    fetch("/api/notifications/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notificationId: data.id,
        action: "closed",
        timestamp: Date.now(),
      }),
    })
  }
})

// Manejar sincronización en segundo plano
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered")

  if (event.tag === "sync-emergency-forms") {
    event.waitUntil(syncEmergencyForms())
  }
})

// Función para sincronizar formularios pendientes
async function syncEmergencyForms() {
  try {
    const pendingForms = await getPendingForms()

    for (const form of pendingForms) {
      try {
        await sendFormToServer(form)
        await removePendingForm(form.id)

        // Enviar notificación de éxito
        self.registration.showNotification("Formulario enviado", {
          body: `El formulario ${form.numeroServicio} se ha enviado correctamente`,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          tag: "form-sent",
          data: { formId: form.id, type: "form_sent" },
          actions: [{ action: "view", title: "Ver detalles" }],
        })
      } catch (error) {
        console.log("Error sending form:", error)
      }
    }
  } catch (error) {
    console.log("Error in background sync:", error)
  }
}

// Funciones auxiliares para IndexedDB
async function getPendingForms() {
  const stored = localStorage.getItem("pendingEmergencyForms")
  return stored ? JSON.parse(stored) : []
}

async function removePendingForm(formId) {
  const forms = await getPendingForms()
  const filtered = forms.filter((form) => form.id !== formId)
  localStorage.setItem("pendingEmergencyForms", JSON.stringify(filtered))
}

async function sendFormToServer(formData) {
  const response = await fetch("/api/emergency-form", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })

  if (!response.ok) {
    throw new Error("Failed to send form")
  }

  return response.json()
}
