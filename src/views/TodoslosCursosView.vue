<template>
  <div class="min-h-screen bg-[#0a0f1a] pb-12">
    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <div class="header-logo">
          <i class="pi pi-trophy text-2xl text-yellow-400"></i>
          <span class="text-xl font-bold text-white ml-2">Villa Olímpica</span>
        </div>
        <div class="header-actions">
          <Button
            label="Volver"
            icon="pi pi-arrow-left"
            text
            @click="$router.push({ name: 'home' })"
            class="btn-home"
          />
        </div>
      </div>
    </header>

    <!-- Contenido Principal -->
    <div class="container max-w-7xl px-6 md:px-10 pt-8">
      <h1 class="text-4xl font-bold text-white mb-2">Explorar Cursos</h1>
      <p class="text-gray-400 mb-8">
        Explora todos los cursos disponibles y regístrate en los que desees
      </p>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <ProgressSpinner />
        <p class="text-gray-400 mt-4">Cargando cursos...</p>
      </div>

      <!-- Sin cursos -->
      <div v-else-if="cursos.length === 0" class="text-center py-12 glass-card">
        <i class="pi pi-inbox text-6xl text-gray-600 mb-4"></i>
        <h3 class="text-xl font-bold text-white mb-2">No hay cursos disponibles</h3>
        <p class="text-gray-400 mb-6">
          Actualmente no hay cursos activos en la plataforma
        </p>
      </div>

      <!-- Grid de cursos -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="curso in cursos"
          :key="curso.id"
          class="glass-card hover-lift"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="curso-icon">
              <i class="pi pi-book text-2xl text-purple-400"></i>
            </div>
            <Tag
              :value="curso.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'"
              :severity="curso.estado === 'ACTIVO' ? 'success' : 'danger'"
            />
          </div>

          <h3 class="text-xl font-bold text-white mb-2">{{ curso.titulo }}</h3>
          <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ curso.descripcion }}</p>

          <div class="flex items-center gap-2 mb-4">
            <i class="pi pi-tag text-blue-400 text-sm"></i>
            <span class="text-sm text-gray-300">{{ curso.disciplinaNombre }}</span>
          </div>

          <!-- Botón de inscripción -->
          <Button
            v-if="curso.estado === 'ACTIVO'"
            label="Inscribirse"
            icon="pi pi-check"
            class="p-button-sm p-button-primary w-full"
            @click="inscribirse(curso.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import ProgressSpinner from 'primevue/progressspinner';
import { useToast } from 'primevue/usetoast';

import type { CursoCardDTO, InscripcionRequest } from '@/api/cursoCard/inscripciones.api';
import { obtenerCursos, inscribirUsuario } from '@/api/cursoCard/inscripciones.api';

const toast = useToast();
const cursos = ref<CursoCardDTO[]>([]);
const loading = ref(false);

const cargarCursos = async () => {
  loading.value = true;
  try {
    cursos.value = await obtenerCursos();
  } catch (error) {
    console.error('Error cargando cursos:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los cursos', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const inscribirse = async (cursoId: number) => {
  try {
    const usuarioIdStr = localStorage.getItem('id'); // obtenemos el id del usuario como string
    if (!usuarioIdStr) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener el usuario', life: 3000 });
      return;
    }

    const usuarioId = Number(usuarioIdStr); // convertimos a número
    const request: InscripcionRequest = { cursoId, usuarioId };
    await inscribirUsuario(request);

    toast.add({ severity: 'success', summary: 'Inscripción', detail: 'Inscripción realizada con éxito', life: 3000 });
  } catch (error) {
    console.error('Error al inscribirse:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo inscribir al curso', life: 3000 });
  }
};


onMounted(() => cargarCursos());
</script>

<style scoped>
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
  justify-content: space-between;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.glass-card {
  background: rgba(17, 25, 40, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.125);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-8px);
  background: rgba(17, 25, 40, 0.8);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.curso-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(168, 85, 247, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn-home {
  color: #f8f9f5;
  transition: all 0.3s ease;
}

.btn-home:hover {
  color: #7dd3fc;
  text-shadow: 0 0 8px rgba(125, 211, 252, 0.5);
}
</style>
