<template>
  <section class="min-h-screen flex items-center justify-end p-4 bg-surface-50 dark:bg-surface-900 perspective-1000">
    <Card class="w-100 max-w-md shadow-lg glass-card ml-auto min-h-[25vh]">
      <template #title>
        <div class="flex items-center justify-center gap-2">
          <i class="pi pi-user text-xl" />
          <span class="text-xl font-semibold">Crea tu cuenta</span>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="onSubmit" class="flex flex-col gap-9 mt-4">
          <!-- nombre -->
          <div class="flex flex-col gap-2">
            <FloatLabel class="w-full">
              <InputText class="w-full" id="correo" v-model.trim="form.nombre" required />
              <label for="correo">Ingrese su primer nombre y primer apellido</label>
            </FloatLabel>
          </div>
          <!-- Correo -->
          <div class="flex flex-col gap-2">
            <FloatLabel class="w-full">
              <InputText id="password" v-model="form.correo" :feedback="false" type="email" input-class="w-full"
                required />
              <label for="password">Ingrese su correo</label>
            </FloatLabel>
          </div>

          <!-- Contraseña -->
          <div class="flex flex-col gap-2">
            <FloatLabel class="w-full">
              <InputText id="password" v-model="form.password" :feedback="false" input-class="w-full" required />
              <label for="password">Ingrese su contraseña</label>
            </FloatLabel>
          </div>
          <!-- Telefono -->
          <div class="flex flex-col gap-2">
            <FloatLabel class="w-full">
              <InputText id="password" v-model="form.telefono" :feedback="false" input-class="w-full" required />
              <label for="password">Ingrese su número telefonico</label>
            </FloatLabel>
          </div>

          <!-- Error -->
          <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>

          <!-- Acciones -->
          <div class="flex flex-col gap-2 mt-2">
            <Button type="submit" label="Registrar" icon="pi pi-sign-in" :loading="loading"
              :disabled="loading || !canSubmit" />
          </div>
        </form>
      </template>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import FloatLabel from 'primevue/floatlabel'
import axios from 'axios'
import type { crearUsuario } from '@/interfaces/usuarios/usuario'
import { crearUsuarioFinal } from '@/api/usuarios/usuariosApi'

const router = useRouter()
//POR DEFECTO SIEMPRE EN LA PAGINA DE REGISTRO SE VAN A CREAR USUARIOS TIPO 1 QUE SON LOS EXTERNOS ES DECIR USUARIO FINAL
const form: crearUsuario = reactive({ tipoUsuarioId: 1, nombre: '', correo: '', password: '', telefono: '' })
const loading = ref(false)
const errorMsg = ref('')

const canSubmit = computed(() => form.correo.trim().length > 0 && form.password.length > 0)

async function onSubmit() {
  if (!canSubmit.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    const response = await crearUsuarioFinal({
      tipoUsuarioId: 1,
      nombre: form.nombre,
      correo: form.correo.trim(),
      password: form.password,
      telefono: form.telefono
    })

    if (response) {
      await router.push({ name: 'login' })
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      errorMsg.value = (err.response?.data)?.message
        ?? (err.response?.status === 500 ? 'Valide que los campos se hayan llenado.' : 'Error creando su cuenta.')
    } else {
      errorMsg.value = 'Error inesperado.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
#correo,
#password {
  width: 100%;
}

:deep(.p-card .p-card-content) {
  padding-top: 0.75rem;
}

:deep(.p-float-label) {
  width: 100%;
}

:deep(.p-card) {
  border-radius: 12px;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(17, 25, 40, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);
  padding: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform-style: preserve-3d;
  position: relative;
  overflow: hidden;
}

:deep(.p-card:hover) {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

:deep(.p-card)::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02) 30%, rgba(255, 255, 255, 0) 60%);
  transform: rotate(15deg);
  pointer-events: none;
}
</style>
