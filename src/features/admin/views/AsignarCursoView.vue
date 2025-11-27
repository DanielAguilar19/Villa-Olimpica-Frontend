<template>
  <div class="layout-grid">
    <div class="contenedor-area-trabajo">
      <div class="area mb-4">
        <h1 class="titulo-area">Creación de Sesiones de usuarios</h1>
        <p class="subtitle-area">
          Formulario para que un administrador cree una sesión de usuario en el sistema.
        </p>
      </div>

      <form @submit.prevent="submit" class="form-grid" style="width: 100%">
        <!-- Curso -->
        <div class="fila">
          <div class="caja-izquierda">Curso <span class="required">*</span></div>
          <div class="caja-derecha">
            <Dropdown v-model="formLocal.cursoId" :options="cursos" optionLabel="nombre" optionValue="id"
              placeholder="Ver cursos disponibles" :showClear="true" :disabled="loadingCursos" class="w-full" />
            <small v-if="errors.cursoId" class="error-msg">{{ errors.cursoId }}</small>
          </div>
        </div>

        <!-- Instalación -->
        <div class="fila">
          <div class="caja-izquierda">Instalación <span class="required">*</span></div>
          <div class="caja-derecha">
            <Dropdown v-model="formLocal.instalacionId" :options="instalaciones" optionLabel="nombre" optionValue="id"
              placeholder="Selecciona instalación" :showClear="true" :disabled="loadingInstalaciones" class="w-full" />
            <small v-if="errors.instalacionId" class="error-msg">{{ errors.instalacionId }}</small>
          </div>
        </div>

        <!-- Estado -->
        <div class="fila">
          <div class="caja-izquierda">Estado <span class="required">*</span></div>
          <div class="caja-derecha">
            <Dropdown v-model="formLocal.estado" :options="estados" optionLabel="label" optionValue="value"
              placeholder="Selecciona estado" :showClear="true" class="w-full" />
            <small v-if="errors.estado" class="error-msg">{{ errors.estado }}</small>
          </div>
        </div>

        <!-- Día -->
        <div class="fila">
          <div class="caja-izquierda">Día <span class="required">*</span></div>
          <div class="caja-derecha">
            <!-- DatePicker usa Date | null -->
            <DatePicker v-model="formLocal.dia" showIcon :placeholder="'Seleccionar día'" class="w-full" />
            <small v-if="errors.dia" class="error-msg">{{ errors.dia }}</small>
          </div>
        </div>

        <!-- Hora Inicio -->
        <div class="fila">
          <div class="caja-izquierda">Hora Inicio <span class="required">*</span></div>
          <div class="caja-derecha">
            <DatePicker v-model="formLocal.horaInicio" timeOnly :placeholder="'Hora inicio'" class="w-full" />
            <small v-if="errors.horaInicio" class="error-msg">{{ errors.horaInicio }}</small>
          </div>
        </div>

        <!-- Hora Fin -->
        <div class="fila">
          <div class="caja-izquierda">Hora Fin <span class="required">*</span></div>
          <div class="caja-derecha">
            <DatePicker v-model="formLocal.horaFin" timeOnly :placeholder="'Hora fin'" class="w-full" />
            <small v-if="errors.horaFin" class="error-msg">{{ errors.horaFin }}</small>
          </div>
        </div>

        <!-- Cupos -->
        <div class="fila">
          <div class="caja-izquierda">Cupos <span class="required">*</span></div>
          <div class="caja-derecha">
            <InputNumber v-model="formLocal.cupos" :min="1" class="w-full" />
            <small v-if="errors.cupos" class="error-msg">{{ errors.cupos }}</small>
          </div>
        </div>

        <!-- Acciones -->
        <div class="fila acciones">
          <div class="caja-izquierda"></div>
          <div class="caja-derecha">
            <div class="botones">
              <Button type="button" label="Limpiar" icon="pi pi-refresh" class="btn-ghost" @click="resetForm"
                :disabled="saving" />
              <Button type="submit" label="Crear sesión de curso" icon="pi pi-user-plus" class="btn-primary"
                :loading="saving" />
            </div>
          </div>
        </div>
      </form>

      <Toast />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import DatePicker from 'primevue/datepicker'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

/**
 * Importa tu tipo CrearSesion desde tu archivo de interfaces.
 * Si la ruta es distinta ajústala.
 */
import type { CrearSesion } from '@/interfaces/sesiones/ISesion'
import { getAllCursos, getAllInstalaciones, crearSesion } from '@/api/sesiones/sesionesApi'
import type { Instalacion } from '@/interfaces/instalaciones/instalaciones'

const toast = useToast()
const cursos = ref<{ id: number; nombre: string; estado?: string }[]>([])
const instalaciones = ref<Instalacion[]>([])
const estados = ref([
  { label: 'Activo', value: 'ACTIVO' },
  { label: 'Inactivo', value: 'INACTIVO' },
])
const loadingCursos = ref(false)
const loadingInstalaciones = ref(false)
const saving = ref(false)

// --------------------------------------------------
// formLocal usa Date | null para que DatePicker funcione
// --------------------------------------------------
const formLocal = reactive({
  cursoId: 0 as number,
  instalacionId: 0 as number,
  estado: '' as string,
  cupos: 0 as number,
  dia: null as Date | null,
  horaInicio: null as Date | null,
  horaFin: null as Date | null,
})

const errors = reactive<{ [k: string]: string }>({})

onMounted(() => {
  loadCursos()
  loadInstalaciones()
})

async function loadCursos() {
  loadingCursos.value = true
  try {
    const res = await getAllCursos()
    if (!res || res.length === 0) {
      toast.add({ severity: 'warn', summary: 'Sin cursos', detail: 'No hay cursos disponibles' })
      cursos.value = []
    } else {
      cursos.value = res
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((c: any) => (c.estado ?? '').toString().toUpperCase() === 'ACTIVO')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((c: any) => ({
          id: c.idCurso ?? c.id,
          nombre: c.nombreCurso ?? c.nombre,
          estado: c.estado,
        }))
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los cursos' })
    cursos.value = []
    console.error(err)
  } finally {
    loadingCursos.value = false
  }
}

async function loadInstalaciones() {
  loadingInstalaciones.value = true
  try {
    const res = await getAllInstalaciones()
    if (res && res.length > 0 && res[0] && 'idInstalacion' in res[0] && 'nombreInstalacion' in res[0]) {
      instalaciones.value = res
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((i: any) => (i.estado ?? '').toString().toUpperCase() === 'ACTIVO')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((i: any) => ({
          id: i.idInstalacion,
          nombre: i.nombreInstalacion,
          estado: i.estado,
          ubicacion: i.ubicacion || '',
          disciplinaId: i.disciplinaId || 0,
          disciplinaNombre: i.disciplinaNombre || '',
        }))
    } else {
      instalaciones.value = (res || []).filter((i: Instalacion) => (i.estado ?? '').toString().toUpperCase() === 'ACTIVO')
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las instalaciones' })
    instalaciones.value = []
    console.error(err)
  } finally {
    loadingInstalaciones.value = false
  }
}

// ---------- VALIDACIÓN ----------
function validateField(field: string) {
  switch (field) {
    case 'cursoId':
      errors.cursoId = !formLocal.cursoId || formLocal.cursoId === 0 ? 'Seleccione un curso' : ''
      break
    case 'instalacionId':
      errors.instalacionId = !formLocal.instalacionId || formLocal.instalacionId === 0 ? 'Seleccione una instalación' : ''
      break
    case 'estado':
      errors.estado = !formLocal.estado ? 'Seleccione un estado' : ''
      break
    case 'cupos':
      errors.cupos = !formLocal.cupos || formLocal.cupos < 1 ? 'Ingrese cupos válidos' : ''
      break
    case 'dia':
      errors.dia = !formLocal.dia ? 'Seleccione un día' : ''
      break
    case 'horaInicio':
      errors.horaInicio = !formLocal.horaInicio ? 'Seleccione la hora de inicio' : ''
      break
    case 'horaFin':
      errors.horaFin = !formLocal.horaFin ? 'Seleccione la hora de fin' : ''
      break
  }
}

function validateAll(): boolean {
  validateField('cursoId')
  validateField('instalacionId')
  validateField('estado')
  validateField('cupos')
  validateField('dia')
  validateField('horaInicio')
  validateField('horaFin')
  return !Object.values(errors).some((e) => !!e)
}

function resetForm() {
  formLocal.cursoId = 0
  formLocal.instalacionId = 0
  formLocal.estado = ''
  formLocal.cupos = 0
  formLocal.dia = null
  formLocal.horaInicio = null
  formLocal.horaFin = null
  for (const k in errors) delete errors[k]
}

function dateToISOStringOrNull(d: Date | null) {
  if (!d) return null
  return d.toISOString()
}

async function submit() {
  if (!validateAll()) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Corrija los errores en el formulario' })
    return
  }

  saving.value = true
  try {
    const payload: CrearSesion = {
      cursoId: Number(formLocal.cursoId),
      instalacionId: Number(formLocal.instalacionId),
      cupos: Number(formLocal.cupos),
      dia: dateToISOStringOrNull(formLocal.dia),
      horaInicio: dateToISOStringOrNull(formLocal.horaInicio),
      horaFin: dateToISOStringOrNull(formLocal.horaFin),
    }

    await crearSesion(payload)
    toast.add({ severity: 'success', summary: 'Creado', detail: 'Sesión creada correctamente' })
    resetForm()
  } catch (err: unknown) {
    console.error('Error al crear sesión:', err)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toast.add({ severity: 'error', summary: 'Error', detail: (err as any)?.message ?? String(err) })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.layout-grid {
  display: flex;
  width: 100%;
  justify-content: center;
  padding-top: 1rem;
  padding-bottom: 2rem;
}

.contenedor-area-trabajo {
  width: 100%;
  max-width: 1100px;
  background: linear-gradient(180deg, rgba(25, 81, 127, 0.6), rgba(3, 37, 65, 0.75));
  padding: 26px;
  border-radius: 12px;
  border: 1px solid rgba(11, 92, 255, 0.06);
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.45);
}

/* encabezado */
.titulo-area {
  font-size: 1.25rem;
  margin: 0;
  color: #e6f0ff;
}

.subtitle-area {
  color: rgba(230, 240, 255, 0.7);
  margin-top: 6px;
  font-size: 0.95rem;
}

/* grid del formulario */
.form-grid {
  margin-top: 12px;
}

/* fila: label + control */
.fila {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

/* label */
.caja-izquierda {
  min-width: 200px;
  max-width: 260px;
  color: rgba(230, 240, 255, 0.78);
  font-weight: 700;
}

/* control area */
.caja-derecha {
  flex: 1;
}

/* acciones */
.acciones .caja-derecha {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
}

.botones {
  display: inline-flex;
  gap: 10px;
  align-items: center;
}

/* botones */
.btn-primary {
  background: linear-gradient(180deg, #0b5cff, #063a9a) !important;
  border: none !important;
  color: #fff !important;
  box-shadow: 0 8px 18px rgba(11, 92, 255, 0.12);
}

.btn-ghost {
  background: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
  color: rgba(230, 240, 255, 0.88) !important;
}

/* errores */
.error-msg {
  color: #ffb4b4;
  font-size: 0.86rem;
  margin-top: 6px;
}

/* responsive: apilar en móvil */
@media (max-width: 780px) {
  .fila {
    display: block;
  }

  .caja-izquierda {
    margin-bottom: 6px;
    min-width: auto;
    max-width: none;
  }

  .acciones .caja-derecha {
    justify-content: stretch;
    flex-direction: column;
  }

  .btn-primary,
  .btn-ghost {
    width: 100%;
  }
}

/* Force full width on PrimeVue input components inside caja-derecha */
::v-deep .p-inputtext,
::v-deep .p-password,
::v-deep .p-password input.p-inputtext {
  width: 100% !important;
  box-sizing: border-box !important;
}

/* si usas la clase .w-full en plantillas sin Tailwind, garantizarla */
::v-deep .w-full {
  width: 100% !important;
}
</style>
