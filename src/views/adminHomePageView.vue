<template>
  <div class="layout-grid p-6">
    <div class="contenedor-area-trabajo">
      <div class="area mb-4">
        <h1 class="titulo-area">Creación de Usuario</h1>
        <p class="subtitle-area">Formulario para que un administrador cree un nuevo usuario en el sistema.</p>
      </div>

      <form @submit.prevent="submit" class="form-grid" style="width: 100%;">
        <!-- Tipo -->
        <div class="fila">
          <div class="caja-izquierda">Tipo de usuario <span class="required">*</span></div>
          <div class="caja-derecha">
            <Dropdown v-model="form.tipoUsuarioId" :options="tipos" optionLabel="nombre" optionValue="id"
              placeholder="Selecciona tipo" :showClear="true" :disabled="loadingTipos" class="w-full" />
            <small v-if="errors.tipoUsuarioId" class="error-msg">{{ errors.tipoUsuarioId }}</small>
          </div>
        </div>

        <!-- Nombre -->
        <div class="fila">
          <div class="caja-izquierda">Nombre <span class="required">*</span></div>
          <div class="caja-derecha">
            <InputText v-model="form.nombre" placeholder="Nombre completo" class="w-full" />
            <small v-if="errors.nombre" class="error-msg">{{ errors.nombre }}</small>
          </div>
        </div>

        <!-- Correo -->
        <div class="fila">
          <div class="caja-izquierda">Correo <span class="required">*</span></div>
          <div class="caja-derecha">
            <InputText v-model="form.correo" placeholder="correo@ejemplo.com" class="w-full" />
            <small v-if="errors.correo" class="error-msg">{{ errors.correo }}</small>
          </div>
        </div>

        <!-- Teléfono -->
        <div class="fila">
          <div class="caja-izquierda">Teléfono</div>
          <div class="caja-derecha">
            <InputText v-model="form.telefono" placeholder="Ingrese los 8 digitos de su telefono" class="w-full" />
            <small v-if="errors.telefono" class="error-msg">{{ errors.telefono }}</small>
          </div>
        </div>

        <!-- Contraseña -->
        <div class="fila">
          <div class="caja-izquierda">Contraseña <span class="required">*</span></div>
          <div class="caja-derecha">
            <Password v-model="form.password" feedback :toggleMask="true" class="w-full" />
            <small v-if="errors.password" class="error-msg">{{ errors.password }}</small>
          </div>
        </div>

        <!-- Botones -->
        <div class="fila acciones">
          <div class="caja-izquierda"></div>
          <div class="caja-derecha">
            <div class="botones">
              <Button type="button" label="Limpiar" icon="pi pi-refresh" class="btn-ghost" @click="resetForm"
                :disabled="saving" />
              <Button type="submit" label="Crear usuario" icon="pi pi-user-plus" class="btn-primary"
                :loading="saving" />
            </div>
          </div>
        </div>
      </form>

      <!-- Lista simple de tipos (informativa) -->
      <div class="lista-tipos mt-6">
        <h3 class="lista-titulo">Tipos de usuario</h3>
        <div v-if="loadingTipos" class="muted">Cargando tipos...</div>
        <ul v-else class="mt-2">
          <li v-for="t in tipos" :key="t.id" class="tipo-item">
            <strong>{{ t.nombre }}</strong>
            <span class="desc">{{ t.descripcion }}</span>
          </li>
        </ul>
      </div>

      <Toast />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

import type { TipoUsuario } from '@/interfaces/tiposUsuario/tipoUsuario'
import type { crearUsuario } from '@/interfaces/usuarios/usuario'
import { getTiposUsuario } from '@/api/tiposUsuario/tipoUsuarioApi'
import { crearUsuarioFinal } from '@/api/usuarios/usuariosApi'

const toast = useToast()

// estado
const tipos = ref<TipoUsuario[]>([])
const loadingTipos = ref(false)
const saving = ref(false)

// form
const form = reactive<crearUsuario>({
  tipoUsuarioId: 0,
  nombre: '',
  correo: '',
  password: '',
  telefono: ''
})

// errores
const errors = reactive<{ [k in keyof crearUsuario]?: string & {} }>({})

onMounted(() => loadTipos())

async function loadTipos() {
  loadingTipos.value = true
  try {
    const res = await getTiposUsuario()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tipos.value = (res || []).filter((t: any) => !(t as any).estado || (t as any).estado.toUpperCase() === 'ACTIVO')
  } catch (err) {
    console.error('error cargando tipos', err)
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tipos de usuario' })
  } finally {
    loadingTipos.value = false
  }
}

// validación
function validateField(field: keyof crearUsuario) {
  switch (field) {
    case 'tipoUsuarioId':
      errors.tipoUsuarioId = (!form.tipoUsuarioId || form.tipoUsuarioId === 0) ? 'Seleccione un tipo de usuario' : ''
      break
    case 'nombre':
      errors.nombre = (!form.nombre || form.nombre.trim().length < 3) ? 'Nombre debe tener al menos 3 caracteres' : ''
      break
    case 'correo':
      errors.correo = (!form.correo || !/^\S+@\S+\.\S+$/.test(form.correo)) ? 'Correo inválido' : ''
      break
    case 'password':
      errors.password = (!form.password || form.password.length < 6) ? 'La contraseña debe tener al menos 6 caracteres' : ''
      break
    case 'telefono':
      errors.telefono = (form.telefono && !/^[0-9+\-\s()]{6,20}$/.test(form.telefono)) ? 'Teléfono inválido' : ''
      break
  }
}

function validateAll(): boolean {
  validateField('tipoUsuarioId')
  validateField('nombre')
  validateField('correo')
  validateField('password')
  validateField('telefono')
  return !Object.values(errors).some(e => !!e)
}

function resetForm() {
  form.tipoUsuarioId = 0
  form.nombre = ''
  form.correo = ''
  form.password = ''
  form.telefono = ''
  for (const k in errors) delete errors[k as keyof typeof errors]
}

async function submit() {
  if (!validateAll()) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Corrija los errores en el formulario' })
    return
  }

  saving.value = true
  try {
    const payload: crearUsuario = {
      tipoUsuarioId: form.tipoUsuarioId,
      nombre: form.nombre.trim(),
      correo: form.correo.trim(),
      password: form.password,
      telefono: form.telefono?.trim() ?? ''
    }

    const resp = await crearUsuarioFinal(payload)
    toast.add({ severity: 'success', summary: 'Creado', detail: 'Usuario creado correctamente' })
    resetForm()
    console.log('Usuario creado:', resp)
  } catch (err: unknown) {
    console.error('error creando usuario', err)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detail = (err as any)?.response?.data?.message ?? 'Error al crear usuario'
    toast.add({ severity: 'error', summary: 'Error', detail })
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
  background: linear-gradient(180deg, rgba(3, 37, 65, 0.6), rgba(3, 37, 65, 0.75));
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

/* lista de tipos */
.lista-tipos {
  margin-top: 18px;
  color: rgba(230, 240, 255, 0.86);
}

.lista-titulo {
  color: #e6f0ff;
  margin: 0 0 6px 0;
}

.tipo-item {
  display: flex;
  gap: 10px;
  align-items: baseline;
  padding: 8px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.02);
}

.tipo-item .desc {
  color: rgba(230, 240, 255, 0.6);
  font-size: 0.95rem;
}

/* required */
.required {
  color: #ffb4b4;
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
</style>
