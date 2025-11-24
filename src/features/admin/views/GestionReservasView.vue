<!-- src/features/admin/views/GestionReservasView.vue -->
<template>
  <div class="gestion-reservas">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h2>Gestión de Reservas</h2>
        <p class="subtitle">Administra y controla todas las reservas del sistema</p>
      </div>
      <button @click="exportarReservas" class="btn-secondary">
        <span class="btn-icon">
          <i class="pi pi-cloud-download" style="color: #2563eb; font-size: 1.3rem;"></i>
        </span>
        Exportar
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: #3b82f6;"></i>
      <p>Cargando reservas...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: #ef4444;"></i>
      <p>Error al cargar reservas</p>
      <button @click="cargarReservas" class="btn-primary">Reintentar</button>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Filtros  -->
      <div class="filters-section">
        <div class="filters-row">
          <div class="search-box">
            <span class="search-icon">
              <i class="pi pi-search" style="color: #9CA3AF; font-size: 1.4rem;"></i>
            </span>
            <input v-model="filtros.busqueda" type="text" placeholder="Buscar por usuario, instalación..."
              class="search-input" />
          </div>

          <select v-model="filtros.estado" class="select-filter">
            <option value="">Todos los estados</option>
            <option value="activa">Activa</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>

          <select v-model="filtros.disciplina" class="select-filter">
            <option value="">Todas las disciplinas</option>
            <option v-for="disc in disciplinasUnicas" :key="disc" :value="disc">
              {{ disc }}
            </option>
          </select>

          <input v-model="filtros.fecha" type="date" class="date-filter" />
        </div>

        <div class="filters-actions">
          <button @click="limpiarFiltros" class="btn-clear">
            <i class="pi pi-trash" style="color: white;"></i>
            Limpiar filtros
          </button>
          <div class="results-count">
            {{ reservasFiltradas.length }} reserva(s)
          </div>
        </div>
      </div>

      <!-- Tabla de reservas -->
      <div class="card">
        <div class="table-container">
          <table v-if="reservasFiltradas.length > 0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Disciplina</th>
                <th>Instalación</th>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="reserva in reservasFiltradas" :key="reserva.id">
                <td class="id-column">#{{ reserva.id }}</td>
                <td>
                  <div class="user-info">
                    <div class="user-avatar">{{ getInitials(reserva.usuario) }}</div>
                    <strong>{{ reserva.usuario }}</strong>
                  </div>
                </td>
                <td>
                  <span class="disciplina-tag">{{ reserva.disciplina }}</span>
                </td>
                <td>{{ reserva.instalacion }}</td>
                <td>{{ formatDate(reserva.fecha) }}</td>
                <td>
                  <span class="horario">{{ reserva.horaInicio }} - {{ reserva.horaFin }}</span>
                </td>
                <td>
                  <span :class="['badge', `badge-${reserva.estado}`]">
                    {{ getEstadoLabel(reserva.estado) }}
                  </span>
                </td>
                <td class="actions-column">
                  <div class="action-buttons">
                    <button @click="verDetalle(reserva)" class="btn-action btn-view" title="Ver detalles">
                      <i class="pi pi-info-circle" style="color: #F59E0B; font-size: 1.3rem;"></i>
                    </button>
                    <button v-if="reserva.estado === 'pendiente'" @click="confirmarReserva(reserva)"
                      class="btn-action btn-confirm" title="Confirmar reserva">
                      ✅
                    </button>
                    <button v-if="reserva.estado !== 'cancelada' && reserva.estado !== 'completada'"
                      @click="cancelarReserva(reserva)" class="btn-action btn-cancel" title="Cancelar reserva">
                      <i class="pi pi-calendar-times" style="color: red; font-size: 1.3rem;"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Estado vacío -->
          <div v-else class="empty-state">
            <span class="empty-icon">
              <i class="pi pi-calendar-times" style="color: #6B7280; font-size: 5rem;"></i>
            </span>
            <h3>No se encontraron reservas</h3>
            <p>
              {{
                filtros.busqueda || filtros.estado || filtros.disciplina
                  ? 'Intenta ajustar los filtros'
                  : 'Aún no hay reservas registradas'
              }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal de detalles -->
    <Transition name="modal">
      <div v-if="mostrarModal && reservaSeleccionada" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-content modal-large">
          <div class="modal-header">
            <h3>
              <i class="pi pi-info-circle" style="color: #F59E0B; font-size: 1.4rem;"></i>
              Detalles de Reserva #{{ reservaSeleccionada.id }}
            </h3>
            <button @click="cerrarModal" class="btn-close">✕</button>
          </div>

          <div class="modal-body">
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Usuario:</span>
                <span class="detail-value">{{ reservaSeleccionada.usuario }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ reservaSeleccionada.email || 'No disponible' }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Disciplina:</span>
                <span class="detail-value">{{ reservaSeleccionada.disciplina }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Instalación:</span>
                <span class="detail-value">{{ reservaSeleccionada.instalacion }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Fecha:</span>
                <span class="detail-value">{{ formatDate(reservaSeleccionada.fecha) }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Horario:</span>
                <span class="detail-value">
                  {{ reservaSeleccionada.horaInicio }} - {{ reservaSeleccionada.horaFin }}
                </span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Estado:</span>
                <span :class="['badge', `badge-${reservaSeleccionada.estado}`]">
                  {{ getEstadoLabel(reservaSeleccionada.estado) }}
                </span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Fecha de creación:</span>
                <span class="detail-value">{{ formatDateTime(reservaSeleccionada.fechaCreacion) }}</span>
              </div>
            </div>

            <div v-if="reservaSeleccionada.notas" class="notes-section">
              <h4>Notas:</h4>
              <p>{{ reservaSeleccionada.notas }}</p>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="cerrarModal" class="btn-secondary">Cerrar</button>
            <button v-if="reservaSeleccionada.estado === 'pendiente'" @click="confirmarReserva(reservaSeleccionada)"
              class="btn-primary">
              ✅ Confirmar Reserva
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { obtenerTodasReservas } from '@/api/reserva/reservaApi';
import { obtenerDisciplinas } from '@/api/disciplinas/disciplinasApi';
import type { obtenerReservas } from '@/interfaces/reserva/reserva';
import type { Disciplina } from '@/interfaces/disciplinas/disciplinas';

// Interface para la vista
interface ReservaView {
  id: number;
  usuario: string;
  email?: string;
  disciplina: string;
  instalacion: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: 'activa' | 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  fechaCreacion: string;
  notas?: string;
}

interface Filtros {
  busqueda: string;
  estado: string;
  disciplina: string;
  fecha: string;
}

// Estado reactivo
const reservas = ref<ReservaView[]>([]);
const disciplinas = ref<Disciplina[]>([]);
const loading = ref(false);
const error = ref(false);
const mostrarModal = ref(false);
const reservaSeleccionada = ref<ReservaView | null>(null);

const filtros = ref<Filtros>({
  busqueda: '',
  estado: '',
  disciplina: '',
  fecha: ''
});

// Computed
const reservasFiltradas = computed(() => {
  return reservas.value.filter(r => {
    const matchBusqueda =
      !filtros.value.busqueda ||
      r.usuario.toLowerCase().includes(filtros.value.busqueda.toLowerCase()) ||
      r.instalacion.toLowerCase().includes(filtros.value.busqueda.toLowerCase());

    const matchEstado = !filtros.value.estado || r.estado === filtros.value.estado;
    const matchDisciplina = !filtros.value.disciplina || r.disciplina === filtros.value.disciplina;
    const matchFecha = !filtros.value.fecha || r.fecha === filtros.value.fecha;

    return matchBusqueda && matchEstado && matchDisciplina && matchFecha;
  });
});

const disciplinasUnicas = computed(() => {
  const disciplinasSet = new Set(reservas.value.map(r => r.disciplina));
  return Array.from(disciplinasSet).sort();
});

// Lifecycle
onMounted(async () => {
  await Promise.all([cargarReservas(), cargarDisciplinas()]);
});

// Transformar datos
const transformarReserva = (reserva: obtenerReservas): ReservaView => {
  // normalize raw payload in a safe way (no 'any')
  const raw = reserva as unknown as Record<string, unknown>;

  const inicio = new Date(
    typeof raw.inicioTs === 'string' || typeof raw.inicioTs === 'number'
      ? (raw.inicioTs as string | number)
      : Date.now()
  );
  const fin = new Date(
    typeof raw.finTs === 'string' || typeof raw.finTs === 'number'
      ? (raw.finTs as string | number)
      : Date.now()
  );

  const usuarioNombre =
    typeof raw.usuarioNombre === 'string' ? raw.usuarioNombre : undefined;
  const usuarioId =
    raw.usuarioId ??
    (typeof raw.usuario === 'object' &&
      raw.usuario !== null &&
      'id' in (raw.usuario as Record<string, unknown>)
      ? (raw.usuario as Record<string, unknown>).id
      : undefined);
  const usuario =
    usuarioNombre ?? `Usuario #${(typeof usuarioId === 'number' || typeof usuarioId === 'string') ? usuarioId : 'N/A'}`;

  const email =
    typeof raw.usuarioEmail === 'string'
      ? raw.usuarioEmail
      : typeof raw.email === 'string'
        ? raw.email
        : undefined;

  const disciplina =
    typeof raw.disciplinaNombre === 'string'
      ? raw.disciplinaNombre
      : typeof raw.disciplina === 'string'
        ? raw.disciplina
        : 'Sin disciplina';

  const instalacion =
    typeof raw.instalacionNombre === 'string'
      ? raw.instalacionNombre
      : typeof raw.instalacion === 'string'
        ? raw.instalacion
        : `Instalación #${String(raw.instalacionId ?? '')}`;

  // ensure string (split() indexing can produce undefined in TS)
  const iso = inicio.toISOString();
  const fecha = iso.split('T')[0] ?? '';

  const horaInicio = inicio.toTimeString().substring(0, 5);
  const horaFin = fin.toTimeString().substring(0, 5);

  // pick a creation date from common keys and ensure string
  const fechaCreacion =
    (typeof raw.creadoEn === 'string' && raw.creadoEn) ||
    (typeof raw.creado_en === 'string' && raw.creado_en) ||
    (typeof raw.creadoAt === 'string' && raw.creadoAt) ||
    '';

  const notas = typeof raw.notas === 'string' ? raw.notas : undefined;

  return {
    id: reserva.id,
    usuario,
    email,
    disciplina,
    instalacion,
    fecha,
    horaInicio,
    horaFin,
    estado: mapearEstado(String(reserva.estado ?? 'pendiente')),
    fechaCreacion,
    notas
  };
};

const mapearEstado = (
  estado: string
): 'activa' | 'pendiente' | 'confirmada' | 'completada' | 'cancelada' => {
  const estadoLower = estado.toLowerCase();
  const mapeo: Record<
    string,
    'activa' | 'pendiente' | 'confirmada' | 'completada' | 'cancelada'
  > = {
    activa: 'activa',
    active: 'activa',
    pendiente: 'pendiente',
    pending: 'pendiente',
    confirmada: 'confirmada',
    confirmed: 'confirmada',
    completada: 'completada',
    completed: 'completada',
    cancelada: 'cancelada',
    cancelled: 'cancelada',
    canceled: 'cancelada'
  };
  return mapeo[estadoLower] || 'pendiente';
};

// Métodos
const cargarReservas = async () => {
  loading.value = true;
  error.value = false;

  try {
    const data = await obtenerTodasReservas();
    reservas.value = data.map(transformarReserva);
    console.log(`✅ ${reservas.value.length} reservas cargadas`);
  } catch (err) {
    console.error('Error cargando reservas:', err);
    error.value = true;
    reservas.value = [];
  } finally {
    loading.value = false;
  }
};

const cargarDisciplinas = async () => {
  try {
    const data = await obtenerDisciplinas();
    if (data) {
      disciplinas.value = data;
    }
  } catch (err) {
    console.error('Error cargando disciplinas:', err);
    disciplinas.value = [];
  }
};

const verDetalle = (reserva: ReservaView) => {
  reservaSeleccionada.value = reserva;
  mostrarModal.value = true;
};

const confirmarReserva = async (reserva: ReservaView) => {
  try {
    // TODO: Implementar endpoint en backend
    // await axios.put(`${import.meta.env.VITE_API}/reservas/${reserva.id}/confirmar`);

    reserva.estado = 'confirmada';
    console.log('Reserva confirmada:', reserva);
    cerrarModal();

    alert('⚠️ Endpoint de confirmar pendiente en backend');
  } catch (error) {
    console.error('Error confirmando reserva:', error);
  }
};

const cancelarReserva = async (reserva: ReservaView) => {
  if (!confirm(`¿Cancelar la reserva de ${reserva.usuario}?`)) return;

  try {
    // TODO: Implementar endpoint en backend
    // await axios.put(`${import.meta.env.VITE_API}/reservas/${reserva.id}/cancelar`);

    reserva.estado = 'cancelada';
    console.log('Reserva cancelada:', reserva);

    alert('⚠️ Endpoint de cancelar pendiente en backend');
  } catch (error) {
    console.error('Error cancelando reserva:', error);
  }
};

const exportarReservas = () => {
  const headers = [
    'ID',
    'Usuario',
    'Email',
    'Disciplina',
    'Instalación',
    'Fecha',
    'Hora Inicio',
    'Hora Fin',
    'Estado'
  ];
  const rows = reservasFiltradas.value.map(r => [
    r.id,
    r.usuario,
    r.email || '',
    r.disciplina,
    r.instalacion,
    r.fecha,
    r.horaInicio,
    r.horaFin,
    r.estado
  ]);

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reservas_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const limpiarFiltros = () => {
  filtros.value = {
    busqueda: '',
    estado: '',
    disciplina: '',
    fecha: ''
  };
};

const cerrarModal = () => {
  mostrarModal.value = false;
  reservaSeleccionada.value = null;
};

// Utilidades
const getInitials = (nombre: string): string => {
  return nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const formatDate = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const formatDateTime = (fecha: string): string => {
  return new Date(fecha).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getEstadoLabel = (estado: string): string => {
  const labels: Record<string, string> = {
    activa: 'Activa',
    pendiente: 'Pendiente',
    confirmada: 'Confirmada',
    completada: 'Completada',
    cancelada: 'Cancelada'
  };
  return labels[estado] || estado;
};
</script>

<style scoped>
.gestion-reservas {
  max-width: 1600px;
  margin: 0 auto;
}

/* Loading y Error States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.loading-state p,
.error-state p {
  color: #64748b;
  font-size: 1rem;
}

.error-state .btn-primary {
  margin-top: 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
}

.page-header h2 {
  margin: 0 0 0.5rem;
  font-size: 1.875rem;
  color: #1e293b;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.9375rem;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: white;
  color: #475569;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.btn-icon {
  font-size: 1.125rem;
}

.filters-section {
  margin-bottom: 1.5rem;
}

.filters-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.125rem;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  color: rgba(0, 0, 0, 0.6);
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-filter,
.date-filter {
  padding: 0.875rem 1rem;
  border: 2px solid lightgray;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  background: #f6f6f7;
  color: rgba(0, 0, 0);
  cursor: pointer;
  transition: all 0.2s;
}

.date-filter::-webkit-calendar-picker-indicator {
  filter: invert(0.5) grayscale(100%);
  cursor: pointer;
  padding: 0.25rem;
  color: gray;
}

.date-filter::-webkit-calendar-picker-indicator:hover {
  filter: invert(0.3) grayscale(100%);
  border-radius: 0.25rem;
}

.date-filter:focus {
  outline: none;
  border-color: lightgray;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-filter:hover,
.date-filter:hover {
  border-color: #4e84c5;
}

.filters-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-clear {
  padding: 0.5rem 1rem;
  background: rgb(158, 158, 158);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear:hover {
  background: #aab0b1;
}

.results-count {
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border-radius: 0.375rem;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
}

.card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

th {
  text-align: left;
  padding: 1rem 1.5rem;
  font-weight: 600;
  color: #475569;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover {
  background: #f8fafc;
}

.id-column {
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: darkblue;
  font-weight: 600;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.75rem;
}

.disciplina-tag {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  background: #f1f5f9;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
}

.horario {
  color: #64748b;
  font-size: 0.875rem;
}

.badge {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.badge-activa {
  background: #dcfce7;
  color: #166534;
}

.badge-pendiente {
  background: #fef3c7;
  color: #92400e;
}

.badge-confirmada {
  background: #dbeafe;
  color: #1e40af;
}

.badge-completada {
  background: #dcfce7;
  color: #166534;
}

.badge-cancelada {
  background: #fee2e2;
  color: #991b1b;
}

.actions-column {
  width: 140px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  padding: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0.375rem;
}

.btn-action:hover {
  background: #f1f5f9;
  transform: scale(1.15);
}

.btn-view:hover {
  background: #f5e8da;
}

.btn-confirm:hover {
  background: #dcfce7;
}

.btn-cancel:hover {
  background: #fee2e2;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
}

.empty-state h3 {
  margin: 0 0 0.5rem;
  color: #1e293b;
  font-size: 1.25rem;
}

.empty-state p {
  margin: 0;
  color: #64748b;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-large {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1e293b;
}

.btn-close {
  width: 32px;
  height: 32px;
  border-radius: 0.375rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
}

.detail-value {
  font-size: 1rem;
  color: #1e293b;
}

.notes-section {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border-left: 3px solid #3b82f6;
}

.notes-section h4 {
  margin: 0 0 0.5rem;
  font-size: 0.9375rem;
  color: #1e293b;
}

.notes-section p {
  margin: 0;
  color: #475569;
  font-size: 0.9375rem;
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .filters-row {
    flex-direction: column;
  }

  .search-box {
    min-width: 100%;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
