<template>
  <div class="min-h-screen bg-[#0f172a] text-white p-6">
    <div class="max-w-5xl mx-auto">
      <!-- 🔙 Botón volver -->
      <div class="mb-8">
        <button @click="router.push('/disciplinas')"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-semibold shadow-md transition">
          ← Volver a Disciplinas
        </button>
      </div>

      <!-- Estado de carga -->
      <div v-if="loading" class="py-20 text-center text-gray-300">
        Cargando información...
      </div>

      <!-- Contenido -->
      <div v-else>
        <h1 class="text-4xl font-bold mb-3">{{ disciplina.nombre }}</h1>
        <p class="text-gray-300 mb-8">{{ disciplina.descripcion }}</p>

        <h2 class="text-2xl font-semibold mb-5 text-green-400">
          Canchas disponibles
        </h2>

        <div v-if="!canchas" class="text-gray-400 text-center">
          No hay canchas registradas para esta disciplina.
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-8 place-items-center">
          <article v-for="(c, idx) in canchas" :key="c.id"
            class="bg-gray-800 hover:bg-gray-700 transition rounded-2xl overflow-hidden shadow-lg w-full max-w-sm">
            <img :src="imagenPorDisciplina(c.disciplinaNombre, idx)" :alt="c.nombre"
              class="w-full h-48 object-cover object-center" />
            <div class="p-5">
              <h3 class="text-xl font-semibold mb-1">{{ c.nombre }}</h3>
              <p class="text-sm text-gray-300 mb-2">{{ c.ubicacion }}</p>
              <p class="text-sm text-gray-400 mb-3">{{ c.disciplinaNombre }}</p>

              <div class="flex items-center justify-between mt-3">
                <span :class="c.estado === 'ACTIVO' ? 'text-green-400' : 'text-yellow-400'"
                  class="text-sm font-semibold">
                  {{ c.estado === 'ACTIVO' ? 'Disponible' : 'Ocupada' }}
                </span>
                <button
                  class="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-full text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                  @click="reservar(c)" :disabled="c.estado !== 'ACTIVO'">
                  Reservar
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Instalacion } from '@/interfaces/instalaciones/instalaciones'
import { obtenerInstalacionesPorDisciplina } from '@/api/instalaciones/instalacionesApi'

interface DisciplinaHeader {
  id: number
  nombre: string
  descripcion: string
}

const route = useRoute()
const router = useRouter()
const id = ref<number>(Number(route.params.id))

const loading = ref(true)
const disciplina = ref<DisciplinaHeader>({ id: id.value, nombre: '', descripcion: '' })
const canchas = ref<Instalacion[] | undefined>([])

// imágenes opcionales por disciplina (ajusta rutas a tus assets reales)
const IMAGENES: Record<string, string[]> = {
  'Atletismo': ['/src/assets/pista1.jpg', '/src/assets/pista2.jpg'],
  'Natación': ['/src/assets/piscina1.jpg', '/src/assets/piscina2.jpg'],
  'Fútbol': ['/src/assets/cancha1.jpg', '/src/assets/cancha2.jpg'],
  'Tenis': ['/src/assets/tenis1.jpg'],
  'Taekwondo': ['/src/assets/dojo1.jpg'],
  'Baloncesto': ['/src/assets/baloncesto1.jpg'],
  'default': ['/src/assets/villaOlimpica.jpg'],
}
function imagenPorDisciplina(nombre: string, idx: number): string {
  const arr = IMAGENES[nombre] ?? IMAGENES['default'] ?? ['/src/assets/villaOlimpica.jpg']
  return arr[idx % arr.length] ?? '/src/assets/villaOlimpica.jpg'
}

async function cargar() {
  try {
    loading.value = true

    const data = await obtenerInstalacionesPorDisciplina(id.value) ?? []
    canchas.value = data

    const nombreDisc = data[0]?.disciplinaNombre ?? 'Disciplina'
    disciplina.value = {
      id: id.value,
      nombre: nombreDisc,
      descripcion: `Instalaciones registradas para ${nombreDisc}.`,
    }

  } catch (e) {
    console.log('No se pudo cargar la información.', e)
    canchas.value = []
    disciplina.value = { id: id.value, nombre: 'Disciplina no encontrada', descripcion: '' }
  } finally {
    loading.value = false
  }
}

onMounted(cargar)
watch(() => route.params.id, (nuevo) => {
  id.value = Number(nuevo)
  cargar()
})

function reservar(c: Instalacion) {
  router.push(`/instalaciones/${c.id}/disponibilidad`)
}

</script>

<style scoped>
* {
  transition: all 0.3s ease;
}
</style>
