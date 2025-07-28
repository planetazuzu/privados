"use client"

import { useState, useEffect } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import NotificationManager from "@/components/NotificationManager"
import NotificationTester from "@/components/NotificationTester"
import NotificationStats from "@/components/NotificationStats"
import EmailTester from "@/components/EmailTester"
import EmailSystemDiagnostic from "@/components/EmailSystemDiagnostic"
import ConfigVerifier from "@/components/ConfigVerifier"
import PWAStatus from "@/components/PWAStatus"
import AdminLogin from "@/components/AdminLogin"
import { Shield, LogOut } from "lucide-react"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si ya está autenticado
    const checkAuth = () => {
      const authenticated = localStorage.getItem("admin-authenticated")
      const loginTime = localStorage.getItem("admin-login-time")
      
      if (authenticated === "true" && loginTime) {
        // Verificar si la sesión no ha expirado (24 horas)
        const now = Date.now()
        const timeDiff = now - parseInt(loginTime)
        const hoursElapsed = timeDiff / (1000 * 60 * 60)
        
        if (hoursElapsed < 24) {
          setIsAuthenticated(true)
        } else {
          // Sesión expirada
          localStorage.removeItem("admin-authenticated")
          localStorage.removeItem("admin-login-time")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("admin-authenticated")
    localStorage.removeItem("admin-login-time")
    setIsAuthenticated(false)
  }

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Mostrar login si no está autenticado
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  // Mostrar panel de administración si está autenticado
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 mx-auto">
                <Shield className="w-8 h-8 text-indigo-600" />
                <div>
                  <CardTitle className="text-3xl font-bold text-indigo-600">
                    PANEL DE ADMINISTRACIÓN
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Herramientas de configuración y pruebas del sistema
                  </CardDescription>
                </div>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Cerrar Sesión
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-6">
          <PWAStatus />
          <EmailSystemDiagnostic />
          <ConfigVerifier />
          <EmailTester />
          <NotificationManager />
          <NotificationTester />
          <NotificationStats />
        </div>
      </div>
      <Toaster />
    </div>
  )
}
