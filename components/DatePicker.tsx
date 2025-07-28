"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import Calendar from "./Calendar"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value?: string
  onChange: (date: string) => void
  placeholder?: string
  className?: string
  required?: boolean
  id?: string
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Seleccionar fecha",
  className,
  required,
  id,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Formatear fecha para mostrar
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return ""

    try {
      // Crear fecha sin problemas de zona horaria
      const [year, month, day] = dateString.split("-")
      const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))

      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error formateando fecha:", error)
      return dateString
    }
  }

  // Cerrar calendario al hacer clic fuera
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

  const handleDateChange = (date: string) => {
    console.log("DatePicker recibió:", date) // Para debug
    onChange(date)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="flex gap-2">
        <Input
          id={id}
          type="text"
          value={value ? formatDisplayDate(value) : ""}
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
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2">
          <Calendar value={value} onChange={handleDateChange} />
        </div>
      )}

      {/* Input oculto para compatibilidad con formularios */}
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  )
}
