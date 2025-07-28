# Variables de Entorno para Vercel

## Variables Obligatorias para el despliegue:

# Sistema de Email Principal (Resend)
RESEND_API_KEY=re_tu_api_key_aqui

# Sistema de Email Secundario (EmailJS) - Opcional pero recomendado
NEXT_PUBLIC_EMAILJS_SERVICE_ID=tu_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=tu_template_id  
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=tu_public_key

# Autenticación Admin - Opcional
ADMIN_PASSWORD=tu_password_admin

# Notificaciones Push - Opcional
NEXT_PUBLIC_VAPID_PUBLIC_KEY=tu_vapid_public_key
VAPID_PRIVATE_KEY=tu_vapid_private_key

## Instrucciones para Vercel:

1. Ve a tu proyecto en vercel.com
2. Navega a Settings > Environment Variables
3. Añade cada variable una por una
4. Para Production, Preview y Development
5. Redespliega el proyecto

## Mínimo requerido para que funcione:
Solo necesitas RESEND_API_KEY para que la aplicación se construya correctamente.
Las demás variables son opcionales y mejorarán la funcionalidad.
