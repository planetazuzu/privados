# Sistema de Emergencias Sanitarias

Aplicación web para la recogida de datos en emergencias sanitarias, compatible con Vercel.

## Características

- ✅ Formulario dividido en secciones organizadas
- ✅ Generación automática de archivos Excel (.xlsx)
- ✅ Envío por email usando EmailJS
- ✅ Descarga local como backup
- ✅ Validación de campos obligatorios
- ✅ Interfaz responsiva con TailwindCSS
- ✅ Compatible con tablets y móviles
- ✅ Almacenamiento local para funcionalidad offline

## 🚀 **Funcionalidades PWA**

### Instalación
- ✅ **App instalable** - Se puede instalar como app nativa en dispositivos
- ✅ **Iconos optimizados** - Iconos para diferentes tamaños de pantalla
- ✅ **Splash screen** - Pantalla de carga personalizada

### Funcionalidad Offline
- ✅ **Cache inteligente** - Archivos estáticos cacheados para uso offline
- ✅ **Guardado automático** - Los datos se guardan automáticamente mientras escribes
- ✅ **Sincronización automática** - Los formularios se envían cuando vuelve la conexión
- ✅ **Indicadores de estado** - Muestra el estado de conexión y formularios pendientes
- ✅ **Gestión de formularios pendientes** - Lista y gestión de formularios no enviados

### Notificaciones
- ✅ **Notificaciones push** - Confirmación cuando se envían formularios pendientes
- ✅ **Estados visuales** - Indicadores claros del estado de conexión

## 📱 **Instalación como PWA**

### En Android (Chrome/Edge):
1. Abre la aplicación en el navegador
2. Toca el menú (⋮) y selecciona "Instalar app"
3. Confirma la instalación

### En iOS (Safari):
1. Abre la aplicación en Safari
2. Toca el botón de compartir (□↗)
3. Selecciona "Añadir a pantalla de inicio"

### En Desktop:
1. Abre la aplicación en Chrome/Edge
2. Busca el icono de instalación en la barra de direcciones
3. Haz clic en "Instalar"

## 🔄 **Funcionamiento Offline**

1. **Guardado automático**: Los datos se guardan cada segundo mientras escribes
2. **Envío diferido**: Si no hay conexión, los formularios se guardan para envío posterior
3. **Sincronización**: Cuando vuelve la conexión, se envían automáticamente
4. **Recuperación**: Si cierras la app, los datos se recuperan al abrirla
5. **Gestión visual**: Puedes ver y gestionar formularios pendientes

## 🛠 **Tecnologías PWA Añadidas**

- **Service Worker** - Cache y funcionalidad offline
- **Web App Manifest** - Instalación y configuración de app
- **Background Sync** - Sincronización en segundo plano
- **Local Storage** - Almacenamiento local de datos
- **Push Notifications** - Notificaciones de estado

## Configuración

### 1. EmailJS Setup

1. Crea una cuenta en [EmailJS](https://www.emailjs.com/)
2. Configura un servicio de email
3. Crea un template de email
4. Actualiza las constantes en `utils/excelUtils.ts`:
   \`\`\`typescript
   const serviceId = 'tu_service_id'
   const templateId = 'tu_template_id'
   const publicKey = 'tu_public_key'
   \`\`\`

### 2. Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. El proyecto se desplegará automáticamente
3. Configura las variables de entorno si es necesario

## 🔔 **Configuración de Notificaciones Push**

### **1. Claves VAPID Configuradas:**
\`\`\`bash
# ✅ Claves ya configuradas en el proyecto
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BAzvU8j4w9S0XxQhXK9K6rJZT6slE9JhN6Hxf6iF59fQYaA_9nH0PZK0eUcIUXm8vFqhLUiwPq8G8PMePpYQQF8
VAPID_PRIVATE_KEY=HXZfAjEiVgF1wVqQbshzKj3n9kdrQv6GHX9aRkBdPuY
\`\`\`

### **2. Configuración en Vercel:**
1. Ve a tu proyecto en Vercel Dashboard
2. Navega a Settings > Environment Variables
3. Añade las variables de entorno:
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`

### **3. Verificar Funcionamiento:**
- Usa el "Probador de Notificaciones" en la aplicación
- Activa las notificaciones en tu dispositivo
- Envía notificaciones de prueba
- Verifica las estadísticas de suscripciones

## Uso

1. Rellena todos los campos obligatorios (marcados con *)
2. Añade vehículos si es necesario (máximo 4)
3. Completa las observaciones
4. Haz clic en "Enviar Formulario" para enviar por email
5. Usa "Descargar Excel" como backup local

## Estructura del Proyecto

\`\`\`
├── app/
│   ├── page.tsx              # Página principal
│   └── layout.tsx            # Layout base
├── components/
│   ├── DatosPrincipales.tsx  # Sección datos principales
│   ├── DatosPaciente.tsx     # Sección datos paciente
│   ├── DatosTraslado.tsx     # Sección datos traslado
│   ├── TipoAccidente.tsx     # Sección tipo accidente
│   ├── DatosVehiculos.tsx    # Sección vehículos
│   └── Observaciones.tsx     # Sección observaciones
├── types/
│   └── formTypes.ts          # Tipos TypeScript
├── utils/
│   └── excelUtils.ts         # Utilidades Excel y Email
└── README.md
\`\`\`

## Tecnologías

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **TailwindCSS** - Estilos
- **shadcn/ui** - Componentes UI
- **SheetJS (xlsx)** - Generación Excel
- **EmailJS** - Envío de emails
- **Vercel** - Despliegue

## Funcionalidades Offline

La aplicación guarda automáticamente los datos en localStorage mientras se completa el formulario, permitiendo recuperar la información en caso de pérdida de conexión.
