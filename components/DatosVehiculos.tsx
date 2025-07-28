"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"
import type { VehiculoData } from "@/types/formTypes"

interface Props {
  vehiculos: VehiculoData[]
  onChange: (vehiculos: VehiculoData[]) => void
}

export default function DatosVehiculos({ vehiculos, onChange }: Props) {
  const addVehiculo = () => {
    if (vehiculos.length >= 4) return

    const newVehiculo: VehiculoData = {
      id: Date.now().toString(),
      marca: "",
      modelo: "",
      matricula: "",
      aseguradora: "",
      numeroPoliza: "",
      tomador: "",
    }

    onChange([...vehiculos, newVehiculo])
  }

  const removeVehiculo = (id: string) => {
    onChange(vehiculos.filter((v) => v.id !== id))
  }

  const updateVehiculo = (id: string, field: keyof VehiculoData, value: string) => {
    onChange(vehiculos.map((v) => (v.id === id ? { ...v, [field]: value } : v)))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-red-600 flex items-center justify-between">
          DATOS DE LOS VEHÍCULOS (máximo 4)
          <Button
            onClick={addVehiculo}
            disabled={vehiculos.length >= 4}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir Vehículo
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vehiculos.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No hay vehículos añadidos. Haga clic en "Añadir Vehículo" para comenzar.
          </p>
        ) : (
          <div className="space-y-6">
            {vehiculos.map((vehiculo, index) => (
              <div key={vehiculo.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-lg">Vehículo {index + 1}</h4>
                  <Button onClick={() => removeVehiculo(vehiculo.id)} variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Marca</Label>
                    <Input
                      value={vehiculo.marca}
                      onChange={(e) => updateVehiculo(vehiculo.id, "marca", e.target.value)}
                      placeholder="Ej: Toyota"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Modelo</Label>
                    <Input
                      value={vehiculo.modelo}
                      onChange={(e) => updateVehiculo(vehiculo.id, "modelo", e.target.value)}
                      placeholder="Ej: Corolla"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Matrícula</Label>
                    <Input
                      value={vehiculo.matricula}
                      onChange={(e) => updateVehiculo(vehiculo.id, "matricula", e.target.value)}
                      placeholder="Ej: 1234ABC"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Aseguradora</Label>
                    <Input
                      value={vehiculo.aseguradora}
                      onChange={(e) => updateVehiculo(vehiculo.id, "aseguradora", e.target.value)}
                      placeholder="Ej: Mapfre"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Nº de Póliza</Label>
                    <Input
                      value={vehiculo.numeroPoliza}
                      onChange={(e) => updateVehiculo(vehiculo.id, "numeroPoliza", e.target.value)}
                      placeholder="Número de póliza"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Tomador</Label>
                    <Input
                      value={vehiculo.tomador}
                      onChange={(e) => updateVehiculo(vehiculo.id, "tomador", e.target.value)}
                      placeholder="Nombre del tomador"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
