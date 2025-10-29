<template>
  <section class="min-h-screen flex items-center justify-end p-4 bg-surface-50 dark:bg-surface-900 perspective-1000">
    <!-- Card empujado a la derecha -->
    <Card class="w-full max-w-md shadow-lg glass-card ml-auto min-h-[25vh]">
      <template #title>
        <div class="flex items-center justify-center gap-2">
          <i class="pi pi-user text-xl" />
          <span class="text-xl font-semibold">Iniciar sesión</span>
        </div>
      </template>

      <template #content>
        <!-- margen superior para separar del título -->
        <form @submit.prevent="onSubmit" class="flex flex-col gap-4 mt-4">
          <!-- Correo -->
          <div class="flex flex-col gap-2">
            <FloatLabel class="w-full">
              <InputText class="w-full" id="email" v-model.trim="form.email" type="email" autocomplete="email"
                required />
              <label for="email">Ingrese su correo</label>
            </FloatLabel>
          </div>

          <!-- Contraseña -->
          <div class="flex flex-col gap-2">
            <FloatLabel class="w-full">
              <Password id="password" v-model="form.password" :feedback="false" toggle-mask input-class="w-full"
                :input-props="{ autocomplete: 'current-password' }" required />
              <label for="password">Ingrese su contraseña</label>
            </FloatLabel>
          </div>

          <!-- Acciones -->
          <div class="flex flex-col gap-2 mt-2">
            <Button type="submit" label="Ingresar" icon="pi pi-sign-in" />
            <Divider align="center">o</Divider>
            <RouterLink to="/auth/registro" class="no-underline">
              <Button label="Crear cuenta" icon="pi pi-user-plus" severity="secondary" outlined class="w-full" />
            </RouterLink>
          </div>
        </form>
      </template>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'

// PrimeVue
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import FloatLabel from 'primevue/floatlabel'

const form = reactive({ email: '', password: '' })
const emit = defineEmits<{ (e: 'submit', payload: { email: string; password: string }): void }>()
function onSubmit() { emit('submit', { ...form }) }
</script>

<style scoped>
#email,
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
