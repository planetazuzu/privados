"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, CheckCircle, XCircle } from "lucide-react"

interface NotificationStats {
  activeSubscriptions: number
  totalSubscriptions: number
  inactiveSubscriptions: number
}

export default function NotificationStats() {
  const [stats, setStats] = useState<NotificationStats>({
    activeSubscriptions: 0,
    totalSubscriptions: 0,
    inactiveSubscriptions: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch("/api/notifications/send")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.log("Error loading notification stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()

    // Actualizar estadísticas cada 30 segundos
    const interval = setInterval(loadStats, 30000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-600 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Estadísticas de Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">Cargando estadísticas...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-blue-600 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Estadísticas de Notificaciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div>
              <p className="text-sm text-green-600 font-medium">Suscripciones Activas</p>
              <p className="text-2xl font-bold text-green-800">{stats.activeSubscriptions}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Suscripciones</p>
              <p className="text-2xl font-bold text-blue-800">{stats.totalSubscriptions}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>

          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
            <div>
              <p className="text-sm text-red-600 font-medium">Inactivas</p>
              <p className="text-2xl font-bold text-red-800">{stats.inactiveSubscriptions}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Estado del sistema:</span>
            <Badge
              className={stats.activeSubscriptions > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
            >
              {stats.activeSubscriptions > 0 ? "Operativo" : "Sin suscripciones"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
