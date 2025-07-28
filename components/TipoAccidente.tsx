"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { FormData } from "@/types/formTypes"

interface Props {
  data: FormData
  updateField: (field: keyof FormData, value: any) => void
}

export default function TipoAccidente({ data, updateField }: Props) {
  const handleIntervieneChange = (field: keyof FormData["interviene"], checked: boolean) => {
    updateField("interviene", {
      ...data.interviene,
      [field]: checked,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-red-600">TIPO DE ACCIDENTE</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="modalidad" className="text-sm font-medium">
              Modalidad
            </Label>
            <Input
              id="modalidad"
              type="text"
              value={data.modalidad}
              onChange={(e) => updateField("modalidad", e.target.value)}
              className="mt-1"
              placeholder="Ej: Tráfico colisión, caída, atropello..."
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Interviene:</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="policiaLocal"
                  checked={data.interviene.policiaLocal}
                  onCheckedChange={(checked) => handleIntervieneChange("policiaLocal", checked as boolean)}
                />
                <Label htmlFor="policiaLocal" className="text-sm">
                  Policía Local
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="guardiaCivil"
                  checked={data.interviene.guardiaCivil}
                  onCheckedChange={(checked) => handleIntervieneChange("guardiaCivil", checked as boolean)}
                />
                <Label htmlFor="guardiaCivil" className="text-sm">
                  Guardia Civil
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="otros"
                  checked={data.interviene.otros}
                  onCheckedChange={(checked) => handleIntervieneChange("otros", checked as boolean)}
                />
                <Label htmlFor="otros" className="text-sm">
                  Otros
                </Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
