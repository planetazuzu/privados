"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarProps {
  value?: string
  onChange: (date: string) => void
  className?: string
}

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

export default function Calendar({ value, onChange, className }: CalendarProps) {
  const today = new Date()

  // Parsear fecha seleccionada
  let selectedDate = null
  if (value) {
    const parts = value.split("-")
    if (parts.length === 3) {
      selectedDate = {
        year: Number.parseInt(parts[0]),
        month: Number.parseInt(parts[1]) - 1, // JavaScript months are 0-based
        day: Number.parseInt(parts[2]),
      }
    }
  }

  const [currentMonth, setCurrentMonth] = useState(selectedDate?.month ?? today.getMonth())
  const [currentYear, setCurrentYear] = useState(selectedDate?.year ?? today.getFullYear())

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const selectDate = (day: number) => {
    const year = currentYear.toString()
    const month = (currentMonth + 1).toString().padStart(2, "0")
    const dayStr = day.toString().padStart(2, "0")
    const dateString = `${year}-${month}-${dayStr}`

    console.log("Calendar selectDate:", dateString)
    onChange(dateString)
  }

  const isToday = (day: number) => {
    return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear
  }

  const isSelected = (day: number) => {
    return (
      selectedDate &&
      selectedDate.day === day &&
      selectedDate.month === currentMonth &&
      selectedDate.year === currentYear
    )
  }

  const renderCalendarDays = () => {
    const days = []

    // Días vacíos del mes anterior
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />)
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const selected = isSelected(day)
      const todayClass = isToday(day)

      days.push(
        <Button
          key={day}
          variant="ghost"
          size="sm"
          onClick={() => selectDate(day)}
          className={cn(
            "h-10 w-10 p-0 font-normal hover:bg-red-50 transition-colors",
            todayClass && !selected && "bg-red-100 text-red-800 font-semibold",
            selected && "bg-red-600 text-white hover:bg-red-700 font-semibold",
            !selected && !todayClass && "text-gray-700 hover:text-red-600",
          )}
        >
          {day}
        </Button>,
      )
    }

    return days
  }

  const selectToday = () => {
    const today = new Date()
    const year = today.getFullYear().toString()
    const month = (today.getMonth() + 1).toString().padStart(2, "0")
    const day = today.getDate().toString().padStart(2, "0")
    const todayString = `${year}-${month}-${day}`

    console.log("Calendar selectToday:", todayString)
    onChange(todayString)
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
  }

  return (
    <Card className={cn("w-full max-w-sm shadow-lg", className)}>
      <CardContent className="p-4">
        {/* Header del calendario */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={previousMonth} className="h-8 w-8 p-0 hover:bg-red-50">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-red-600" />
            <span className="font-semibold text-gray-900">
              {MONTHS[currentMonth]} {currentYear}
            </span>
          </div>

          <Button variant="ghost" size="sm" onClick={nextMonth} className="h-8 w-8 p-0 hover:bg-red-50">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((day) => (
            <div key={day} className="h-8 w-10 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Días del calendario */}
        <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

        {/* Botones de acceso rápido */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={selectToday}
            className="flex-1 text-xs bg-transparent hover:bg-red-50"
          >
            Hoy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange("")}
            className="flex-1 text-xs bg-transparent hover:bg-red-50"
          >
            Limpiar
          </Button>
        </div>

        {/* Debug info */}
        {value && <div className="mt-2 text-xs text-gray-500 text-center">Seleccionado: {value}</div>}
      </CardContent>
    </Card>
  )
}
