"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormData } from "@/types/formTypes"

interface Props {
  data: FormData
  updateField: (field: keyof FormData, value: any) => void
}

const posiciones = ["Ciclista", "Peatón", "Pasajero", "Conductor", "Motociclista", "Otro"]

export default function DatosPaciente({ data, updateField }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-red-600">DATOS DEL PACIENTE</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombreApellidos" className="text-sm font-medium">
              Nombre y Apellidos *
            </Label>
            <Input
              id="nombreApellidos"
              type="text"
              value={data.nombreApellidos}
              onChange={(e) => updateField("nombreApellidos", e.target.value)}
              className="mt-1"
              placeholder="Nombre completo del paciente"
              required
            />
          </div>

          <div>
            <Label htmlFor="dni" className="text-sm font-medium">
              DNI
            </Label>
            <Input
              id="dni"
              type="text"
              value={data.dni}
              onChange={(e) => updateField("dni", e.target.value)}
              className="mt-1"
              placeholder="12345678A"
            />
          </div>

          <div>
            <Label htmlFor="telefono" className="text-sm font-medium">
              Teléfono
            </Label>
            <Input
              id="telefono"
              type="tel"
              value={data.telefono}
              onChange={(e) => updateField("telefono", e.target.value)}
              className="mt-1"
              placeholder="600123456"
            />
          </div>

          <div>
            <Label htmlFor="posicion" className="text-sm font-medium">
              Posición
            </Label>
            <Select value={data.posicion} onValueChange={(value) => updateField("posicion", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Seleccionar posición" />
              </SelectTrigger>
              <SelectContent>
                {posiciones.map((posicion) => (
                  <SelectItem key={posicion} value={posicion}>
                    {posicion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
