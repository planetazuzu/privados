"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value?: string
  onChange: (time: string) => void
  placeholder?: string
  className?: string
  required?: boolean
  id?: string
}

export default function TimePicker({
  value,
  onChange,
  placeholder = "Seleccionar hora",
  className,
  required,
  id,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  const minutes = ["00", "15", "30", "45"]

  const currentHour = value ? value.split(":")[0] : "12"
  const currentMinute = value ? value.split(":")[1] : "00"

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const selectTime = (hour: string, minute: string) => {
    const timeString = `${hour}:${minute}`
    console.log("TimePicker selectTime:", timeString)
    onChange(timeString)
    setIsOpen(false)
  }

  const selectQuickTime = (timeValue: string) => {
    console.log("TimePicker selectQuickTime:", timeValue)
    onChange(timeValue)
    setIsOpen(false)
  }

  const getCurrentTime = () => {
    const now = new Date()
    const hour = now.getHours().toString().padStart(2, "0")
    const minute = now.getMinutes().toString().padStart(2, "0")
    return `${hour}:${minute}`
  }

  const quickTimes = [
    { label: "Ahora", value: getCurrentTime() },
    { label: "08:00", value: "08:00" },
    { label: "12:00", value: "12:00" },
    { label: "18:00", value: "18:00" },
    { label: "20:00", value: "20:00" },
  ]

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="flex gap-2">
        <Input
          id={id}
          type="text"
          value={value || ""}
          placeholder={placeholder}
          readOnly
          required={required}
          className="cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="shrink-0 bg-transparent"
        >
          <Clock className="h-4 w-4" />
        </Button>
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 z-50 mt-2 w-80">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Accesos rápidos */}
              <div>
                <h4 className="text-sm font-medium mb-2">Accesos rápidos</h4>
                <div className="flex flex-wrap gap-2">
                  {quickTimes.map((time) => (
                    <Button
                      key={time.label}
                      variant="outline"
                      size="sm"
                      onClick={() => selectQuickTime(time.value)}
                      className="text-xs bg-transparent"
                    >
                      {time.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Selector manual */}
              <div>
                <h4 className="text-sm font-medium mb-2">Selección manual</h4>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Hora</label>
                    <select
                      value={currentHour}
                      onChange={(e) => selectTime(e.target.value, currentMinute)}
                      className="w-full p-2 border rounded text-sm"
                    >
                      {hours.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-lg font-bold">:</div>

                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Minuto</label>
                    <select
                      value={currentMinute}
                      onChange={(e) => selectTime(currentHour, e.target.value)}
                      className="w-full p-2 border rounded text-sm"
                    >
                      {minutes.map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setIsOpen(false)} className="flex-1 bg-transparent">
                  Cancelar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onChange("")
                    setIsOpen(false)
                  }}
                  className="flex-1 bg-transparent"
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug info */}
      {value && <div className="text-xs text-gray-500 mt-1">Hora seleccionada: {value}</div>}
    </div>
  )
}
