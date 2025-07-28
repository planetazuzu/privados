"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DatePicker from "./DatePicker"
import TimePicker from "./TimePicker"
import type { FormData } from "@/types/formTypes"

interface Props {
  data: FormData
  updateField: (field: keyof FormData, value: any) => void
}

export default function DatosPrincipales({ data, updateField }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-red-600">DATOS PRINCIPALES</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="fecha" className="text-sm font-medium">
              Fecha *
            </Label>
            <DatePicker
              id="fecha"
              value={data.fecha}
              onChange={(date) => updateField("fecha", date)}
              placeholder="Seleccionar fecha del servicio"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="hora" className="text-sm font-medium">
              Hora
            </Label>
            <TimePicker
              id="hora"
              value={data.hora}
              onChange={(time) => updateField("hora", time)}
              placeholder="Seleccionar hora del servicio"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="numeroServicio" className="text-sm font-medium">
              Nº de Servicio *
            </Label>
            <Input
              id="numeroServicio"
              type="text"
              value={data.numeroServicio}
              onChange={(e) => updateField("numeroServicio", e.target.value)}
              className="mt-1"
              placeholder="Ej: 12345"
              required
            />
          </div>

          <div>
            <Label htmlFor="vehiculo" className="text-sm font-medium">
              Vehículo
            </Label>
            <Input
              id="vehiculo"
              type="text"
              value={data.vehiculo}
              onChange={(e) => updateField("vehiculo", e.target.value)}
              className="mt-1"
              placeholder="Ej: Ambulancia A1"
            />
          </div>

          <div>
            <Label htmlFor="tecnico1" className="text-sm font-medium">
              Técnico 1
            </Label>
            <Input
              id="tecnico1"
              type="text"
              value={data.tecnico1}
              onChange={(e) => updateField("tecnico1", e.target.value)}
              className="mt-1"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <Label htmlFor="tecnico2" className="text-sm font-medium">
              Técnico 2
            </Label>
            <Input
              id="tecnico2"
              type="text"
              value={data.tecnico2}
              onChange={(e) => updateField("tecnico2", e.target.value)}
              className="mt-1"
              placeholder="Nombre completo"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
