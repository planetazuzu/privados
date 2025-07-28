import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import PWAInstallPrompt from "@/components/PWAInstallPrompt"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sistema de Emergencias Sanitarias",
  description: "Aplicación para la recogida de datos en emergencias sanitarias",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["emergencias", "sanitarias", "ambulancia", "urgencias", "salud"],
  authors: [{ name: "Sistema de Emergencias" }],
  creator: "Sistema de Emergencias Sanitarias",
  publisher: "Sistema de Emergencias Sanitarias",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/icon-192.svg",
    shortcut: "/icon-192.svg",
    apple: "/icon-512.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Emergencias",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="description" content="Sistema de recogida de datos para emergencias sanitarias" />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="Emergencias" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Emergencias" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#dc2626" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Icons */}
        <link rel="icon" type="image/svg+xml" href="/icon-192.svg" />
        <link rel="apple-touch-icon" href="/icon-512.svg" />

        <title>Sistema de Emergencias Sanitarias</title>
      </head>
      <body className={GeistSans.className}>
        {children}
        <PWAInstallPrompt />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
