<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Toolbar -->
      <div class="mb-6 flex items-center gap-3">
        <Button label="← Volver a Disciplinas" @click="router.push({ name: 'disciplinas' })" />
        <div class="ml-auto flex items-center gap-3">
          <Button icon="pi pi-angle-left" text rounded @click="goPrevWeek" />
          <Calendar v-model="baseDate" dateFormat="yy-mm-dd" :showIcon="true" class="w-44"
            @update:modelValue="reloadWeek" />
          <Button icon="pi pi-angle-right" text rounded @click="goNextWeek" />
          <Dropdown v-model="slotMin" :options="slotOptions" optionLabel="label" optionValue="value" class="w-40"
            @change="reloadWeek" />
          <Button label="Refrescar" icon="pi pi-refresh" text @click="reloadWeek" />
        </div>
      </div>

      <!-- Header -->
      <div class="mb-4">
        <h1 class="text-3xl font-bold tracking-tight">Disponibilidad semanal · #{{ instalacionId }}</h1>
        <p class="text-slate-300">Consulta y reserva por bloques.</p>
      </div>

      <!-- Tabla / estados -->
      <Card class="bg-slate-950/60 border border-slate-800 rounded-2xl shadow-xl">
        <template #content>
          <div v-if="loading" class="p-6">
            <Skeleton height="2rem" class="mb-3" />
            <Skeleton height="18rem" />
          </div>

          <div v-else-if="errorMsg" class="p-6">
            <Tag severity="danger" value="Error" />
            <p class="mt-3 text-sm text-slate-300">{{ errorMsg }}</p>
          </div>

          <div v-else-if="rows.length === 0" class="p-10 text-center">
            <Tag severity="secondary" value="Sin horarios" />
            <p class="mt-3 text-sm text-slate-300">
              No se encontraron bloques para esta semana con {{ slotMin }} minutos.
            </p>
          </div>

          <DataTable v-else :value="rows" size="small" class="custom-dt" :scrollable="true" scrollHeight="60vh"
            :rowHover="true" :stripedRows="true">
            <Column field="hora" header="Hora" frozen style="width: 110px" />
            <Column v-for="col in dayColumns" :key="col.field" :field="col.field" :header="col.header">
              <template #body="{ data }">
                <div class="flex items-center justify-between gap-2">
                  <template v-if="isSlot(cell(data, col.field))">
                    <Tag v-if="!cell(data, col.field)!.disponible" value="Ocupado" severity="warn" rounded />
                    <Button v-else size="small" label="Reservar" icon="pi pi-check" severity="success"
                      @click="reservar(cell(data, col.field)!)" />
                  </template>
                  <template v-else>
                    <span class="text-slate-500 text-xs">—</span>
                  </template>
                </div>
                <div class="text-[11px] text-slate-400 mt-1" v-if="isSlot(cell(data, col.field))">
                  {{ hhmm(cell(data, col.field)!.inicioTs) }}–{{ hhmm(cell(data, col.field)!.finTs) }}
                </div>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Card from 'primevue/card'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Skeleton from 'primevue/skeleton'

import { obtenerSlots } from '@/api/disponibilidad/disponibilidaApi'
import { reservarSimple } from '@/api/reserva/reservaApi'
import { LanzarAlerta } from '@/utils/alertas'

/** ===== Tipos ===== */
interface SlotDTO {
  id?: number
  inicioTs: string
  finTs: string
  disponible: boolean
}
type DayField = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom'
type Row = { hora: string } & { [K in DayField]?: SlotDTO | null }
type DayInfo = { date: Date; header: string; field: DayField }
type DayColumn = { header: string; field: DayField }

/** ===== Router / estado base ===== */
const route = useRoute()
const router = useRouter()
const instalacionId = Number(route.params.id)

const loading = ref<boolean>(true)
const errorMsg = ref<string>('')

const baseDate = ref<Date>(startOfWeek(new Date()))
const slotMin = ref<number>(60)
const slotOptions = [
  { label: 'Bloques de 60 min', value: 60 },
  { label: 'Bloques de 30 min', value: 30 }
]

/** ===== Columnas (encabezados por día) ===== */
const dayColumns = computed<DayColumn[]>(() => {
  const days = getWeekDays(baseDate.value)
  return days.map(d => ({ header: d.header, field: d.field }))
})

/** ===== Tabla ===== */
const rows = ref<Row[]>([])

/** ===== Helpers fechas/horas ===== */
function startOfWeek(d: Date): Date {
  const x = new Date(d)
  const day = (x.getDay() + 6) % 7 // lunes=0
  x.setHours(0, 0, 0, 0)
  x.setDate(x.getDate() - day)
  return x
}
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x }
function yyyymmdd(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const da = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${da}`
}
function hhmm(iso: string) {
  const dt = new Date(iso)
  return dt.toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute: '2-digit' })
}
function getWeekDays(monday: Date): DayInfo[] {
  const labels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const
  const fields: DayField[] = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom']
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i)
    const header = `${labels[i]} ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
    return { date, header, field: fields[i] as DayField }
  })
}

/** ===== Acceso seguro a celdas (sin aserciones en el template) ===== */
function cell(row: unknown, field: DayField): SlotDTO | null {
  if (!row || typeof row !== 'object') return null
  const r = row as Record<string, unknown>
  const val = r[field] as unknown
  return isSlot(val) ? val : null
}
function isSlot(x: unknown): x is SlotDTO {
  if (!x || typeof x !== 'object') return false
  const s = x as SlotDTO
  return typeof s.inicioTs === 'string' && typeof s.finTs === 'string'
}

/** ===== Carga de semana ===== */
async function reloadWeek(): Promise<void> {
  loading.value = true
  errorMsg.value = ''
  rows.value = []
  try {
    if (!Number.isFinite(instalacionId)) throw new Error('Instalación inválida.')

    const days = getWeekDays(baseDate.value)
    const perDay: Record<DayField, SlotDTO[]> = { lun: [], mar: [], mie: [], jue: [], vie: [], sab: [], dom: [] }

    await Promise.all(days.map(async d => {
      const fecha = yyyymmdd(d.date)
      const raw = await obtenerSlots(instalacionId, fecha, slotMin.value)
      perDay[d.field] = Array.isArray(raw) ? raw : []
    }))

    const allHours = new Set<string>()
      ; (Object.keys(perDay) as DayField[]).forEach(field => {
        perDay[field].forEach(s => allHours.add(hhmm(s.inicioTs)))
      })
    const sortedHours = Array.from(allHours).sort()

    const newRows: Row[] = sortedHours.map(h => {
      const row: Row = { hora: h }
      for (const d of days) {
        const slot = perDay[d.field].find(s => hhmm(s.inicioTs) === h)
        row[d.field] = slot ?? null
      }
      return row
    })

    rows.value = newRows
  } catch (e: unknown) {
    console.error(e)
    errorMsg.value = e instanceof Error ? e.message : 'Error inesperado al cargar la disponibilidad.'
  } finally {
    loading.value = false
  }
}

/** ===== Reserva ===== */
async function reservar(s: SlotDTO) {
  const user = Number(localStorage.getItem('id'))
  const confirmMsg = `Reservar ${hhmm(s.inicioTs)}–${hhmm(s.finTs)} para la instalación #${instalacionId}?`
  if (!confirm(confirmMsg)) return
  try {
    if (!user) {
      LanzarAlerta('Usuario no autenticado.', 'error')
      return
    }
    const msg = await reservarSimple(user, instalacionId, s.inicioTs.slice(0, 10), hhmm(s.inicioTs))
    LanzarAlerta(msg || 'Reserva exitosa', 'success')
    await reloadWeek()
  } catch (e) {
    console.error('Error al reservar:', e)
    LanzarAlerta('Error al reservar. Intenta nuevamente.', 'error')
  }
}

function goPrevWeek() { baseDate.value = addDays(baseDate.value, -7); reloadWeek() }
function goNextWeek() { baseDate.value = addDays(baseDate.value, 7); reloadWeek() }

onMounted(reloadWeek)
</script>

<style scoped>
.custom-dt :deep(.p-datatable-header),
.custom-dt :deep(.p-datatable-thead > tr > th) {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #0b1220;
  color: #e2e8f0;
  font-weight: 700;
  text-align: center;
  border-bottom: 1px solid #1f2937;
}

.custom-dt :deep(.p-datatable-tbody > tr > td) {
  background: #0f172a;
  border-color: #1f2937;
}

.custom-dt :deep(.p-datatable-tbody > tr:hover > td) {
  background: #0f172aee;
}

.custom-dt :deep(.p-tag) {
  font-size: 12px;
  line-height: 1;
}
</style>
