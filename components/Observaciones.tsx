"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Props {
  observaciones: string
  onChange: (observaciones: string) => void
}

export default function Observaciones({ observaciones, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-red-600">OBSERVACIONES</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="observaciones" className="text-sm font-medium">
            Observaciones adicionales
          </Label>
          <Textarea
            id="observaciones"
            value={observaciones}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 min-h-[120px]"
            placeholder="Escriba aquí cualquier información adicional relevante para el caso..."
          />
        </div>
      </CardContent>
    </Card>
  )
}
