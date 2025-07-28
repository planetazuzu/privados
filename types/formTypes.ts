export interface VehiculoData {
  id: string
  marca: string
  modelo: string
  matricula: string
  aseguradora: string
  numeroPoliza: string
  tomador: string
}

export interface FormData {
  // Datos principales
  fecha: string
  hora: string
  numeroServicio: string
  vehiculo: string
  tecnico1: string
  tecnico2: string

  // Datos del paciente
  nombreApellidos: string
  dni: string
  telefono: string
  posicion: string

  // Datos del traslado
  direccionOrigen: string
  localidadOrigen: string
  direccionDestino: string
  localidadDestino: string

  // Tipo de accidente
  modalidad: string
  interviene: {
    policiaLocal: boolean
    guardiaCivil: boolean
    otros: boolean
  }

  // Vehículos
  vehiculos: VehiculoData[]

  // Observaciones
  observaciones: string
}
