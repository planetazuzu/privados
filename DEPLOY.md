# 🚀 GUÍA DE DESPLIEGUE - Sistema de Emergencias Sanitarias

## 📋 Requisitos Previos

- ✅ Node.js 18+ instalado
- ✅ pnpm o npm instalado
- ✅ Git configurado
- ✅ **EmailJS eliminado** (sin dependencias problemáticas) ✨

---

## 🥇 OPCIÓN 1: VERCEL (Recomendado - Gratis)

### Paso 1: Preparar repositorio
```bash
# En tu máquina local
cd emergency-form
git init
git add .
git commit -m "Initial commit"
```

### Paso 2: Subir a GitHub
1. Crea un repositorio en GitHub
2. Conecta tu proyecto:
```bash
git remote add origin https://github.com/tu-usuario/emergency-form.git
git push -u origin main
```

### Paso 3: Desplegar en Vercel
1. Ve a https://vercel.com
2. Conecta tu cuenta GitHub
3. Importa tu repositorio
4. **¡Deploy automático sin configuración adicional!** ✅
   - No necesitas configurar EmailJS (eliminado)
   - Resend es opcional (si quieres emails automáticos)
   - Todo funciona sin configuración externa

**URL final: https://tu-proyecto.vercel.app**

#### 📧 Configuración de Email (Opcional)
Si quieres habilitar el envío automático de emails:
1. Ve a tu proyecto en Vercel → Settings → Environment Variables
2. Añade: `RESEND_API_KEY` = tu_clave_de_resend
3. Añade: `EMERGENCY_EMAIL` = email_destino@ejemplo.com

**Nota:** Sin estas variables, la app funciona perfectamente y solo descarga los Excel localmente.

---

## 🥈 OPCIÓN 2: NETLIFY (Alternativa Gratis)

### Paso 1: Construir aplicación
```bash
pnpm build
```

### Paso 2: Desplegar en Netlify
1. Ve a https://netlify.com
2. Arrastra la carpeta `.next` o conecta GitHub
3. Configura:
   - Build command: `pnpm build`
   - Publish directory: `.next`
4. Agrega variables de entorno en Settings

---

## 🥉 OPCIÓN 3: VPS/Servidor Propio

### Paso 1: Preparar servidor
```bash
# Conectar a tu servidor
ssh usuario@tu-servidor.com

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar pnpm
npm install -g pnpm

# Instalar PM2 (para mantener la app corriendo)
npm install -g pm2
```

### Paso 2: Subir aplicación
```bash
# Opción A: Git
git clone https://github.com/tu-usuario/emergency-form.git
cd emergency-form

# Opción B: SCP/SFTP
# Sube la carpeta completa al servidor
```

### Paso 3: Configurar
```bash
# Instalar dependencias
pnpm install

# Crear archivo de entorno
cp .env.example .env.local
nano .env.local  # Editar con tus credenciales

# Construir para producción
pnpm build
```

### Paso 4: Iniciar con PM2
```bash
# Crear archivo de configuración PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'emergency-form',
    script: 'npm',
    args: 'start',
    cwd: '/ruta/a/tu/proyecto',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Iniciar aplicación
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Paso 5: Configurar Nginx (Opcional)
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔒 HTTPS Y DOMINIO

### Para Vercel/Netlify
- HTTPS automático ✅
- Dominio personalizado en configuración

### Para VPS
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com

# Renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## ✅ VERIFICACIÓN FINAL

1. **Aplicación carga** → ✅
2. **Formulario funciona** → ✅  
3. **Excel se genera y descarga** → ✅
4. **Panel admin accesible** → ✅
5. **PWA instalable** → ✅
6. **Funciona offline** → ✅
7. **EmailJS eliminado** → ✅ (sin errores de template)
8. **Resend opcional** → ⚠️ (configurable si quieres emails)

---

## 🆘 COMANDOS ÚTILES

```bash
# Ver logs en producción
pm2 logs emergency-form

# Reiniciar aplicación
pm2 restart emergency-form

# Actualizar aplicación
git pull
pnpm install
pnpm build
pm2 restart emergency-form

# Backup de datos
cp -r data/ backup-$(date +%Y%m%d)/
```

**¡Tu aplicación ya está lista para producción!** 🎉
