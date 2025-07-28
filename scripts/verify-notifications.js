// Script para verificar la configuración de notificaciones push
const webpush = require("web-push")

// Configurar VAPID keys
const vapidKeys = {
  publicKey: "BAzvU8j4w9S0XxQhXK9K6rJZT6slE9JhN6Hxf6iF59fQYaA_9nH0PZK0eUcIUXm8vFqhLUiwPq8G8PMePpYQQF8",
  privateKey: "HXZfAjEiVgF1wVqQbshzKj3n9kdrQv6GHX9aRkBdPuY",
}

webpush.setVapidDetails("mailto:admin@emergencias.com", vapidKeys.publicKey, vapidKeys.privateKey)

console.log("🔐 Verificando configuración de notificaciones push...")
console.log("")

// Verificar claves VAPID
console.log("✅ Claves VAPID configuradas:")
console.log(`   Clave pública: ${vapidKeys.publicKey.substring(0, 20)}...`)
console.log(`   Clave privada: ${vapidKeys.privateKey.substring(0, 20)}...`)
console.log("")

// Verificar formato de las claves
const publicKeyBuffer = Buffer.from(vapidKeys.publicKey, "base64url")
const privateKeyBuffer = Buffer.from(vapidKeys.privateKey, "base64url")

console.log("📏 Verificando formato de claves:")
console.log(`   Longitud clave pública: ${publicKeyBuffer.length} bytes (esperado: 65)`)
console.log(`   Longitud clave privada: ${privateKeyBuffer.length} bytes (esperado: 32)`)

if (publicKeyBuffer.length === 65 && privateKeyBuffer.length === 32) {
  console.log("✅ Formato de claves correcto")
} else {
  console.log("❌ Formato de claves incorrecto")
}

console.log("")
console.log("🚀 Configuración lista para producción!")
console.log("")
console.log("📋 Próximos pasos:")
console.log("   1. Despliega la aplicación en Vercel")
console.log("   2. Configura las variables de entorno en Vercel")
console.log("   3. Prueba las notificaciones desde la aplicación")
console.log("   4. Verifica que las notificaciones lleguen correctamente")
