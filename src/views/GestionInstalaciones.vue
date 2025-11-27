<template>
  <div class="instalaciones-root bg-[#0a0f1a] min-h-screen">

    <!-- Contenido principal con glass card -->
    <div class="content-wrapper">
      <div class="glass-card-modern">
        <!-- Filtros mejorados -->
        <div class="filters-modern">
          <div class="filter-group-modern">
            <label class="filter-label">Filtrar por estado:</label>
            <div class="filter-buttons-modern">
              <Button 
                label="Todos" 
                :outlined="filtroEstado !== 'TODOS'"
                @click="filtroEstado = 'TODOS'"
                size="small"
                class="filter-btn"
                :class="{ 'filter-btn-active': filtroEstado === 'TODOS' }"
              />
              <Button 
                label="Activos" 
                :outlined="filtroEstado !== 'ACTIVO'"
                severity="success"
                @click="filtroEstado = 'ACTIVO'"
                size="small"
                class="filter-btn filter-btn-success"
                :class="{ 'filter-btn-active': filtroEstado === 'ACTIVO' }"
              />
              <Button 
                label="Inactivos" 
                :outlined="filtroEstado !== 'INACTIVO'"
                severity="danger"
                @click="filtroEstado = 'INACTIVO'"
                size="small"
                class="filter-btn filter-btn-danger"
                :class="{ 'filter-btn-active': filtroEstado === 'INACTIVO' }"
              />
            </div>
          </div>
          
          <!-- Estadísticas mejoradas -->
          <div class="stats-modern">
            <div class="stat-card">
              <span class="stat-value">{{ instalaciones.length }}</span>
              <span class="stat-label">Total</span>
            </div>
            <div class="stat-card stat-success">
              <span class="stat-value">{{ instalacionesActivas }}</span>
              <span class="stat-label">Activos</span>
            </div>
            <div class="stat-card stat-danger">
              <span class="stat-value">{{ instalacionesInactivas }}</span>
              <span class="stat-label">Inactivos</span>
            </div>
          </div>

          <Button 
          label="Nueva Instalación" 
          icon="pi pi-plus" 
          @click="abrirDialogoCrear"
          class="btn-primary-glow"
        />

        </div>
      
        <!-- DataTable mejorado -->
        <DataTable 
          :value="instalacionesFiltradas" 
          :loading="cargando"
          paginator 
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          stripedRows
          showGridlines
          class="modern-datatable"
          :pt="{
            header: { class: 'table-header-modern' },
            bodyRow: { class: 'table-row-modern' }
          }"
        >
          <Column field="nombre" header="Nombre" sortable>
            <template #body="slotProps">
              <div class="cell-content">
                <i class="pi pi-home cell-icon"></i>
                <span class="cell-text">{{ slotProps.data.nombre }}</span>
              </div>
            </template>
          </Column>
          
          <Column field="disciplinaNombre" header="Disciplina" sortable>
            <template #body="slotProps">
              <div class="cell-content">
                <i class="pi pi-th-large cell-icon text-blue-400"></i>
                <span class="cell-text">{{ slotProps.data.disciplinaNombre }}</span>
              </div>
            </template>
          </Column>
          
          <Column field="ubicacion" header="Ubicación" sortable>
            <template #body="slotProps">
              <div class="cell-content">
                <i class="pi pi-map-marker cell-icon text-purple-400"></i>
                <span class="cell-text">{{ slotProps.data.ubicacion }}</span>
              </div>
            </template>
          </Column>
          
          <Column field="estado" header="Estado" sortable>
            <template #body="slotProps">
              <Tag 
                :value="slotProps.data.estado" 
                :severity="slotProps.data.estado === 'ACTIVO' ? 'success' : 'danger'"
                class="tag-modern"
              />
            </template>
          </Column>
          
          <Column header="Acciones">
            <template #body="slotProps">
              <div class="acciones-modern">
                <Button 
                  :label="slotProps.data.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'"
                  :icon="slotProps.data.estado === 'ACTIVO' ? 'pi pi-times' : 'pi pi-check'"
                  :severity="slotProps.data.estado === 'ACTIVO' ? 'danger' : 'success'"
                  size="small"
                  @click="confirmarCambioEstado(slotProps.data)"
                  class="action-btn"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Diálogo mejorado para crear instalación -->
    <Dialog 
      v-model:visible="dialogoVisible" 
      modal 
      header="Nueva Instalación"
      :style="{ width: '500px' }"
      class="dialog-modern"
      :pt="{
        root: { class: 'dialog-glass' },
        header: { class: 'dialog-header-modern' }
      }"
    >
      <div class="form-grid-modern">
        <div class="form-field-modern">
          <label for="nombre">
            <i class="pi pi-home"></i>
            Nombre *
          </label>
          <InputText 
            id="nombre" 
            v-model="formulario.nombre" 
            placeholder="Ej: Cancha Central"
            class="input-modern"
          />
        </div>

        <div class="form-field-modern">
          <label for="ubicacion">
            <i class="pi pi-map-marker"></i>
            Ubicación *
          </label>
          <InputText 
            id="ubicacion" 
            v-model="formulario.ubicacion" 
            placeholder="Ej: Sector Norte, Bloque A"
            class="input-modern"
          />
        </div>

        <div class="form-field-modern">
          <label for="disciplina">
            <i class="pi pi-th-large"></i>
            Disciplina *
          </label>
          <Dropdown 
            id="disciplina"
            v-model="formulario.disciplinaId" 
            :options="disciplinas"
            optionLabel="nombre"
            optionValue="id"
            placeholder="Selecciona una disciplina"
            class="dropdown-modern"
          />
        </div>

        <div class="form-field-modern">
          <label for="estado">
            <i class="pi pi-info-circle"></i>
            Estado Inicial
          </label>
          <Dropdown 
            id="estado"
            v-model="formulario.estado" 
            :options="estadosDisponibles"
            placeholder="Selecciona un estado"
            class="dropdown-modern"
          />
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer-modern">
          <Button label="Cancelar" text @click="cerrarDialogo" class="btn-cancel" />
          <Button 
            label="Crear" 
            icon="pi pi-check" 
            @click="crearNuevaInstalacion"
            :loading="guardando"
            class="btn-primary-glow"
          />
        </div>
      </template>
    </Dialog>

    <!-- Diálogo de confirmación mejorado -->
    <Dialog 
      v-model:visible="dialogoConfirmacion" 
      modal 
      header="Confirmar cambio de estado"
      :style="{ width: '450px' }"
      class="dialog-modern"
      :pt="{
        root: { class: 'dialog-glass' },
        header: { class: 'dialog-header-modern' }
      }"
    >
      <div class="confirmation-content">
        <div class="confirmation-icon" :class="instalacionSeleccionada?.estado === 'ACTIVO' ? 'danger' : 'success'">
          <i :class="instalacionSeleccionada?.estado === 'ACTIVO' ? 'pi pi-times-circle' : 'pi pi-check-circle'"></i>
        </div>
        <p class="confirmation-text">
          ¿Estás seguro de que deseas 
          <strong class="highlight">{{ instalacionSeleccionada?.estado === 'ACTIVO' ? 'desactivar' : 'activar' }}</strong>
          la instalación 
          <strong class="highlight">{{ instalacionSeleccionada?.nombre }}</strong>?
        </p>
      </div>

      <template #footer>
        <div class="dialog-footer-modern">
          <Button label="Cancelar" text @click="dialogoConfirmacion = false" class="btn-cancel" />
          <Button 
            :label="instalacionSeleccionada?.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'"
            :severity="instalacionSeleccionada?.estado === 'ACTIVO' ? 'danger' : 'success'"
            @click="ejecutarCambioEstado"
            :loading="cambiandoEstado"
            class="btn-confirm"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Tag from 'primevue/tag'
import type { Instalacion } from '@/interfaces/instalaciones/instalaciones'
import { 
  obtenerTodasLasInstalaciones, 
  cambiarEstadoInstalacion,
  crearInstalacion,
  obtenerDisciplinas,
  type CrearInstalacionDTO 
} from '@/api/instalaciones/instalacionesApi'

const instalaciones = ref<Instalacion[]>([])
const cargando = ref(false)
const dialogoVisible = ref(false)
const dialogoConfirmacion = ref(false)
const guardando = ref(false)
const cambiandoEstado = ref(false)
const instalacionSeleccionada = ref<Instalacion | null>(null)

const formulario = ref<CrearInstalacionDTO>({
  nombre: '',
  ubicacion: '',
  disciplinaId: 0,
  estado: 'ACTIVO'
})

const estadosDisponibles = ['ACTIVO', 'INACTIVO']
const disciplinas = ref<Array<{ id: number; nombre: string }>>([])
const filtroEstado = ref<'TODOS' | 'ACTIVO' | 'INACTIVO'>('TODOS')

const instalacionesActivas = computed(() => 
  instalaciones.value.filter(i => i.estado === 'ACTIVO').length
)

const instalacionesInactivas = computed(() => 
  instalaciones.value.filter(i => i.estado === 'INACTIVO').length
)

const instalacionesFiltradas = computed(() => {
  if (filtroEstado.value === 'TODOS') {
    return instalaciones.value
  }
  return instalaciones.value.filter(i => i.estado === filtroEstado.value)
})

async function cargarInstalaciones() {
  cargando.value = true
  try {
    console.log('🔄 Cargando todas las instalaciones...')
    const data = await obtenerTodasLasInstalaciones()
    if (data) {
      instalaciones.value = data
      console.log(`✅ Instalaciones cargadas:`, {
        total: data.length,
        activas: data.filter(i => i.estado === 'ACTIVO').length,
        inactivas: data.filter(i => i.estado === 'INACTIVO').length
      })
    }
  } catch (error) {
    console.error('❌ Error al cargar instalaciones:', error)
  } finally {
    cargando.value = false
  }
}

async function cargarDisciplinas() {
  try {
    console.log('🔄 Cargando disciplinas...')
    const data = await obtenerDisciplinas()
    if (data) {
      disciplinas.value = data
      console.log(`✅ Disciplinas cargadas: ${data.length}`, data)
    }
  } catch (error) {
    console.error('❌ Error al cargar disciplinas:', error)
  }
}

function abrirDialogoCrear() {
  dialogoVisible.value = true
  // Recargar disciplinas al abrir el diálogo para asegurar que estén actualizadas
  if (disciplinas.value.length === 0) {
    cargarDisciplinas()
  }
}

function cerrarDialogo() {
  dialogoVisible.value = false
  formulario.value = {
    nombre: '',
    ubicacion: '',
    disciplinaId: 0,
    estado: 'ACTIVO'
  }
}

async function crearNuevaInstalacion() {
  if (!formulario.value.nombre || !formulario.value.ubicacion || !formulario.value.disciplinaId) {
    return
  }

  guardando.value = true
  try {
    await crearInstalacion(formulario.value)
    await cargarInstalaciones()
    cerrarDialogo()
  } finally {
    guardando.value = false
  }
}

function confirmarCambioEstado(instalacion: Instalacion) {
  instalacionSeleccionada.value = instalacion
  dialogoConfirmacion.value = true
}

async function ejecutarCambioEstado() {
  if (!instalacionSeleccionada.value) return

  const nuevoEstado = instalacionSeleccionada.value.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO'
  
  cambiandoEstado.value = true
  try {
    await cambiarEstadoInstalacion(instalacionSeleccionada.value.id, nuevoEstado)
    await cargarInstalaciones()
    dialogoConfirmacion.value = false
    instalacionSeleccionada.value = null
  } finally {
    cambiandoEstado.value = false
  }
}

onMounted(() => {
  cargarInstalaciones()
  cargarDisciplinas()
})
</script>

<style scoped>
.instalaciones-root {
  min-height: 100vh;
  padding-bottom: 3rem;
}

/* Header mejorado */
.header-section {
  background: rgba(17, 25, 40, 0.8);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(116, 116, 116, 0);
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.header-text {
  flex: 1;
}

.title-gradient {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.subtitle-glow {
  color: #94a3b8;
  font-size: 1.1rem;
  text-shadow: 0 0 20px rgba(192, 200, 211, 0.123);
}

/* Contenido principal */
.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.glass-card-modern {
  background: rgba(17, 25, 40, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.125);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Filtros modernos */
.filters-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 1.5rem;
}

.filter-group-modern {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-label {
  font-weight: 600;
  color: #e2e8f0;
  font-size: 1rem;
}

.filter-buttons-modern {
  display: flex;
  gap: 0.75rem;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #94a3b8 !important;
  transition: all 0.3s ease !important;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  transform: translateY(-2px);
}

.filter-btn-active {
  background: rgba(96, 165, 250, 0.2) !important;
  border-color: #60a5fa !important;
  color: #60a5fa !important;
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
}

.filter-btn-success.filter-btn-active {
  background: rgba(74, 222, 128, 0.2) !important;
  border-color: #4ade80 !important;
  color: #4ade80 !important;
  box-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
}

.filter-btn-danger.filter-btn-active {
  background: rgba(248, 113, 113, 0.2) !important;
  border-color: #f87171 !important;
  color: #f87171 !important;
  box-shadow: 0 0 20px rgba(248, 113, 113, 0.3);
}

/* Estadísticas mejoradas */
.stats-modern {
  display: flex;
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  min-width: 100px;
}

.stat-card.stat-success {
  background: rgba(74, 222, 128, 0.1);
  border-color: rgba(74, 222, 128, 0.2);
}

.stat-card.stat-danger {
  background: rgba(248, 113, 113, 0.1);
  border-color: rgba(248, 113, 113, 0.2);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #60a5fa;
}

.stat-success .stat-value {
  color: #4ade80;
}

.stat-danger .stat-value {
  color: #f87171;
}

.stat-label {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

/* DataTable mejorado */
:deep(.modern-datatable) {
  
  color: #e2e8f0 !important;
}

:deep(.modern-datatable .p-datatable-header) {

  border: none !important;
}

:deep(.modern-datatable .p-datatable-thead > tr > th) {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #60a5fa !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  font-weight: 600 !important;
  padding: 1rem !important;
}

:deep(.modern-datatable .p-datatable-tbody > tr) {
  background: rgba(255, 255, 255, 0.02) !important;
  color: #e2e8f0 !important;
  transition: all 0.3s ease !important;
}

:deep(.modern-datatable .p-datatable-tbody > tr:hover) {
  background: rgba(96, 165, 250, 0.1) !important;
}

:deep(.modern-datatable .p-datatable-tbody > tr > td) {
  border-color: rgba(255, 255, 255, 0.05) !important;
  padding: 1rem !important;
}

:deep(.modern-datatable .p-paginator) {
  background: rgba(255, 255, 255, 0.02) !important;
  color: #e2e8f0 !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.modern-datatable .p-paginator .p-paginator-pages .p-paginator-page) {
  color: #94a3b8 !important;
}

:deep(.modern-datatable .p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: rgba(96, 165, 250, 0.2) !important;
  color: #60a5fa !important;
}

.cell-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cell-icon {
  color: #60a5fa;
  font-size: 1.1rem;
}

.cell-text {
  color: #e2e8f0;
}

.tag-modern {
  font-weight: 600 !important;
  padding: 0.5rem 1rem !important;
  border-radius: 8px !important;
}

.acciones-modern {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn {
  transition: all 0.3s ease !important;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Botones primarios con glow */
.btn-primary-glow {
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%) !important;
  border: none !important;
  color: white !important;
  font-weight: 600 !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 10px !important;
  box-shadow: 0 4px 20px rgba(96, 165, 250, 0.4) !important;
  transition: all 0.3s ease !important;
}

.btn-primary-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(96, 165, 250, 0.6) !important;
}

/* Diálogos modernos */
:deep(.dialog-glass .p-dialog) {
  background: rgba(17, 25, 40, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.125) !important;
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
}

:deep(.dialog-header-modern) {
  background: transparent !important;
  color: #e2e8f0 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 1.5rem !important;
  font-size: 1.5rem !important;
  font-weight: 600 !important;
}

:deep(.p-dialog .p-dialog-content) {
  background: transparent !important;
  color: #e2e8f0 !important;
  padding: 2rem 1.5rem !important;
}

:deep(.p-dialog .p-dialog-footer) {

  border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 1.5rem !important;
}

/* Formularios modernos */
.form-grid-modern {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field-modern {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-field-modern label {
  font-weight: 600;
  color: #e2e8f0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-field-modern label i {
  color: #60a5fa;
}

.input-modern,
.dropdown-modern {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #e2e8f0 !important;
  border-radius: 8px !important;
  padding: 0.75rem !important;
  transition: all 0.3s ease !important;
}

.input-modern:focus,
.dropdown-modern:focus {
  border-color: #60a5fa !important;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1) !important;
}

:deep(.dropdown-modern .p-dropdown-label) {
  color: #e2e8f0 !important;
}

:deep(.dropdown-modern .p-dropdown-trigger) {
  color: #60a5fa !important;
}

/* Confirmación */
.confirmation-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}

.confirmation-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}

.confirmation-icon.success {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
}

.confirmation-icon.danger {
  background: rgba(248, 113, 113, 0.2);
  color: #f87171;
}

.confirmation-text {
  color: #94a3b8;
  font-size: 1.1rem;
  line-height: 1.6;
}

.highlight {
  color: #60a5fa;
  font-weight: 600;
}

.dialog-footer-modern {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel {
  color: #94a3b8 !important;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.05) !important;
}

.btn-confirm {
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 900px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .title-gradient {
    font-size: 2rem;
  }

  .filters-modern {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-modern {
    width: 100%;
    justify-content: space-between;
  }

  .stat-card {
    flex: 1;
    min-width: auto;
  }
}
</style>