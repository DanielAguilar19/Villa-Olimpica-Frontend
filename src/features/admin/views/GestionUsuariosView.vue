<template>
  <div class="gestion-disciplinas"> <!-- reutiliza estilos existentes -->
    <div class="page-header">
      <div>
        <h2>Gestión de Usuarios</h2>
        <p class="subtitle">Lista y administración de usuarios del sistema</p>
      </div>
      <button @click="nuevoUsuario" class="btn-primary">
        <span class="btn-icon"><i class="pi pi-user-plus" style="color: whitesmoke;"></i></span>
        Nuevo Usuario
      </button>
    </div>

    <div class="filters-bar">
      <div class="search-box">
        <span class="search-icon"><i class="pi pi-search" style="color: #9CA3AF; font-size: 1.4rem;"></i></span>
        <input v-model="busqueda" type="text" placeholder="Buscar por nombre o correo..." class="search-input" />
      </div>

      <select v-model="filtroEstado" class="select-filter">
        <option value=""> Todos los estados</option>
        <option value="ACTIVO"> ✓ Activo</option>
        <option value="INACTIVO"> ✗ Inactivo</option>
      </select>

      <div class="results-count">
        <span>{{ usuariosFiltrados.length }} resultado(s)</span>
      </div>
    </div>

    <div class="card">
      <div class="table-container">
        <table v-if="usuariosFiltrados.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuariosFiltrados" :key="u.id">
              <td class="id-column">#{{ u.id }}</td>
              <td><strong class="disciplina-nombre">{{ u.nombre }}</strong></td>
              <td>{{ u.correo }}</td>
              <td>{{ u.tipoUsuario }}</td>
              <td>
                <span :class="['badge', u.estado === 'ACTIVO' ? 'badge-activa' : 'badge-inactiva']">
                  {{ u.estado }}
                </span>
              </td>
              <td class="actions-column">
                <div class="action-buttons">
                  <button @click="abrirEditar(u)" class="btn-action btn-edit" title="Editar usuario">
                    <i class="pi pi-pen-to-square" style="color: gray; font-size: 1.1rem;"></i>
                  </button>

                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="empty-state">
          <span class="empty-icon"><i class="pi pi-users" style="color: gray; font-size: 4rem;"></i></span>
          <h3>No se encontraron usuarios</h3>
          <p>{{ busqueda ? 'Prueba con otros términos' : 'Aún no hay usuarios registrados' }}</p>
        </div>
      </div>
    </div>

    <!-- Confirm delete modal -->
    <transition name="modal">
      <div v-if="mostrarConfirmacion" class="modal-overlay" @click.self="mostrarConfirmacion = false">
        <div class="modal-content modal-confirm">
          <div class="confirm-icon"><i class="pi pi-exclamation-triangle"
              style="color: goldenrod; font-size: 2rem;"></i></div>
          <h3>¿Eliminar usuario?</h3>
          <p>Se eliminará a "{{ usuarioAEliminar?.nombre }}". Esta acción no se puede deshacer.</p>
          <div class="modal-footer">
            <button @click="mostrarConfirmacion = false" class="btn-secondary">Cancelar</button>
            <button @click="eliminar" class="btn-danger"><i class="pi pi-trash" style="color:white"></i>
              Eliminar</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal editar/crear usuario -->
    <transition name="modal">
      <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-content" style="max-width:700px;">
          <div class="modal-header">
            <h3>{{ modoEdicion ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
            <button @click="cerrarModal" class="btn-close">✕</button>
          </div>

          <form @submit.prevent="guardarUsuario" class="modal-body">
            <div class="form-group">
              <label class="form-label">Nombre <span class="required">*</span></label>
              <input v-model="form.nombre" type="text" class="form-input" maxlength="150" />
              <span v-if="errors.nombre" class="error-message">{{ errors.nombre }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Correo <span class="required">*</span></label>
              <input v-model="form.correo" type="email" class="form-input" maxlength="255" />
              <span v-if="errors.correo" class="error-message">{{ errors.correo }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Tipo de usuario <span class="required">*</span></label>
              <select v-model.number="form.tipoUsuarioId" class="form-input">
                <option :value="null" disabled>Seleccione un tipo</option>
                <option v-for="t in tipos" :key="t.id" :value="t.id">{{ t.nombre }}</option>
              </select>
              <span v-if="errors.tipoUsuarioId" class="error-message">{{ errors.tipoUsuarioId }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Teléfono</label>
              <input v-model="form.telefono" type="text" class="form-input" maxlength="30" />
            </div>

            <div class="form-group">
              <label class="form-label">Estado</label>
              <select v-model="form.estado" class="form-input">
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Cambiar contraseña (opcional)</label>
              <input v-model="form.password" type="password" class="form-input" minlength="8" />
              <small style="color:#64748b">Dejar vacío para no cambiar la contraseña</small>
            </div>

            <div class="modal-footer">
              <button type="button" @click="cerrarModal" class="btn-secondary">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="guardando">
                {{ guardando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getAllUsuarios, eliminarUsuario, registrarUsuario, actualizarUsuario } from '@/api/usuarios/usuariosApi';
import type { UsuarioView } from '@/interfaces/usuarios/usuario';
import { LanzarAlerta } from '@/utils/alertas';
import axios from 'axios';
import router from '@/router';

// --- estado principal ---
const usuarios = ref<UsuarioView[]>([]);
const busqueda = ref('');
const filtroEstado = ref('');
const mostrarConfirmacion = ref(false);
const usuarioAEliminar = ref<UsuarioView | null>(null);

// modal / form
const mostrarModal = ref(false);
const modoEdicion = ref(false);
const guardando = ref(false);

type TipoUsuarioOption = { id: number; nombre: string };
const tipos = ref<TipoUsuarioOption[]>([]);

// form shape (coincide con DTO UsuarioUpdateIn: tipoUsuarioId, nombre, correo, password, telefono, estado)
const form = ref<{
  id?: number | null;
  tipoUsuarioId: number | null;
  nombre: string;
  correo: string;
  password?: string | null;
  telefono?: string | null;
  estado: string;
}>({
  id: null,
  tipoUsuarioId: null,
  nombre: '',
  correo: '',
  password: null,
  telefono: '',
  estado: 'ACTIVO'
});

const errors = ref<{ [k: string]: string | null }>({});

// --- carga inicial ---
const cargar = async () => {
  try {
    usuarios.value = await getAllUsuarios();
  } catch (e) {
    console.error(e);
  }
};

// cargar tipos de usuario (intenta endpoint REST, si no hay fallback)
const cargarTipos = async () => {
  try {
    const resp = await axios.get<TipoUsuarioOption[]>(`${import.meta.env.VITE_API}/api/tipos-usuarios`);
    tipos.value = resp.data;
  } catch (e) {
    console.warn('No se pudo cargar tipos de usuario desde API, usando fallback', e);
    tipos.value = [
      { id: 1, nombre: 'EXTERNO' },
      { id: 2, nombre: 'INSTRUCTOR' },
      { id: 3, nombre: 'ADMIN' }
    ];
  }
};

onMounted(async () => {
  await Promise.all([cargar(), cargarTipos()]);
});

// --- filtros ---
const usuariosFiltrados = computed(() => {
  return usuarios.value.filter(u => {
    const q = busqueda.value.trim().toLowerCase();
    const matchQ = !q || u.nombre.toLowerCase().includes(q) || u.correo.toLowerCase().includes(q);
    const matchEstado = !filtroEstado.value || u.estado === filtroEstado.value;
    return matchQ && matchEstado;
  });
});

// --- acciones UI ---
const nuevoUsuario = () => { router.push({ name: 'CrearUsuarios' }) };

const abrirEditar = (u: UsuarioView) => {
  modoEdicion.value = true;
  form.value.id = u.id;
  // si backend expone tipoUsuario como nombre, buscamos id por nombre en tipos
  const tipo = tipos.value.find(t => t.nombre === u.tipoUsuario);
  form.value.tipoUsuarioId = tipo ? tipo.id : null;
  form.value.nombre = u.nombre;
  form.value.correo = u.correo;
  form.value.telefono = u.telefono || '';
  form.value.estado = u.estado || 'ACTIVO';
  form.value.password = null;
  errors.value = {};
  mostrarModal.value = true;
};


const eliminar = async () => {
  if (!usuarioAEliminar.value) return;
  try {
    await eliminarUsuario(usuarioAEliminar.value.id);
    usuarios.value = usuarios.value.filter(x => x.id !== usuarioAEliminar.value?.id);
    mostrarConfirmacion.value = false;
    usuarioAEliminar.value = null;
  } catch (e) {
    console.error(e);
  }
};

// --- validaciones ---
const validarEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validarForm = () => {
  errors.value = {};
  if (!form.value.nombre || !form.value.nombre.trim()) {
    errors.value.nombre = 'Nombre es requerido';
  }
  if (!form.value.correo || !validarEmail(form.value.correo)) {
    errors.value.correo = 'Correo inválido';
  }
  if (!form.value.tipoUsuarioId) {
    errors.value.tipoUsuarioId = 'Seleccione un tipo de usuario';
  }
  // password opcional: si viene, debe tener >=8 chars
  if (form.value.password && form.value.password.length > 0 && form.value.password.length < 8) {
    errors.value.password = 'La contraseña debe tener al menos 8 caracteres';
  }

  return Object.keys(errors.value).length === 0;
};

// --- enviar al backend ---
const guardarUsuario = async () => {
  if (!validarForm()) {
    LanzarAlerta('Corrige los errores del formulario', 'warning');
    return;
  }

  guardando.value = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = {
    nombre: form.value.nombre.trim(),
    correo: form.value.correo.toLowerCase().trim(),
    telefono: form.value.telefono || null,
    estado: form.value.estado,
    tipoUsuarioId: form.value.tipoUsuarioId
  };
  // solo incluir password si se suministro
  if (form.value.password && form.value.password.length > 0) {
    payload.password = form.value.password;
  }

  try {
    let actualizado: { id: number; nombre: string; correo: string; tipoUsuario: string; estado: string; telefono?: string | undefined; creadoEn?: string | undefined; };
    if (modoEdicion.value && form.value.id) {
      actualizado = await actualizarUsuario(form.value.id, payload);
      // actualizar en la lista local
      const idx = usuarios.value.findIndex(u => u.id === actualizado.id);
      if (idx !== -1) usuarios.value[idx] = actualizado;
      LanzarAlerta('Usuario actualizado', 'success');
    } else {
      const creado = await registrarUsuario(payload);
      usuarios.value.push(creado);
      LanzarAlerta('Usuario creado', 'success');
    }
    cerrarModal();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    // backend puede responder con message; intentamos mostrarlo
    const message = err?.response?.data?.message || err?.message || 'Error al guardar usuario';
    LanzarAlerta(message, 'error');
  } finally {
    guardando.value = false;
  }
};

const cerrarModal = () => {
  mostrarModal.value = false;
  resetForm();
};

const resetForm = () => {
  form.value = {
    id: null,
    tipoUsuarioId: null,
    nombre: '',
    correo: '',
    password: null,
    telefono: '',
    estado: 'ACTIVO'
  };
  errors.value = {};
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
