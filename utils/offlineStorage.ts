import type { FormData } from "@/types/formTypes"

const STORAGE_KEY = "emergencyFormData"
const PENDING_FORMS_KEY = "pendingEmergencyForms"

// Guardar datos del formulario en localStorage
export function saveFormData(data: FormData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving form data:", error)
  }
}

// Cargar datos del formulario desde localStorage
export function loadFormData(): FormData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error("Error loading form data:", error)
    return null
  }
}

// Limpiar datos guardados
export function clearFormData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Error clearing form data:", error)
  }
}

// Guardar formulario para envío posterior (cuando vuelva la conexión)
export function savePendingForm(data: FormData): void {
  try {
    const pendingForms = getPendingForms()
    const formWithId = {
      ...data,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: "pending",
    }

    pendingForms.push(formWithId)
    localStorage.setItem(PENDING_FORMS_KEY, JSON.stringify(pendingForms))
  } catch (error) {
    console.error("Error saving pending form:", error)
  }
}

// Obtener formularios pendientes
export function getPendingForms(): any[] {
  try {
    const stored = localStorage.getItem(PENDING_FORMS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error getting pending forms:", error)
    return []
  }
}

// Eliminar formulario pendiente
export function removePendingForm(formId: string): void {
  try {
    const pendingForms = getPendingForms()
    const filtered = pendingForms.filter((form) => form.id !== formId)
    localStorage.setItem(PENDING_FORMS_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error("Error removing pending form:", error)
  }
}

// Limpiar todos los formularios pendientes
export function clearPendingForms(): void {
  try {
    localStorage.removeItem(PENDING_FORMS_KEY)
  } catch (error) {
    console.error("Error clearing pending forms:", error)
  }
}
