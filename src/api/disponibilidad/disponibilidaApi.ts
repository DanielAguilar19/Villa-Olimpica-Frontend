import type { Slot } from '@/interfaces/disponibilidad/slots'
import axios from 'axios'

export async function obtenerSlots(instalacionId: number, fechaYYYYMMDD: string, slotMin = 60) {
  const { data } = await axios.get<Slot[]>(
    `${import.meta.env.VITE_API}/disponibilidad/instalacion/${instalacionId}/slots`,
    {
      params: { fecha: fechaYYYYMMDD, slotMin },
    },
  )
  return data
}
