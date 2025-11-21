<!-- src/features/admin/views/GestionDisciplinasView.vue -->
<template>
  <div class="gestion-disciplinas">
    <!-- Header con acción principal -->
    <div class="page-header">
      <div>
        <h2>Gestión de Disciplinas</h2>
        <p class="subtitle">Administra las disciplinas deportivas disponibles</p>
      </div>
      <button @click="nuevaDisciplina" class="btn-primary">
        <span class="btn-icon"><i class="pi pi-plus" style="color: whitesmoke;"></i></span>
        Nueva Disciplina
      </button>
    </div>

    <!-- Barra de filtros y búsqueda -->
    <div class="filters-bar">
      <div class="search-box">
        <span class="search-icon"><i class="pi pi-search" style="color: #9CA3AF; font-size: 1.4rem;"></i></span>
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar disciplina por nombre..."
          class="search-input"
        />
      </div>

      <select v-model="filtroEstado" class="select-filter">
        <option value=""> Todos los estados</option>
        <option value="true"> ✓ Solo activas</option>
        <option value="false"> ✗ Solo inactivas</option>
      </select>

      <div class="results-count">
        <span>{{ disciplinasFiltradas.length }} resultado(s)</span>
      </div>
    </div>

    <!-- Tabla de disciplinas -->
    <div class="card">
      <div class="table-container">
        <table v-if="disciplinasFiltradas.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="disciplina in disciplinasFiltradas" :key="disciplina.id">
              <td class="id-column">#{{ disciplina.id }}</td>
              <td>
                <strong class="disciplina-nombre">{{ disciplina.nombre }}</strong>
              </td>
              <td class="descripcion-column">
                {{ disciplina.descripcion || 'Sin descripción' }}
              </td>
              <td>
                <span :class="['badge', disciplina.activa ? 'badge-activa' : 'badge-inactiva']">
                  {{ disciplina.activa ? '✓ Activa' : ' Inactiva' }}
                </span>
              </td>
              <td class="actions-column">
                <div class="action-buttons">
                  <button
                    @click="editar(disciplina)"
                    class="btn-action btn-edit"
                    title="Editar disciplina"
                  >
                  <i class="pi pi-pen-to-square" style="color: gray; font-size: 1.1rem;"></i>
                  </button>
                  <button
                    @click="toggleEstado(disciplina)"
                    :class="['btn-action', disciplina.activa ? 'btn-deactivate' : 'btn-activate']"
                    :title="disciplina.activa ? 'Desactivar' : 'Activar'"
                  >
                    {{ disciplina.activa ? 'Desactivar' : 'Activar' }}
                  </button>
                  <button
                    @click="confirmarEliminar(disciplina)"
                    class="btn-action btn-delete"
                    title="Eliminar disciplina"
                  >
                  <i class="pi pi-trash" style="color: red; font-size: 1.1rem;"></i>

                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Estado vacío -->
        <div v-else class="empty-state">
          <span class="empty-icon">
            <i class="pi pi-folder-open" style="color: gray; font-size: 4rem;"></i>
          </span>
          <h3>No se encontraron disciplinas</h3>
          <p>{{ busqueda ? 'Intenta con otros términos de búsqueda' : 'Comienza creando una nueva disciplina' }}</p>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar -->
    <Transition name="modal">
      <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3> <i class="pi pi-objects-column" style="color: orange; font-size: 1rem;"></i> {{ modoEdicion ? 'Editar' : 'Nueva' }}
              Disciplina</h3>
            <button @click="cerrarModal" class="btn-close">✕</button>
          </div>

          <form @submit.prevent="guardar" class="modal-body">
            <div class="form-group">
              <label class="form-label">
                Nombre <span class="required">*</span>
              </label>
              <input
                v-model="form.nombre"
                type="text"
                class="form-input"
                placeholder="Ej: Fútbol, Natación, Tenis..."
                required
                maxlength="100"
              />
              <span v-if="errorNombre" class="error-message">{{ errorNombre }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Descripción</label>
              <textarea
                v-model="form.descripcion"
                rows="4"
                class="form-textarea"
                placeholder="Describe la disciplina deportiva..."
                maxlength="500"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input v-model="form.activa" type="checkbox" class="form-checkbox" />
                <span>Disciplina activa (visible para usuarios)</span>
              </label>
            </div>

            <div class="modal-footer">
              <button type="button" @click="cerrarModal" class="btn-secondary">
                Cancelar
              </button>
              <button type="submit" class="btn-primary" :disabled="guardando">
                <i :class="modoEdicion ? 'pi pi-save' : 'pi pi-plus'"
                  style="color: whitesmoke;">
                </i>
                <!--{{ modoEdicion ? 'Guardar' : 'Agregar' }}-->
                {{ guardando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Modal de confirmación para eliminar -->
    <Transition name="modal">
      <div v-if="mostrarConfirmacion" class="modal-overlay" @click.self="mostrarConfirmacion = false">
        <div class="modal-content modal-confirm">
          <div class="confirm-icon">
            <i class="pi pi-exclamation-triangle" style="color: goldenrod; font-size: 2rem;"></i>
          </div>
          <h3>¿Eliminar disciplina?</h3>
          <p>Esta acción no se puede deshacer. La disciplina "{{ disciplinaAEliminar?.nombre }}" será eliminada permanentemente.</p>

          <div class="modal-footer">
            <button @click="mostrarConfirmacion = false" class="btn-secondary">
              Cancelar
            </button>
            <button @click="eliminar" class="btn-danger">
              <i class="pi pi-trash" style="color: white;"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">

import { ref, computed, onMounted } from 'vue';

interface Disciplina {
  id?: number;
  nombre: string;
  descripcion: string;
  activa: boolean;
}

const disciplinas = ref<Disciplina[]>([]);
const busqueda = ref('');
const filtroEstado = ref('');
const mostrarModal = ref(false);
const mostrarConfirmacion = ref(false);
const modoEdicion = ref(false);
const guardando = ref(false);
const disciplinaAEliminar = ref<Disciplina | null>(null);
const errorNombre = ref('');

const form = ref<Disciplina>({
  nombre: '',
  descripcion: '',
  activa: true
});

const disciplinasFiltradas = computed(() => {
  return disciplinas.value.filter(d => {
    const matchBusqueda = d.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
                          (d.descripcion?.toLowerCase().includes(busqueda.value.toLowerCase()));

    let matchEstado = true;
    if (filtroEstado.value !== '') {
      matchEstado = d.activa === (filtroEstado.value === 'true');
    }

    return matchBusqueda && matchEstado;
  });
});

onMounted(() => {
  cargarDisciplinas();
});

const cargarDisciplinas = async () => {
  try {
    const response = await fetch('/api/disciplinas');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: any[] = await response.json();

    disciplinas.value = data.map(d => ({
      // Mantenemos todas las propiedades originales, incluyendo 'estado' si existe
      ...d,
      // Creamos la propiedad booleana 'activa'
      activa: d.estado === 'ACTIVO'
    }));

    console.log('Disciplinas cargadas:', disciplinas.value.length);
  } catch (error) {
    console.error('Error cargando disciplinas:', error);
    alert('Error al cargar las disciplinas. Verifica que el backend esté corriendo.');
  }
};

const nuevaDisciplina = () => {
  modoEdicion.value = false;
  form.value = { nombre: '', descripcion: '', activa: true };
  errorNombre.value = '';
  mostrarModal.value = true;
};

const editar = (disciplina: Disciplina) => {
  modoEdicion.value = true;
  form.value = { ...disciplina };
  errorNombre.value = '';
  mostrarModal.value = true;
};

const guardar = async () => {
  errorNombre.value = '';
  guardando.value = true;

  try {
    // Validar duplicados en el frontend
    const duplicado = disciplinas.value.find(
      d => d.nombre.toLowerCase() === form.value.nombre.toLowerCase()
        && d.id !== form.value.id
    );

    if (duplicado) {
      errorNombre.value = 'Ya existe una disciplina con ese nombre';
      guardando.value = false;
      return;
    }

    const url = modoEdicion.value
      ? `/api/disciplinas/${form.value.id}`
      : '/api/disciplinas';
    const method = modoEdicion.value ? 'PUT' : 'POST';

    //MAPEAR: Convertir booleano 'activa' a string 'estado'
    const payload: any = {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
      estado: form.value.activa ? 'ACTIVO' : 'INACTIVO' // ← CAMBIO AQUÍ
    };

    // Si es edición, incluir el ID
    if (modoEdicion.value && form.value.id) {
      payload.id = form.value.id;
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload) //envia payload mapeado
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al guardar');
    }

    const disciplinaGuardada = await response.json();

    // Mapeamos el objeto devuelto antes de insertarlo en la lista
        const disciplinaMapeada: Disciplina = {
            ...disciplinaGuardada,
            activa: disciplinaGuardada.estado === 'ACTIVO'
        };

    if (modoEdicion.value) {
      const index = disciplinas.value.findIndex(d => d.id === disciplinaMapeada.id);
      if (index !== -1) {
        disciplinas.value[index] = disciplinaMapeada;
      }
    } else {
      disciplinas.value.push(disciplinaMapeada);
    }

    cerrarModal();
    console.log('Disciplina guardada:', disciplinaMapeada);
  } catch (error: any) {
    console.error('Error guardando:', error);
    if (error.message.includes('duplicado') || error.message.includes('duplicate')) {
      errorNombre.value = 'Ya existe una disciplina con ese nombre';
    } else {
      alert('Error al guardar la disciplina: ' + error.message);
    }
  } finally {
    guardando.value = false;
  }
};

const toggleEstado = async (disciplina: Disciplina) => {
  const nuevoEstado = !disciplina.activa;
  const accion = nuevoEstado ? 'activar' : 'desactivar';

  if (!confirm(`¿Estás seguro de ${accion} la disciplina "${disciplina.nombre}"?`)) {
    return;
  }

  try {
    const nuevoEstadoString = nuevoEstado ? 'ACTIVO' : 'INACTIVO';
    const response = await fetch(`/api/disciplinas/${disciplina.id}/estado`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estado: nuevoEstadoString })
    });

    if (!response.ok) {
      throw new Error('Error al cambiar estado');
    }

    const actualizada = await response.json();
    // Mapeamos el objeto devuelto antes de actualizar la lista
        const actualizadaMapeada: Disciplina = {
            ...actualizada,
            activa: actualizada.estado === 'ACTIVO'
        };

    const index = disciplinas.value.findIndex(d => d.id === disciplina.id);
    if (index !== -1) {
      disciplinas.value[index] = actualizadaMapeada;
    }

    console.log('Estado cambiado:', actualizadaMapeada);
  } catch (error) {
    console.error('Error cambiando estado:', error);
    alert('Error al cambiar el estado de la disciplina');
  }
};

const confirmarEliminar = (disciplina: Disciplina) => {
  disciplinaAEliminar.value = disciplina;
  mostrarConfirmacion.value = true;
};

const eliminar = async () => {
  if (!disciplinaAEliminar.value?.id) return;

  try {
    const response = await fetch(`/api/disciplinas/${disciplinaAEliminar.value.id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar');
    }

    disciplinas.value = disciplinas.value.filter(d => d.id !== disciplinaAEliminar.value?.id);
    console.log('Disciplina eliminada:', disciplinaAEliminar.value);

    mostrarConfirmacion.value = false;
    disciplinaAEliminar.value = null;
  } catch (error: any) {
    console.error('Error eliminando:', error);
    alert('Error al eliminar la disciplina: ' + error.message);
  }
};

const cerrarModal = () => {
  mostrarModal.value = false;
  errorNombre.value = '';
  form.value = { nombre: '', descripcion: '', activa: true };
};
</script>

<style scoped>
.gestion-disciplinas {
  max-width: 1400px;
  margin: 0 auto;
}

/* Page Header */
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

/* Buttons */
.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 0.875rem 1.5rem;
  background: white;
  color: #475569;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.btn-danger {
  padding: 0.875rem 1.5rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger:hover {
  background: #b91c1c;
}

.btn-icon {
  font-size: 1.125rem;
}

/* Filters Bar */
.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.search-box {
  flex: 1;
  max-width: 500px;
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

.select-filter {
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  background: white;
  cursor: pointer;
  color: rgba(0, 0, 0);
  border-color: lightgray;
  transition: all 0.2s;
}

.select-filter:hover {
  border-color: #4e84c5;
}

.results-count {
  margin-left: auto;
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border-radius: 0.375rem;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Card & Table */
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

.disciplina-nombre {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  background: #f1f5f9;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
}

.descripcion-column {
  color: #64748b;
  max-width: 400px;
}

.actions-column {
  width: 160px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  padding: 0.5rem;
  background: transparent;
  border: none;

  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0.375rem;
  color: goldenrod;
  font-weight: bold;
}

.btn-action:hover {
  background: #f1f5f9;
  transform: scale(1.15);
}

.btn-edit:hover {
  background: #dbeafe;
}

.btn-activate:hover {
  background: #dcfce7;
  color: green;
}

.btn-deactivate:hover {
  background: #dad9d9;
  color: gray;
  size: 0.5rem;


}

.btn-delete:hover {
  background: #fee2e2;
}

/* Badge */
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

.badge-inactiva {
  background: #e6e5e5;
  color: gray;
  font-style: italic;
}

/* Empty State */
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

/* Modal */
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

.modal-confirm {
  max-width: 500px;
  text-align: center;
  padding: 2rem;
}

.confirm-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.modal-confirm h3 {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  color: #1e293b;
}

.modal-confirm p {
  margin: 0 0 2rem;
  color: #64748b;
  line-height: 1.6;
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

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #475569;
  font-weight: 600;
  font-size: 0.875rem;
}

.required {
  color: #dc2626;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.9375rem;
  transition: all 0.2s;
  color: rgba(0, 0, 0, 0.4);

}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  color: rgba(0, 0, 0, 0.8);

}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #475569;
}

.form-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;

}

.error-message {
  display: block;
  margin-top: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .filters-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: 100%;
  }

  .results-count {
    margin-left: 0;
  }
}
</style>
