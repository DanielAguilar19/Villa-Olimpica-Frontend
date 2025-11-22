npm run devP<template>
<body class="bg-[#0a0f1a]">

  <div class="min-h-screen bg-[#0a0f1a] pb-12">
    <!-- Header con menú -->
    <header class="app-header">
      <div class="header-content">
        <!-- Logo -->
        <div class="header-logo">
          <i class="pi pi-trophy text-2xl text-yellow-400"></i>
          <span class="text-xl font-bold text-white ml-2">Villa Olímpica</span>
        </div>

        <!-- Barra de búsqueda (centro) -->
        <div class="header-search hidden md:flex">
          <IconField iconPosition="left">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="searchQuery"
              placeholder="Buscar disciplinas o cursos"
              class="search-input"
            />
          </IconField>
        </div>

        <!-- Acciones del header (derecha) -->
        <div class="header-actions">
          <!-- Home -->
          <Button
            label="Home"
            icon="pi pi-home"
            text
            @click="irA('home')"
            class="btn-home hidden md:inline-flex "
          />

          <!-- Perfil -->
          <Button
            label="Perfil"
            icon="pi pi-user"
            text
            class="btn-perfil"
            @click="irAlPerfil"
          />

          <!-- Cerrar sesión -->
          <Button
            label="Salir"
            icon="pi pi-sign-out"
            severity="danger"
            text
            class="btn-salir"
            @click="cerrarSesion"
          />
        </div>
      </div>
    </header>

    <!-- Header con carrusel de imágenes -->
    <div class="hero-section relative overflow-hidden">
      <div class="hero-overlay absolute inset-0 bg-gradient-to-r from-[#0a0f1a]/95 via-blue-900/80 to-transparent z-10"></div>


      <!-- Carrusel de imágenes -->
      <div class="hero-carousel absolute inset-0">
        <div
          v-for="(imagen, index) in imagenesHero"
          :key="index"
          class="hero-image absolute inset-0 w-full h-full transition-opacity duration-1000"
          :class="{ 'opacity-100': index === imagenActual, 'opacity-0': index !== imagenActual }"
        >
          <img
            :src="imagen.url"
            :alt="imagen.alt"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Indicadores del carrusel -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        <button
          v-for="(_, index) in imagenesHero"
          :key="index"
          @click="cambiarImagen(index)"
          class="carousel-indicator"
          :class="{ active: index === imagenActual }"
        ></button>
      </div>

      <div class="hero-content relative z-20 container mx-auto px-6 py-20 md:py-32">
        <div class="max-w-3xl text-white">
          <div class="flex items-center gap-3 mb-4 animate-fade-in">
            <h1 class="text-4xl md:text-6xl font-bold">Villa Olímpica</h1>
          </div>
          <p class="text-xl md:text-2xl mb-2 animate-fade-in-delay">
            Bienvenido de nuevo, <span class="font-bold">{{ nombreUsuario }}</span>
          </p>
          <p class="text-lg text-blue-200 mb-8 animate-fade-in-delay">
            Retoma donde lo dejaste o explora algo nuevo.
          </p>
        </div>
      </div>

      <!-- Controles de navegación -->
      <button @click="imagenAnterior" class="carousel-nav carousel-nav-left">
        <i class="pi pi-chevron-left"></i>
      </button>
      <button @click="imagenSiguiente" class="carousel-nav carousel-nav-right">
        <i class="pi pi-chevron-right"></i>
      </button>
    </div>

    <!-- Contenido principal -->
    <div class="container max-w-7xl px-6 md:px-10">
      <!-- Cards principales de acciones (3 grandes) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <!-- Ver Disciplinas -->
        <div class="glass-card cursor-pointer" @click="verDisciplinas">
          <div class="card-content">
            <div class="card-icon bg-blue-500/20">
              <i class="pi pi-th-large text-4xl text-blue-400"></i>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">Ver Disciplinas</h3>
            <p class="text-gray-400 mb-4">Todas las categorías deportivas</p>
            <Button
              label="Abrir"
              icon="pi pi-arrow-right"
              text
              class="text-blue-400 hover:text-blue-300"
            />
          </div>
        </div>

        <!-- Explorar Cursos -->
        <div class="glass-card cursor-pointer" @click="explorarCursos">
          <div class="card-content">
            <div class="card-icon bg-purple-500/20">
              <i class="pi pi-book text-4xl text-purple-400"></i>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">Explorar Cursos</h3>
            <p class="text-gray-400 mb-4">Próximos y bajo demanda</p>
            <Button
              label="Abrir"
              icon="pi pi-arrow-right"
              text
              class="text-purple-400 hover:text-purple-300"
            />
          </div>
        </div>

        <!-- Gestionar Reservas -->
        <div class="glass-card cursor-pointer" @click="gestionarReservas">
          <div class="card-content">
            <div class="card-icon bg-green-500/20">
              <i class="pi pi-calendar text-4xl text-green-400"></i>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">Gestionar Reservas</h3>
            <p class="text-gray-400 mb-4">Ver y reprogramar</p>
            <Button
              label="Abrir"
              icon="pi pi-arrow-right"
              text
              class="text-green-400 hover:text-green-300"
            />
          </div>
        </div>
      </div>

      <!-- Reservas Activas -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white flex items-center gap-3">
            <i class="pi pi-bookmark text-green-400"></i>
            Reservas Activas
          </h2>
          <Button
            label="Ver todo"
            icon="pi pi-arrow-right"
            text
            class="text-blue-400"
            @click="verTodasReservas"
          />
        </div>

        <!--div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="reserva in reservasActivas"
            :key="reserva.id"
            class="glass-card-small"
          >
            <div class="flex items-start gap-4">
              <div class="reserva-icon">
                <i class="pi pi-calendar text-2xl text-blue-400"></i>
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-lg text-white mb-1">{{ reserva.titulo }}</h3>
                <p class="text-gray-400 text-sm mb-2">
                  {{ reserva.fecha }} • {{ reserva.hora }} • {{ reserva.instructor }}
                </p>
                <Tag
                  :value="reserva.estado"
                  :severity="getEstadoSeverity(reserva.estado)"
                  :style="getEstadoStyle(reserva.estado)"
                />
              </div>
            </div>
          </div>
        </div-->
      </div>

      <!-- Cursos Activos -->
      <div>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white flex items-center gap-3">
            <i class="pi pi-play-circle text-purple-400"></i>
            Tus Cursos Activos
          </h2>
          <Button
            label="Continuar"
            icon="pi pi-arrow-right"
            text
            class="text-purple-400"
            @click="continuarCursos"
          />
        </div>

        <!--div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="curso in cursosActivos"
            :key="curso.id"
            class="glass-card-small"
          >
            <div class="flex items-start gap-4">
              <div class="curso-icon">
                <i class="pi pi-book text-2xl text-purple-400"></i>
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-lg text-white mb-1">{{ curso.titulo }}</h3>
                <p class="text-gray-400 text-sm mb-3">
                  {{ curso.modulo }} • {{ curso.tiempo }}
                </p>
                <ProgressBar
                  :value="curso.progreso"
                  :show-value="false"
                  class="custom-progress"
                />
                <div class="flex items-center justify-between mt-3">
                  <Tag
                    :value="curso.estado"
                    severity="success"
                    style="background-color: rgba(34, 197, 94, 0.2); color: #4ade80;"
                  />
                  <span class="text-sm text-gray-400">{{ curso.progreso }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div-->
      </div>
    </div>
  </div>
  </body>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
//import Tag from 'primevue/tag'
//import ProgressBar from 'primevue/progressbar'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
//import Toast from 'primevue/toast'
//import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const confirm = useConfirm()
const toast = useToast()

const searchQuery = ref('')

const usuarioGuardado = localStorage.getItem('usuario')
const nombreUsuario = ref('Usuario')

if (usuarioGuardado) {
  const usuario = JSON.parse(usuarioGuardado)
  nombreUsuario.value = usuario.nombre
}

// Imágenes del carrusel
const imagenesHero = ref([
  {
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070',
    alt: 'Pista de atletismo'
  },
  {
    url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2070',
    alt: 'Piscina olímpica'
  },
  {
    url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070',
    alt: 'Gimnasio'
  },
  {
    url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070',
    alt: 'Basketball'
  },
  {
    url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070',
    alt: 'Entrenamiento'
  }
])

const imagenActual = ref(0)
let intervaloCarrusel: number | null = null

const cambiarImagen = (index: number) => {
  imagenActual.value = index
  reiniciarIntervalo()
}

const imagenSiguiente = () => {
  imagenActual.value = (imagenActual.value + 1) % imagenesHero.value.length
  reiniciarIntervalo()
}

const imagenAnterior = () => {
  imagenActual.value = imagenActual.value === 0
    ? imagenesHero.value.length - 1
    : imagenActual.value - 1
  reiniciarIntervalo()
}

const iniciarCarrusel = () => {
  intervaloCarrusel = window.setInterval(() => {
    imagenSiguiente()
  }, 5000)
}

const detenerCarrusel = () => {
  if (intervaloCarrusel !== null) {
    clearInterval(intervaloCarrusel)
  }
}

const reiniciarIntervalo = () => {
  detenerCarrusel()
  iniciarCarrusel()
}

onMounted(() => {
  iniciarCarrusel()
})

onUnmounted(() => {
  detenerCarrusel()
})

// Reservas activas
/*const reservasActivas = ref([])*/

// Cursos activos
/*const cursosActivos = ref([])*/

// Métodos
const irA = (routeName: string) => router.push({ name: routeName })
const verDisciplinas = () => router.push({ name: 'disciplinas' })
const explorarCursos = () => router.push({ name: 'cursos' })
const gestionarReservas = () => router.push({ name: 'reservas' })
const verTodasReservas = () => router.push({ name: 'reservas' })
const continuarCursos = () => router.push({ name: 'cursos' })
const irAlPerfil = () => router.push({ name: 'perfil' })

const cerrarSesion = () => {
  confirm.require({
    message: '¿Estás seguro de que quieres cerrar sesión?',
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí, salir',
    rejectLabel: 'Cancelar',
    accept: () => {
      localStorage.removeItem('usuario')
      toast.add({ severity: 'success', summary: 'Sesión cerrada', detail: 'Has cerrado sesión exitosamente', life: 3000 })
      router.push({ name: 'login' })
    }
  })
}

/*
const getEstadoSeverity = (estado: string) => {
  const map: Record<string, string> = {
    'En curso': 'info',
    'Confirmada': 'success',
    'Empieza pronto': 'warning'
  }
  return map[estado] || 'info'
}

const getEstadoStyle = (estado: string) => {
  const styles: Record<string, string> = {
    'En curso': 'background-color: rgba(59, 130, 246, 0.2); color: #60a5fa;',
    'Confirmada': 'background-color: rgba(34, 197, 94, 0.2); color: #4ade80;',
    'Empieza pronto': 'background-color: rgba(251, 146, 60, 0.2); color: #fb923c;'
  }
  return styles[estado] || ''
}
  */
</script>

<style scoped>
/* Header */
.app-header {
  position: sticky;
  top: 0;
  z-index: 999;
  background: rgba(17, 25, 40, 0.8);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
}

.header-content {
  max-width: 1800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  justify-content: space-between;
}

.header-logo {
  display: flex;
  align-items: center;
    gap: 0.6rem;

}


.header-search {
  flex: 1;
  display: flex;
justify-content: center;
}

.search-input {
  width:150%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 8px;
  padding: 0.5rem 1rem;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Botón Home */
.header-actions .btn-home {
  color: #f8f9f5;
  transition: all 0.3s ease;
}
.header-actions .btn-home:hover {
  color: #7dd3fc;
  text-shadow: 0 0 8px rgba(125, 211, 252, 0.5);
}

/* Botón Perfil */
.header-actions .btn-perfil {
  color: #f8f9f5;
  transition: all 0.3s ease;
}
.header-actions .btn-perfil:hover {
  color: #7dd3fc;
  text-shadow: 0 0 8px rgba(125, 211, 252, 0.5);
}

/* Botón Salir */
.header-actions .btn-salir {
  color: #f87171;
  transition: all 0.3s ease;
}
.header-actions .btn-salir:hover {
  color: #fca5a5;
  text-shadow: 0 0 8px rgba(252, 165, 165, 0.5);
}

.container {
  max-width: 1650px;
  margin: 0 auto;
  padding-top: 4rem;
}

/* Cards principales */


.glass-card {
  text-align: center;
  border-radius: 20px;
  padding: 2.5rem;
}

.card-icon {
  width: 90px;
  height: 90px;
  margin-bottom: 1.2rem;
}

/* Secciones de reservas y cursos */
.mb-12 {
  margin-bottom: 4rem;
}


/* Hero y carrusel (mantén los estilos anteriores) */
.hero-section { height: 600px; position: relative; }
.hero-image img { object-fit: cover; animation: subtle-zoom 20s ease-in-out infinite alternate; }
@keyframes subtle-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.05); } }

.glass-card {
  background: rgba(17, 25, 40, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.125);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-8px);
  background: rgba(17, 25, 40, 0.75);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.glass-card-small {
  background: rgba(17, 25, 40, 0.5);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.glass-card-small:hover {
  transform: translateY(-4px);
  background: rgba(17, 25, 40, 0.7);
}

.card-content { text-align: center; }
.card-icon { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
.reserva-icon, .curso-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(107, 167, 5, 0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.curso-icon { background: rgba(168, 85, 247, 0.1); }

.carousel-indicator { width: 12px; height: 12px; border-radius: 50%; background-color: rgba(255, 255, 255, 0.5); border: 2px solid white; cursor: pointer; transition: all 0.3s ease; }
.carousel-indicator:hover { background-color: rgba(255, 255, 255, 0.8); transform: scale(1.2); }
.carousel-indicator.active { background-color: white; width: 32px; border-radius: 6px; }

.carousel-nav { position: absolute; top: 80%; transform: translateY(-50%); z-index: 30; background-color: rgba(0, 0, 0, 0.5); color: white; border: none; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
.carousel-nav:hover { background-color: rgba(0, 0, 0, 0.8); transform: translateY(-50%) scale(1.1); }
.carousel-nav-left { left: 2rem; }
.carousel-nav-right { right: 2rem; }

.animate-fade-in { animation: fadeIn 1s ease-out; }
.animate-fade-in-delay { animation: fadeIn 1s ease-out 0.3s both; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

:deep(.custom-progress .p-progressbar-value) { background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%); }
:deep(.custom-progress) { height: 8px; background: rgba(139, 92, 246, 0.1); border-radius: 4px; }
:deep(.p-tag) { font-size: 0.75rem; padding: 0.25rem 0.75rem; border-radius: 6px; }

@media (max-width: 768px) {
  .hero-section { height: 400px; }
  .carousel-nav { width: 40px; height: 40px; font-size: 1.2rem; }
  .carousel-nav-left { left: 1rem; }
  .carousel-nav-right { right: 1rem; }
}
</style>
