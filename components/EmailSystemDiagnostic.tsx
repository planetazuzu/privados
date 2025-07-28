"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, Loader } from "lucide-react"

export default function EmailSystemDiagnostic() {
  const [resendStatus, setResendStatus] = useState<'checking' | 'ok' | 'error' | null>(null)
  const [resendError, setResendError] = useState<string>("")

  const checkResend = async () => {
    setResendStatus('checking')
    try {
      const response = await fetch('/api/send-emergency-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: {
            numeroServicio: 'TEST-001',
            fecha: '2024-01-01',
            nombreApellidos: 'Prueba Sistema',
            dni: '12345678X',
            telefono: '123456789'
          },
          excelBase64: 'dGVzdA==' // base64 de "test"
        })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setResendStatus('ok')
        setResendError("")
      } else {
        setResendStatus('error')
        setResendError(result.error || `HTTP ${response.status}`)
      }
    } catch (error: any) {
      setResendStatus('error')
      setResendError(error.message)
    }
  }

  const getStatusIcon = (status: typeof resendStatus) => {
    switch (status) {
      case 'checking': return <Loader className="h-4 w-4 animate-spin" />
      case 'ok': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: typeof resendStatus) => {
    switch (status) {
      case 'checking': return <Badge variant="secondary">Verificando...</Badge>
      case 'ok': return <Badge variant="secondary" className="bg-green-100 text-green-800">✅ Funcionando</Badge>
      case 'error': return <Badge variant="destructive">❌ Error</Badge>
      default: return <Badge variant="outline">Sin verificar</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Diagnóstico del Sistema de Email
        </CardTitle>
        <CardDescription>
          Verifica el estado de Resend (sistema único de email)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Resend Status */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(resendStatus)}
              <h4 className="font-medium">🚀 Resend (Sistema Principal)</h4>
            </div>
            {getStatusBadge(resendStatus)}
          </div>
          
          {resendError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Error en Resend:</strong> {resendError}
              </AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={checkResend} 
            disabled={resendStatus === 'checking'}
            variant="outline"
            size="sm"
          >
            {resendStatus === 'checking' ? 'Verificando...' : 'Probar Resend'}
          </Button>
        </div>

        {/* Diagnosis */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Sistema simplificado:</strong> El sistema usa únicamente Resend para envío de emails. Si falla, descarga automáticamente el Excel localmente.
            {resendStatus === 'ok' && (
              <div className="mt-2 text-green-700">
                ✅ <strong>Resend funciona correctamente</strong> - El sistema está operativo.
              </div>
            )}
            {resendStatus === 'error' && (
              <div className="mt-2 text-red-700">
                ❌ <strong>Resend no está funcionando</strong> - Solo funcionará la descarga local. Verifica la variable RESEND_API_KEY en Vercel.
              </div>
            )}
          </AlertDescription>
        </Alert>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">⚙️ Variables de entorno requeridas:</h4>
          <div className="text-sm text-blue-800 space-y-1 font-mono">
            <div>RESEND_API_KEY=re_xxxxxxxxxx</div>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            ✅ Sin dependencias de EmailJS - Sistema más limpio y confiable.
          </p>
        </div>

      </CardContent>
    </Card>
  )
}
