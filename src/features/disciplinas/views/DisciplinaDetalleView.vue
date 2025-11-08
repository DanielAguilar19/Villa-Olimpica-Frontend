<template>
  <div class="min-h-screen bg-[#0f172a] text-white p-6">
    <div class="max-w-5xl mx-auto">
      <!-- 🔙 Botón volver -->
      <div class="mb-8">
        <button
          @click="router.push('/disciplinas')"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-semibold shadow-md transition"
        >
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

        <div v-if="canchas.length === 0" class="text-gray-400 text-center">
          No hay canchas registradas para esta disciplina.
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 gap-8 place-items-center"
        >
          <article
            v-for="c in canchas"
            :key="c.id"
            class="bg-gray-800 hover:bg-gray-700 transition rounded-2xl overflow-hidden shadow-lg w-full max-w-sm"
          >
            <img
              :src="c.imagen"
              :alt="c.nombre"
              class="w-full h-48 object-cover object-center"
            />
            <div class="p-5">
              <h3 class="text-xl font-semibold mb-1">{{ c.nombre }}</h3>
              <p class="text-sm text-gray-300 mb-2">{{ c.ubicacion }}</p>
              <p class="text-sm text-gray-400 mb-3">{{ c.descripcion }}</p>

              <div class="flex items-center justify-between mt-3">
                <span
                  :class="c.disponible ? 'text-green-400' : 'text-yellow-400'"
                  class="text-sm font-semibold"
                >
                  {{ c.disponible ? 'Disponible' : 'Ocupada' }}
                </span>
                <button
                  class="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-full text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                  @click="reservar(c)"
                  :disabled="!c.disponible"
                >
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Disciplina {
  id: number
  nombre: string
  descripcion: string
}

interface Cancha {
  id: number
  nombre: string
  ubicacion: string
  descripcion: string
  disponible: boolean
  imagen: string
}

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const loading = ref(true)
const disciplina = ref<Disciplina>({ id, nombre: '', descripcion: '' })
const canchas = ref<Cancha[]>([])

onMounted(() => {
  // Simulamos una carga con datos mock
  setTimeout(() => {
    if (id === 1) {
      // 🟠 Atletismo
      disciplina.value = {
        id,
        nombre: 'Atletismo',
        descripcion: 'Carreras, saltos y lanzamientos en pista y campo.',
      }
      canchas.value = [
        {
          id: 101,
          nombre: 'Pista Olímpica 400m',
          ubicacion: 'Sector Norte',
          descripcion: 'Pista profesional de tartán con 8 carriles.',
          disponible: true,
          imagen: '/src/assets/pista1.jpg',
        },
        {
          id: 102,
          nombre: 'Área de salto largo',
          ubicacion: 'Sector Este',
          descripcion: 'Zona de entrenamiento con arena fina.',
          disponible: false,
          imagen: '/src/assets/pista2.jpg',
        },
      ]
    } else if (id === 2) {
      // 🔵 Natación
      disciplina.value = {
        id,
        nombre: 'Natación',
        descripcion: 'Competencias acuáticas de velocidad y resistencia.',
      }
      canchas.value = [
        {
          id: 201,
          nombre: 'Piscina Olímpica',
          ubicacion: 'Sector Acuático',
          descripcion: 'Piscina de 50 metros con 10 carriles.',
          disponible: true,
          imagen: '/src/assets/piscina1.jpg',
        },
        {
          id: 202,
          nombre: 'Piscina de Entrenamiento',
          ubicacion: 'Sector Sur',
          descripcion: 'Piscina de 25 metros para práctica.',
          disponible: false,
          imagen: '/src/assets/piscina2.jpg',
        },
      ]
    } else if (id === 3) {
      // 🟢 Fútbol
      disciplina.value = {
        id,
        nombre: 'Fútbol',
        descripcion: 'Deporte en equipo más popular del mundo.',
      }
      canchas.value = [
        {
          id: 301,
          nombre: 'Cancha Principal',
          ubicacion: 'Sector Central',
          descripcion: 'Campo de fútbol 11 con césped natural.',
          disponible: true,
          imagen: '/src/assets/cancha1.jpg',
        },
        {
          id: 302,
          nombre: 'Cancha Sintética',
          ubicacion: 'Sector Oeste',
          descripcion: 'Cancha profesional con iluminación nocturna.',
          disponible: true,
          imagen: '/src/assets/cancha2.jpg',
        },
      ]
    } else {
      // 🔹 Default
      disciplina.value = {
        id,
        nombre: 'Disciplina no encontrada',
        descripcion: 'No hay información disponible para esta disciplina.',
      }
      canchas.value = []
    }

    loading.value = false
  }, 1000)
})

function reservar(c: Cancha) {
  alert(`Has reservado: ${c.nombre}`)
}
</script>

<style scoped>
* {
  transition: all 0.3s ease;
}
</style>
