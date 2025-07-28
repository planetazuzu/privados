# 🚑 Sistema de Emergencias Sanitarias

Aplicación web progresiva (PWA) para la gestión de formularios de emergencias sanitarias con funcionalidad offline completa.

## ✨ Características Principales

### 📝 Sistema de Formularios
- ✅ Formulario dividido en secciones organizadas
- ✅ Validación en tiempo real de campos obligatorios
- ✅ Interfaz responsiva optimizada para tablets y móviles
- ✅ Guardado automático mientras escribes

### 📧 Sistema Híbrido de Envío
- ✅ **Resend** (principal) - Con archivos Excel adjuntos
- ✅ **EmailJS** (respaldo) - Cuando Resend no está disponible
- ✅ **Descarga local** - Como último recurso siempre disponible
- ✅ Reintentos automáticos con diferentes métodos

### 📊 Gestión de Datos
- ✅ Generación automática de archivos Excel (.xlsx)
- ✅ Exportación de datos completa
- ✅ Almacenamiento local seguro

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
## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- pnpm (recomendado) o npm

### Instalación Local
```bash
# Clonar el repositorio
git clone [URL-DEL-REPOSITORIO]
cd emergency-form

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en desarrollo
pnpm dev
```

### Variables de Entorno Requeridas
```env
# Sistema de Email Principal (Resend)
RESEND_API_KEY=tu_api_key_resend

# Sistema de Email Secundario (EmailJS)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=tu_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=tu_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=tu_public_key

# Autenticación Admin
ADMIN_PASSWORD=tu_password_admin

# Notificaciones Push (Opcional)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=tu_vapid_public_key
VAPID_PRIVATE_KEY=tu_vapid_private_key
```

## 🚀 Despliegue

### Opción 1: Vercel (Recomendado)
1. Fork/clona este repositorio
2. Conecta tu cuenta de Vercel con GitHub
3. Importa el proyecto en Vercel
4. Configura las variables de entorno
5. Despliega automáticamente

### Opción 2: Netlify
1. Build command: `pnpm build`
2. Publish directory: `.next`
3. Configura variables de entorno

### Opción 3: VPS/Servidor Propio
```bash
# Construir para producción
pnpm build

# Iniciar servidor
pnpm start
```

## 📱 Uso

1. **Formulario Principal**: Completa todas las secciones obligatorias
2. **Envío Automático**: El sistema intentará enviar por email automáticamente
3. **Respaldo Local**: Siempre disponible la opción de descarga Excel
4. **Modo Offline**: Los formularios se guardan automáticamente offline
5. **Panel Admin**: Acceso a estadísticas y configuración (ruta `/admin`)

## 🏗️ Estructura del Proyecto

```
emergency-form/
├── app/                      # App Router (Next.js 14)
│   ├── page.tsx             # Formulario principal
│   ├── layout.tsx           # Layout base con PWA
│   ├── admin/               # Panel de administración
│   └── api/                 # API Routes
│       ├── send-emergency-email/  # Envío con Resend
│       ├── admin/           # Autenticación
│       └── notifications/   # Sistema de notificaciones
├── components/              # Componentes React
│   ├── AdminLogin.tsx       # Autenticación
│   ├── PWAInstallPrompt.tsx # Instalación PWA
│   ├── ConnectionStatus.tsx # Estado de conexión
│   ├── form-sections/       # Secciones del formulario
│   └── ui/                  # Componentes shadcn/ui
├── hooks/                   # Custom hooks
│   ├── useResendEmail.ts    # Email con Resend
│   ├── useEmailJS.ts        # Email con EmailJS
│   ├── useOffline.ts        # Detección offline
│   └── usePushNotifications.ts # Notificaciones
├── types/                   # Tipos TypeScript
├── utils/                   # Utilidades
│   ├── excelUtils.ts        # Generación Excel
│   └── offlineStorage.ts    # Almacenamiento offline
├── public/                  # Archivos estáticos PWA
│   ├── manifest.json        # Manifiesto PWA
│   ├── sw.js               # Service Worker
│   └── icons/              # Iconos PWA
└── scripts/                # Scripts de utilidad
```

## 🔧 Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Email**: Resend, EmailJS
- **Excel**: SheetJS (xlsx)
- **PWA**: Service Worker, Web App Manifest
- **Offline**: IndexedDB, LocalStorage
- **Notifications**: Web Push API
- **Build**: pnpm, Turbopack
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
