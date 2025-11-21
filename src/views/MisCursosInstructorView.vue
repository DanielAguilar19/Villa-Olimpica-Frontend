<template>
  <div class="min-h-screen bg-[#0a0f1a] pb-12">
    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <div class="header-logo">
          <i class="pi pi-trophy text-2xl text-yellow-400"></i>
          <span class="text-xl font-bold text-white ml-2">Villa Olímpica - Instructor</span>
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
      <!-- Título -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Mis Cursos</h1>
        <p class="text-gray-400">
          Gestiona los cursos que impartes
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <ProgressSpinner />
        <p class="text-gray-400 mt-4">Cargando tus cursos...</p>
      </div>

      <!-- Sin cursos -->
      <div
        v-else-if="cursos.length === 0"
        class="text-center py-12 glass-card"
      >
        <i class="pi pi-inbox text-6xl text-gray-600 mb-4"></i>
        <h3 class="text-xl font-bold text-white mb-2">No tienes cursos asignados</h3>
        <p class="text-gray-400 mb-6">
          Aún no tienes cursos asignados para impartir
        </p>
      </div>

      <!-- Grid de Cursos -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="curso in cursos"
          :key="curso.id"
          class="glass-card cursor-pointer hover-lift"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="curso-icon">
              <i class="pi pi-book text-2xl text-purple-400"></i>
            </div>
            <Tag
              :value="getEstadoLabel(curso.estado)"
              :severity="getEstadoSeverity(curso.estado)"
            />
          </div>

          <h3 class="text-xl font-bold text-white mb-2">{{ curso.titulo }}</h3>
          <p class="text-gray-400 text-sm mb-4 line-clamp-2">
            {{ curso.descripcion }}
          </p>

          <div class="flex items-center gap-2 mb-3">
            <i class="pi pi-tag text-blue-400 text-sm"></i>
            <span class="text-sm text-gray-300">{{ curso.disciplinaNombre }}</span>
          </div>

          <!-- Inscritos -->
          <div class="flex items-center gap-2 mb-4 p-3 bg-blue-500/10 rounded-lg">
            <i class="pi pi-users text-blue-400"></i>
            <span class="text-sm font-semibold text-blue-300">
              {{ inscritosPorCurso[curso.id] || 0 }} alumnos inscritos
            </span>
          </div>

          <!-- Acciones -->
          <div class="flex gap-2 mt-4">
            <Button
              label="Ver Alumnos"
              icon="pi pi-users"
              class="p-button-sm flex-1"
              @click="verAlumnos(curso.id)"
            />
            <Button
              label="Detalles"
              icon="pi pi-eye"
              class="p-button-sm p-button-outlined"
              @click="verDetalleCurso(curso.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import ProgressSpinner from 'primevue/progressspinner';
import type { CursoCardDTO } from '@/api/cursoCard/inscripciones.api';
import {
  getCursosByInstructor,
  getInscritosPorCurso,
} from '@/api/cursoCard/inscripciones.api';

const router = useRouter();
const toast = useToast();

// ============================================
// ESTADO
// ============================================
const loading = ref(false);
const cursos = ref<CursoCardDTO[]>([]);
const inscritosPorCurso = ref<Record<number, number>>({});

// Instructor actual (desde localStorage)
const usuarioGuardado = localStorage.getItem('usuario');
const instructorId = usuarioGuardado ? JSON.parse(usuarioGuardado).id : null;

console.log('👨‍🏫 Instructor ID:', instructorId);

// ============================================
// MÉTODOS
// ============================================
const cargarCursos = async () => {
  if (!instructorId) {
    console.error('❌ No hay instructorId');
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo obtener el instructor',
      life: 3000,
    });
    return;
  }

  console.log('🔍 Cargando cursos para instructor:', instructorId);
  loading.value = true;
  
  try {
    // Obtener cursos del instructor
    const cursosData = await getCursosByInstructor(instructorId);
    console.log('✅ Cursos recibidos:', cursosData);
    
    cursos.value = cursosData;
    
    // Cargar número de inscritos para cada curso
    const inscritosPromises = cursosData.map(async (curso) => {
      try {
        const count = await getInscritosPorCurso(instructorId, curso.id);
        inscritosPorCurso.value[curso.id] = count;
      } catch (error) {
        console.error(`Error cargando inscritos para curso ${curso.id}:`, error);
        inscritosPorCurso.value[curso.id] = 0;
      }
    });
    
    await Promise.all(inscritosPromises);
    
  } catch (error) {
    console.error('❌ Error cargando cursos:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los cursos',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const verAlumnos = (cursoId: number) => {
  router.push({ name: 'alumnos-curso', params: { cursoId } });
};

const verDetalleCurso = (cursoId: number) => {
  router.push({ name: 'detalle-curso', params: { id: cursoId } });
};

const getEstadoLabel = (estado: string): string => {
  const labels: Record<string, string> = {
    ACTIVO: 'Activo',
    INACTIVO: 'Inactivo',
    CANCELADO: 'Cancelado',
  };
  return labels[estado] || estado;
};

const getEstadoSeverity = (estado: string) => {
  const severities: Record<string, string> = {
    ACTIVO: 'success',
    INACTIVO: 'warning',
    CANCELADO: 'danger',
  };
  return severities[estado] || 'info';
};

// ============================================
// LIFECYCLE
// ============================================
onMounted(() => {
  cargarCursos();
});
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