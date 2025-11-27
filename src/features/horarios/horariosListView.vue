<template>
  <div class="p-4">
    <Card>
      <template #title>
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold">Gestión de Horarios</h2>
          <Button label="Nuevo Horario" icon="pi pi-plus" @click="router.push('/horarios/nuevo')" />
        </div>
      </template>

      <template #content>
        <!-- Filtros -->
        <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="flex flex-col gap-2">
            <label for="filterInstalacion" class="font-semibold">Filtrar por Instalación</label>
            <Select id="filterInstalacion" v-model="filterInstalacionId" :options="instalaciones" optionLabel="nombre"
              optionValue="id" placeholder="Todas las instalaciones" class="w-full" showClear />
          </div>

          <div class="flex flex-col gap-2">
            <label for="filterDia" class="font-semibold">Filtrar por Día</label>
            <Select id="filterDia" v-model="filterDiaSemana" :options="DIAS_SEMANA" optionLabel="label"
              optionValue="value" placeholder="Todos los días" class="w-full" showClear />
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="py-8 text-center">
          <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
          <p class="mt-2 text-gray-600">Cargando horarios...</p>
        </div>

        <!-- Error -->
        <div v-else-if="errorMsg" class="rounded-md bg-red-50 p-4">
          <p class="text-sm text-red-800">{{ errorMsg }}</p>
        </div>

        <!-- Lista de Horarios -->
        <div v-else-if="filteredHorarios.length > 0" class="space-y-3">
          <div v-for="horario in filteredHorarios" :key="horario.id"
            class="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-semibold">
                  {{ getInstalacionNombre(horario.instalacionId) }}
                </h3>
                <span class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {{ getDiaNombre(horario.diaSemana) }}
                </span>
              </div>
              <div class="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <div class="flex items-center gap-1">
                  <i class="pi pi-clock"></i>
                  <span>{{ horario.horaInicio }} - {{ horario.horaFin }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <i class="pi pi-calendar"></i>
                  <span>
                    {{ formatDate(horario.vigenteDesde) }} -
                    {{ formatDate(horario.vigenteHasta) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex gap-2">
              <Button icon="pi pi-pencil" severity="info" outlined @click="editHorario(horario.id)"
                v-tooltip.top="'Editar'" />
              <Button icon="pi pi-trash" severity="danger" outlined @click="confirmDelete(horario.id)"
                v-tooltip.top="'Eliminar'" />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="py-8 text-center">
          <i class="pi pi-calendar-times text-6xl text-gray-300"></i>
          <p class="mt-4 text-gray-600">No hay horarios registrados</p>
          <Button label="Crear primer horario" icon="pi pi-plus" class="mt-4" @click="router.push('/horarios/nuevo')" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Select from 'primevue/select'
import Button from 'primevue/button'
import type { Horario } from '@/interfaces/horario/IHorario'
import { DIAS_SEMANA } from '@/interfaces/horario/IHorario'
import type { Instalacion } from '@/interfaces/instalaciones/instalaciones'
import { obtenerTodasLasInstalaciones } from '@/api/instalaciones/instalacionesApi'
import { getHorarios, deleteHorario } from '@/api/horarios/horariosApi'

const router = useRouter()

const loading = ref(false)
const errorMsg = ref('')
const horarios = ref<Horario[]>([])
const instalaciones = ref<Instalacion[]>([])
const filterInstalacionId = ref<number | null>(null)
const filterDiaSemana = ref<number | null>(null)

// Computed para filtrar horarios
const filteredHorarios = computed(() => {
  let filtered = horarios.value

  if (filterInstalacionId.value !== null) {
    filtered = filtered.filter((h) => h.instalacionId === filterInstalacionId.value)
  }

  if (filterDiaSemana.value !== null) {
    filtered = filtered.filter((h) => h.diaSemana === filterDiaSemana.value)
  }

  return filtered
})

// Funciones auxiliares
const getInstalacionNombre = (id: number): string => {
  const instalacion = instalaciones.value.find((i) => i.id === id)
  return instalacion?.nombre || `Instalación #${id}`
}

const getDiaNombre = (dia: number): string => {
  const diaObj = DIAS_SEMANA.find((d) => d.value === dia)
  return diaObj?.label || 'Día desconocido'
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Cargar datos
const loadData = async () => {
  loading.value = true
  errorMsg.value = ''

  try {
    const [horariosData, instalacionesData] = await Promise.all([
      getHorarios(),
      obtenerTodasLasInstalaciones(),
    ])
    horarios.value = horariosData
    instalaciones.value = instalacionesData || []
  } catch (error) {
    console.error('Error cargando datos:', error)
    errorMsg.value = 'Error al cargar los datos'
  } finally {
    loading.value = false
  }
}

// Editar horario
const editHorario = (id: number) => {
  router.push(`/horarios/editar/${id}`)
}

// Confirmar eliminación
const confirmDelete = (id: number) => {
  if (confirm('¿Está seguro de que desea eliminar este horario?')) {
    deleteHorarioById(id)
  }
}

// Eliminar horario
const deleteHorarioById = async (id: number) => {
  try {
    loading.value = true
    await deleteHorario(id)
    await loadData() // Recargar datos
  } catch (error) {
    console.error('Error eliminando horario:', error)
    errorMsg.value = 'Error al eliminar el horario'
  } finally {
    loading.value = false
  }
}

// Inicialización
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
