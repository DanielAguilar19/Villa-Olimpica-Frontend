  <template>
    <div class="flex min-h-screen items-center justify-center p-4">
      <Card class="w-full max-w-2xl">
        <template #title>
          <h2 class="text-2xl font-bold">{{ isEditing ? 'Editar Horario' : 'Nuevo Horario' }}</h2>
        </template>

        <template #content>
          <form @submit.prevent="onSubmit" class="space-y-6">
            <!-- Instalación Select -->
            <div class="flex flex-col gap-2">
              <label for="instalacion" class="font-semibold">Instalación *</label>
              <Select id="instalacion" v-model="form.instalacionId" :options="instalaciones" optionLabel="nombre"
                optionValue="id" placeholder="Seleccione una instalación" class="w-full"
                :invalid="submitted && !form.instalacionId" />
              <small v-if="submitted && !form.instalacionId" class="text-red-500">
                La instalación es requerida
              </small>
            </div>

            <!-- Día de la Semana Select -->
            <div class="flex flex-col gap-2">
              <label for="diaSemana" class="font-semibold">Día de la Semana *</label>
              <Select id="diaSemana" v-model="form.diaSemana" :options="DIAS_SEMANA" optionLabel="label"
                optionValue="value" placeholder="Seleccione un día" class="w-full"
                :invalid="submitted && form.diaSemana === null" />
              <small v-if="submitted && form.diaSemana === null" class="text-red-500">
                El día de la semana es requerido
              </small>
            </div>

            <!-- Horarios -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <!-- Hora Inicio -->
              <div class="flex flex-col gap-2">
                <label for="horaInicio" class="font-semibold">Hora Inicio *</label>
                <DatePicker id="horaInicio" v-model="horaInicioDate" timeOnly hourFormat="24" placeholder="HH:mm"
                  class="w-full" :invalid="submitted && !form.horaInicio" />
                <small v-if="submitted && !form.horaInicio" class="text-red-500">
                  La hora de inicio es requerida
                </small>
              </div>

              <!-- Hora Fin -->
              <div class="flex flex-col gap-2">
                <label for="horaFin" class="font-semibold">Hora Fin *</label>
                <DatePicker id="horaFin" v-model="horaFinDate" timeOnly hourFormat="24" placeholder="HH:mm"
                  class="w-full" :invalid="submitted && !form.horaFin" />
                <small v-if="submitted && !form.horaFin" class="text-red-500">
                  La hora de fin es requerida
                </small>
              </div>
            </div>

            <!-- Fechas de Vigencia -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <!-- Vigente Desde -->
              <div class="flex flex-col gap-2">
                <label for="vigenteDesde" class="font-semibold">Vigente Desde *</label>
                <DatePicker id="vigenteDesde" v-model="form.vigenteDesde" dateFormat="dd/mm/yy" placeholder="dd/mm/aaaa"
                  class="w-full" :invalid="submitted && !form.vigenteDesde" />
                <small v-if="submitted && !form.vigenteDesde" class="text-red-500">
                  La fecha de inicio de vigencia es requerida
                </small>
              </div>

              <!-- Vigente Hasta -->
              <div class="flex flex-col gap-2">
                <label for="vigenteHasta" class="font-semibold">Vigente Hasta *</label>
                <DatePicker id="vigenteHasta" v-model="form.vigenteHasta" dateFormat="dd/mm/yy" placeholder="dd/mm/aaaa"
                  class="w-full" :minDate="form.vigenteDesde || undefined" :invalid="submitted && !form.vigenteHasta" />
                <small v-if="submitted && !form.vigenteHasta" class="text-red-500">
                  La fecha de fin de vigencia es requerida
                </small>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMsg" class="rounded-md bg-red-50 p-4">
              <p class="text-sm text-red-800">{{ errorMsg }}</p>
            </div>

            <!-- Success Message -->
            <div v-if="successMsg" class="rounded-md bg-green-50 p-4">
              <p class="text-sm text-green-800">{{ successMsg }}</p>
            </div>

            <!-- Buttons -->
            <div class="flex justify-end gap-3">
              <Button type="button" label="Cancelar" severity="secondary" outlined @click="onCancel"
                :disabled="loading" />
              <Button type="submit" :label="isEditing ? 'Actualizar' : 'Guardar'" :loading="loading" />
            </div>
          </form>
        </template>
      </Card>
    </div>
  </template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Card from 'primevue/card'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import type { HorarioForm } from '@/interfaces/horario/IHorario'
import { DIAS_SEMANA } from '@/interfaces/horario/IHorario'
import type { Instalacion } from '@/interfaces/instalaciones/instalaciones'
import { obtenerTodasLasInstalaciones } from '@/api/instalaciones/instalacionesApi'
import {
  createHorario,
  updateHorario,
  getHorarioById,
} from '@/api/horarios/horariosApi'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const submitted = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const instalaciones = ref<Instalacion[]>([])

const form = reactive<HorarioForm>({
  instalacionId: null,
  diaSemana: null,
  horaInicio: '',
  horaFin: '',
  vigenteDesde: null,
  vigenteHasta: null,
})

// Computed para determinar si estamos editando
const isEditing = computed(() => !!route.params.id)

// Refs para los DatePickers de tiempo (necesitamos Date objects)
const horaInicioDate = ref<Date | null>(null)
const horaFinDate = ref<Date | null>(null)

// Watchers para sincronizar los time pickers con el form
watch(horaInicioDate, (newVal) => {
  if (newVal) {
    const hours = String(newVal.getHours()).padStart(2, '0')
    const minutes = String(newVal.getMinutes()).padStart(2, '0')
    form.horaInicio = `${hours}:${minutes}`
  }
})

watch(horaFinDate, (newVal) => {
  if (newVal) {
    const hours = String(newVal.getHours()).padStart(2, '0')
    const minutes = String(newVal.getMinutes()).padStart(2, '0')
    form.horaFin = `${hours}:${minutes}`
  }
})

// Función para convertir string "HH:mm" a Date
const timeStringToDate = (timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date
}

// Cargar instalaciones
const loadInstalaciones = async () => {
  try {
    instalaciones.value = await obtenerTodasLasInstalaciones() || []
  } catch (error) {
    console.error('Error cargando instalaciones:', error)
    errorMsg.value = 'Error al cargar las instalaciones'
  }
}

// Cargar horario para editar
const loadHorario = async (id: number) => {
  try {
    loading.value = true
    const horario = await getHorarioById(id)

    form.id = horario.id
    form.instalacionId = horario.instalacionId
    form.diaSemana = horario.diaSemana
    form.horaInicio = horario.horaInicio
    form.horaFin = horario.horaFin

    // Convertir strings a Date objects
    if (horario.horaInicio) {
      horaInicioDate.value = timeStringToDate(horario.horaInicio)
    }
    if (horario.horaFin) {
      horaFinDate.value = timeStringToDate(horario.horaFin)
    }
    if (horario.vigenteDesde) {
      form.vigenteDesde = new Date(horario.vigenteDesde)
    }
    if (horario.vigenteHasta) {
      form.vigenteHasta = new Date(horario.vigenteHasta)
    }
  } catch (error) {
    console.error('Error cargando horario:', error)
    errorMsg.value = 'Error al cargar el horario'
  } finally {
    loading.value = false
  }
}

// Validar formulario
const validateForm = (): boolean => {
  if (!form.instalacionId) return false
  if (form.diaSemana === null) return false
  if (!form.horaInicio) return false
  if (!form.horaFin) return false
  if (!form.vigenteDesde) return false
  if (!form.vigenteHasta) return false
  return true
}

// Submit
const onSubmit = async () => {
  submitted.value = true
  errorMsg.value = ''
  successMsg.value = ''

  if (!validateForm()) {
    errorMsg.value = 'Por favor complete todos los campos requeridos'
    return
  }

  try {
    loading.value = true

    if (isEditing.value) {
      await updateHorario(form.id!, form)
      successMsg.value = 'Horario actualizado exitosamente'
    } else {
      await createHorario(form)
      successMsg.value = 'Horario creado exitosamente'
    }

    // Redirigir después de 1.5 segundos
    setTimeout(() => {
      router.push('/horarios')
    }, 1500)
  } catch (error) {
    console.error('Error guardando horario:', error)
    if (axios.isAxiosError(error)) {
      errorMsg.value = error.response?.data?.message || 'Error al guardar el horario'
    } else {
      errorMsg.value = 'Error al guardar el horario'
    }
  } finally {
    loading.value = false
  }
}

// Cancelar
const onCancel = () => {
  router.push('/horarios')
}

// Inicialización
onMounted(async () => {
  await loadInstalaciones()

  if (isEditing.value) {
    const id = Number(route.params.id)
    if (!isNaN(id)) {
      await loadHorario(id)
    }
  }
})
</script>
