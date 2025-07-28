"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import type { FormData } from "@/types/formTypes"

interface Props {
  data: FormData
  updateField: (field: keyof FormData, value: any) => void
}

export default function DatosTraslado({ data, updateField }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-red-600">DATOS DEL TRASLADO</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Información:</strong> Debe especificar al menos la dirección de origen o destino
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="direccionOrigen" className="text-sm font-medium">
              Dirección Origen
            </Label>
            <Input
              id="direccionOrigen"
              type="text"
              value={data.direccionOrigen}
              onChange={(e) => updateField("direccionOrigen", e.target.value)}
              className="mt-1"
              placeholder="Calle, número, etc."
            />
          </div>

          <div>
            <Label htmlFor="localidadOrigen" className="text-sm font-medium">
              Localidad Origen
            </Label>
            <Input
              id="localidadOrigen"
              type="text"
              value={data.localidadOrigen}
              onChange={(e) => updateField("localidadOrigen", e.target.value)}
              className="mt-1"
              placeholder="Ciudad, pueblo, etc."
            />
          </div>

          <div>
            <Label htmlFor="direccionDestino" className="text-sm font-medium">
              Dirección Destino
            </Label>
            <Input
              id="direccionDestino"
              type="text"
              value={data.direccionDestino}
              onChange={(e) => updateField("direccionDestino", e.target.value)}
              className="mt-1"
              placeholder="Hospital, centro médico, etc."
            />
          </div>

          <div>
            <Label htmlFor="localidadDestino" className="text-sm font-medium">
              Localidad Destino
            </Label>
            <Input
              id="localidadDestino"
              type="text"
              value={data.localidadDestino}
              onChange={(e) => updateField("localidadDestino", e.target.value)}
              className="mt-1"
              placeholder="Ciudad, pueblo, etc."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
