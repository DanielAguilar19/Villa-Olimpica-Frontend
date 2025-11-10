<template>
  <div class="bg-gray-900 min-h-screen text-white">
    <!-- 🏅 Encabezado con fondo -->
    <header class="relative h-64 sm:h-80 lg:h-96 flex flex-col justify-center items-start px-10">
      <img src="@/assets/stadium.jpg" alt="Fondo deportivo"
        class="absolute inset-0 w-full h-full object-cover opacity-40" />
      <div class="relative z-10">
        <h1 class="text-4xl sm:text-5xl font-bold mb-2">Disciplinas Deportivas</h1>
        <p class="text-gray-300 text-lg">Explora todas las categorías y deportes de la Villa Olímpica</p>
      </div>
      <backButton />
    </header>

    <!-- 🟢 Sección de tarjetas -->
    <main class="px-8 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- 🔁 Tarjeta por disciplina -->
        <div v-for="d in disciplinas" :key="d.id"
          class="bg-gray-800 hover:bg-gray-700 transition rounded-2xl shadow-lg overflow-hidden cursor-pointer"
          @click="abrirDisciplina(d)">
          <!-- 📸 Imagen o ícono fallback -->
          <div class="relative w-full h-48">
            <img v-if="resolverImagen(d.nombre)" :src="resolverImagen(d.nombre)!" :alt="d.nombre"
              class="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105" />
            <img v-else :src="defautlPhoto" :alt="d.nombre"
              class="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105" />
            <h2 class="absolute bottom-3 left-4 text-2xl font-bold text-white drop-shadow-lg">
              {{ d.nombre }}
            </h2>
          </div>

          <!-- 📋 Descripción y detalles -->
          <div class="p-5">
            <p class="text-gray-300 mb-4">{{ d.descripcion }}</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm text-green-400 hover:underline">
                <i class="pi pi-eye"></i>
                <span>Ver detalle</span>
              </div>
              <!-- mantenemos tu badge, pero ya no dependemos de color/categoría del objeto -->
              <span class="px-3 py-1 rounded-full text-xs font-semibold text-white bg-emerald-600">
                {{ (d.estado ?? 'ACTIVO') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import backButton from '@/components/UI/backButton.vue'
import { obtenerDisciplinas } from '@/api/disciplinas/disciplinasApi'
import type { Disciplina } from '@/interfaces/disciplinas/disciplinas'
import defautlPhoto from '@/assets/villaOlimpica.jpg'


const imgModules = import.meta.glob('@/assets/*.{jpg,jpeg,png,webp,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const normalizar = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '')

const imagenesPorNombre = (() => {
  const m = new Map<string, string>()
  Object.entries(imgModules).forEach(([ruta, url]) => {
    const base = ruta.split('/').pop() || ''
    const sinExt = base.replace(/\.[^.]+$/, '')
    m.set(normalizar(sinExt), url)
  })
  return m
})()

function resolverImagen(nombre?: string): string | null {
  if (!nombre) return null
  const key = normalizar(nombre)
  return imagenesPorNombre.get(key) ?? null
}

const router = useRouter()
const disciplinas = ref<Disciplina[] | undefined>([])

onMounted(async () => {
  try {
    const resp = await obtenerDisciplinas()
    console.log('Disciplinas API:', resp)
    disciplinas.value = resp
  } catch (e) {
    console.error('Error obteniendo disciplinas', e)
    disciplinas.value = []
  }
})

function abrirDisciplina(d: Disciplina) {
  router.push({ name: 'disciplinaDetalle', params: { id: d.id } })
}
</script>

<style scoped>
/* mantengo tus estilos tal cual */
.bg-gray-900 {
  background-color: #0f172a;
  min-height: 100vh;
}

* {
  transition: all 0.3s ease;
}
</style>
