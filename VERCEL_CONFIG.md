# Emergency Form - Variables de Entorno para Vercel

## ✅ REQUERIDAS PARA FUNCIONAMIENTO COMPLETO

### 1. Email Service (Resend)
```
RESEND_API_KEY=re_tu_api_key_aqui
```
- **Obtener en:** https://resend.com/api-keys
- **Función:** Envío de emails de emergencia
- **Fallback:** Sin esta variable, se salta el envío de email y se genera solo el Excel

### 2. Email de Destino
```
EMERGENCY_EMAIL=tu-email@hospital.com
```
- **Función:** Email donde se reciben los formularios de emergencia
- **Default:** emergencias@hospital.com

### 3. Autenticación Admin
```
ADMIN_PASSWORD=tu-password-seguro
```
- **Función:** Acceso al panel de administración
- **Default:** emergencias2025

## 🔧 OPCIONALES (Para notificaciones push)

### VAPID Keys para Push Notifications
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=tu-vapid-public-key
VAPID_PRIVATE_KEY=tu-vapid-private-key
```

## 📋 CONFIGURACIÓN EN VERCEL

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Añade las variables una por una:

```
Name: RESEND_API_KEY
Value: re_tu_api_key_aqui
Environment: Production, Preview, Development
```

```
Name: EMERGENCY_EMAIL  
Value: tu-email@hospital.com
Environment: Production, Preview, Development
```

```
Name: ADMIN_PASSWORD
Value: tu-password-seguro
Environment: Production, Preview, Development
```

## ⚠️ COMPORTAMIENTO SIN CONFIGURACIÓN

**Sin RESEND_API_KEY:**
- ✅ La aplicación funciona
- ✅ Se genera Excel con datos
- ❌ No se envía email
- ℹ️ Mensaje: "Email no enviado (RESEND_API_KEY no configurado)"

**Sin EMERGENCY_EMAIL:**
- ✅ Usa default: emergencias@hospital.com

**Sin ADMIN_PASSWORD:**
- ✅ Usa default: emergencias2025

## 🚀 DEPLOYMENT

La aplicación está diseñada para funcionar **sin errores** incluso sin configuración completa, proporcionando un fallback robusto para todos los servicios.
