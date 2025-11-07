<template>
  <div class="bg-gray-900 min-h-screen text-white">
    <!-- 🏅 Encabezado con fondo -->
    <header
      class="relative h-64 sm:h-80 lg:h-96 flex flex-col justify-center items-start px-10"
    >
      <img
        src="@/assets/stadium.jpg"
        alt="Fondo deportivo"
        class="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div class="relative z-10">
        <h1 class="text-4xl sm:text-5xl font-bold mb-2">Disciplinas Deportivas</h1>
        <p class="text-gray-300 text-lg">
          Explora todas las categorías y deportes de la Villa Olímpica
        </p>
      </div>
    </header>

    <!-- 🟢 Sección de tarjetas -->
    <main class="px-8 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- 🔁 Tarjeta por disciplina -->
        <div
          v-for="d in disciplinas"
          :key="d.id"
          class="bg-gray-800 hover:bg-gray-700 transition rounded-2xl shadow-lg overflow-hidden cursor-pointer"
          @click="abrirDisciplina(d)"
        >
          <!-- 📸 Imagen de la disciplina (como el stadium) -->
          <div class="relative">
          <img
              :src="d.imagen"
               :alt="d.nombre"
                class="w-full h-48 object-cover object-center transition-transform duration-300 hover:scale-105"
          />

            <h2
              class="absolute bottom-3 left-4 text-2xl font-bold text-white drop-shadow-lg"
            >
              {{ d.nombre }}
            </h2>
          </div>

          <!-- 📋 Descripción y detalles -->
          <div class="p-5">
            <p class="text-gray-300 mb-4">{{ d.descripcion }}</p>
            <div class="flex items-center justify-between">
              <div
                class="flex items-center gap-2 text-sm text-green-400 hover:underline"
              >
                <i class="pi pi-eye"></i>
                <span>Ver detalle</span>
              </div>
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold text-white"
                :style="{ backgroundColor: d.color }"
              >
                {{ d.categoria }}
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

// ✅ Igual que el stadium: importamos las imágenes directamente
import atletismoImg from '@/assets/atletismo.jpg'
import natacionImg from '@/assets/natacion.jpg'
import futbolImg from '@/assets/futbol.jpg'
import tenisImg from '@/assets/tenis.jpg'
import TaekwondoImg from '@/assets/Taekwondo.jpg'
import BaloncestoImg from '@/assets/Baloncesto.jpg'

const router = useRouter()
const disciplinas = ref<
  Array<{
    id: number
    nombre: string
    descripcion: string
    categoria: string
    color: string
    imagen: string
  }>
>([])

onMounted(() => {
  disciplinas.value = [
    {
      id: 1,
      nombre: 'Atletismo',
      descripcion: 'Carreras, saltos y lanzamientos en pista y campo.',
      categoria: 'Individual',
      color: '#F97316',
      imagen: atletismoImg,
    },
    {
      id: 2,
      nombre: 'Natación',
      descripcion: 'Competencias acuáticas de velocidad y resistencia.',
      categoria: 'Acuático',
      color: '#F97316',
      imagen: natacionImg,
    },
    {
      id: 3,
      nombre: 'Fútbol',
      descripcion: 'Deporte en equipo más popular del mundo.',
      categoria: 'Equipo',
      color: '#F97316',
      imagen: futbolImg,
    },
    {
      id: 4,
      nombre: 'Tenis',
      descripcion: 'Juego individual o en pareja con raquetas.',
      categoria: 'Individual',
      color: '#F97316',
      imagen: tenisImg,
    },
     {
      id: 5,
      nombre: 'Taekwondo',
      descripcion: 'Defensa personal',
      categoria: 'Individual',
      color: '#F97316',
      imagen: TaekwondoImg,
    },
     {
      id: 6,
      nombre: 'Baloncesto',
      descripcion: 'Practica tu destreza y movilidad.',
      categoria: 'Individual',
      color: '#F97316',
      imagen: BaloncestoImg,
    },
  ]
})

// 🔹 Navegación al detalle
function abrirDisciplina(d: { id: number }) {
  router.push({ name: 'disciplinaDetalle', params: { id: d.id } })
}
</script>

<style scoped>
/* 🔹 Fondo oscuro que cubre toda la pantalla */
.bg-gray-900 {
  background-color: #0f172a;
  min-height: 100vh;
}

/* 🔹 Transiciones suaves en hover */
* {
  transition: all 0.3s ease;
}
</style>
