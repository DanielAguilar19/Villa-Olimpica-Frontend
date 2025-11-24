<template>
  <section
    class=" aurora-bg min-h-screen flex items-center justify-end p-4 bg-surface-50 dark:bg-surface-900 perspective-1000">
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
              <Password id="password" toggle-mask v-model="form.password" :feedback="false" input-class="w-full"
                required />
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
            <Button severity="secondary" variant="text" raised @click="regresarLogin" label="Regresar"
              icon="pi pi-chevron-left" />
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
import Password from 'primevue/password'
import FloatLabel from 'primevue/floatlabel'
import type { crearUsuario } from '@/interfaces/usuarios/usuario'
import { crearUsuarioFinal } from '@/api/usuarios/usuariosApi'
import { LanzarAlerta } from '@/utils/alertas'

const router = useRouter()
//POR DEFECTO SIEMPRE EN LA PAGINA DE REGISTRO SE VAN A CREAR USUARIOS TIPO 1 QUE SON LOS EXTERNOS ES DECIR USUARIO FINAL
const form: crearUsuario = reactive({ tipoUsuarioId: 1, nombre: '', correo: '', password: '', telefono: '' })
const loading = ref(false)
const errorMsg = ref('')

const canSubmit = computed(() => form.correo.trim().length > 0 && form.password.length > 0);

function regresarLogin() {
  router.push({ name: 'login' })
}

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
  } catch (error) {
    LanzarAlerta('Error al registrar el usuario. Valide los campos.', 'error')
    console.error('Error al registrar usuario:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.aurora-bg {
  position: relative;
  min-height: 100vh;
  overflow: hidden;

  /* Fondo base: dos radiales + color sólido de respaldo */
  background:
    radial-gradient(900px 600px at 80% -10%, #0b1220 0%, #090f1a 55%, #070d16 100%),
    radial-gradient(800px 540px at 15% 110%, #0a1322 0%, #080f1b 60%, #070d16 100%),
    #070d16;
  /* respaldo */
  background-attachment: fixed;
  /* más “profundo” al hacer scroll */
}

/* Capas aurora (estáticas) */
.aurora-bg::before,
.aurora-bg::after {
  content: "";
  position: absolute;
  inset: -25% -15%;
  pointer-events: none;
  filter: blur(72px);
  opacity: 0.85;
  mix-blend-mode: screen;
  /* ilumina sobre el azul oscuro */
  z-index: 0;
}

/* Morados (lado superior/medio) */
.aurora-bg::before {
  background:
    radial-gradient(40% 60% at 22% 28%, rgba(110, 34, 160, 0.45) 0%, rgba(110, 34, 160, 0.08) 60%, transparent 70%),
    radial-gradient(36% 56% at 72% 18%, rgba(56, 20, 110, 0.50) 0%, rgba(56, 20, 110, 0.08) 60%, transparent 75%),
    radial-gradient(44% 64% at 85% 62%, rgba(140, 60, 210, 0.35) 0%, rgba(140, 60, 210, 0.08) 60%, transparent 75%);
}

/* Verdes menta (lado inferior/diagonal) */
.aurora-bg::after {
  background:
    radial-gradient(45% 65% at 30% 72%, rgba(0, 255, 190, 0.35) 0%, rgba(0, 255, 190, 0.07) 60%, transparent 75%),
    radial-gradient(35% 55% at 60% 82%, rgba(0, 200, 160, 0.30) 0%, rgba(0, 200, 160, 0.07) 60%, transparent 75%),
    radial-gradient(26% 40% at 82% 42%, rgba(140, 255, 230, 0.20) 0%, rgba(140, 255, 230, 0.05) 55%, transparent 70%);
}

/* Asegura que el contenido vaya encima de las “luces” */
.aurora-bg>* {
  position: relative;
  z-index: 1;
}

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
