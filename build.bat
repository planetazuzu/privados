@echo off
echo 🚀 Preparando aplicación para producción...

REM Limpiar instalaciones previas
echo 🧹 Limpiando archivos temporales...
if exist node_modules rmdir /s /q node_modules
if exist .next rmdir /s /q .next
if exist dist rmdir /s /q dist

REM Instalar dependencias
echo 📦 Instalando dependencias...
call pnpm install

REM Verificar variables de entorno
echo 🔧 Verificando configuración...
if not exist .env.local (
    echo ⚠️  Archivo .env.local no encontrado
    echo 📋 Copiando .env.example como plantilla...
    copy .env.example .env.local
    echo ✅ Edita .env.local con tus credenciales antes de continuar
)

REM Construir aplicación
echo 🔨 Construyendo aplicación para producción...
call pnpm build

echo ✅ ¡Aplicación lista para despliegue!
echo.
echo 📁 Archivos generados en .next/
echo 🚀 Para iniciar: pnpm start
echo 🌐 Para desarrollo: pnpm dev
pause
