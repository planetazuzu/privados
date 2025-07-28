#!/bin/bash

echo "🚀 Preparando aplicación para producción..."

# Limpiar instalaciones previas
echo "🧹 Limpiando archivos temporales..."
rm -rf node_modules
rm -rf .next
rm -rf dist

# Instalar dependencias
echo "📦 Instalando dependencias..."
pnpm install

# Verificar variables de entorno
echo "🔧 Verificando configuración..."
if [ ! -f .env.local ]; then
    echo "⚠️  Archivo .env.local no encontrado"
    echo "📋 Copiando .env.example como plantilla..."
    cp .env.example .env.local
    echo "✅ Edita .env.local con tus credenciales antes de continuar"
fi

# Construir aplicación
echo "🔨 Construyendo aplicación para producción..."
pnpm build

echo "✅ ¡Aplicación lista para despliegue!"
echo ""
echo "📁 Archivos generados en .next/"
echo "🚀 Para iniciar: pnpm start"
echo "🌐 Para desarrollo: pnpm dev"
