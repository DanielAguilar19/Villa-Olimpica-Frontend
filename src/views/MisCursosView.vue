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
      <!-- Título -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Mis Cursos</h1>
        <p class="text-gray-400">
          Gestiona tus inscripciones y progreso en los cursos
        </p>
      </div>

      <!-- Tabs: Activos / Todos -->
      <div class="mb-8">
        <div class="flex gap-4 border-b border-gray-700">
          <button
            @click="mostrarTodos = false"
            :class="[
              'px-6 py-3 font-semibold transition-all',
              !mostrarTodos
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white',
            ]"
          >
            <i class="pi pi-check-circle mr-2"></i>
            Activos ({{ cursosActivos.length }})
          </button>
          <button
            @click="mostrarTodos = true"
            :class="[
              'px-6 py-3 font-semibold transition-all',
              mostrarTodos
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white',
            ]"
          >
            <i class="pi pi-list mr-2"></i>
            Todos ({{ todosCursos.length }})
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <ProgressSpinner />
        <p class="text-gray-400 mt-4">Cargando tus cursos...</p>
      </div>

      <!-- Sin cursos -->
      <div
        v-else-if="cursosAMostrar.length === 0"
        class="text-center py-12 glass-card"
      >
        <i class="pi pi-inbox text-6xl text-gray-600 mb-4"></i>
        <h3 class="text-xl font-bold text-white mb-2">No tienes cursos</h3>
        <p class="text-gray-400 mb-6">
          {{
            mostrarTodos
              ? 'Aún no te has inscrito en ningún curso'
              : 'No tienes cursos activos en este momento'
          }}
        </p>
        <Button
          label="Explorar Cursos"
          icon="pi pi-search"
          @click="$router.push({ name: 'cursos' })"
          class="p-button-primary"
        />
      </div>

      <!-- Grid de Cursos -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="curso in cursosAMostrar"
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

          <div class="flex items-center gap-2 mb-4">
            <i class="pi pi-tag text-blue-400 text-sm"></i>
            <span class="text-sm text-gray-300">{{ curso.disciplinaNombre }}</span>
          </div>

          <!-- Acciones -->
          <div class="flex gap-2 mt-4">
            <Button
              label="Ver Detalles"
              icon="pi pi-eye"
              class="p-button-sm flex-1"
              @click="verDetalleCurso(curso.id)"
            />
            <Button
              v-if="curso.estado === 'ACTIVO'"
              icon="pi pi-times"
              class="p-button-sm p-button-danger p-button-outlined"
              @click="confirmarCancelar(curso.id)"
              v-tooltip.top="'Cancelar inscripción'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import ProgressSpinner from 'primevue/progressspinner';

// ✅ IMPORTAR DESDE LA API
import type { CursoCardDTO } from '@/api/cursoCard/inscripciones.api';
import {
  getCursosActivosByUsuario,
  getAllCursosByUsuario,
  cancelarInscripcion,
} from '@/api/cursoCard/inscripciones.api';

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

// ============================================
// ESTADO
// ============================================
const loading = ref(false);
const mostrarTodos = ref(false);
const cursosActivos = ref<CursoCardDTO[]>([]);
const todosCursos = ref<CursoCardDTO[]>([]);

// Usuario actual (desde localStorage)
const usuarioGuardado = localStorage.getItem('usuario');
const usuarioId = usuarioGuardado ? JSON.parse(usuarioGuardado).id : null;

// En MisCursosView.vue

console.log('👤 Usuario completo:', usuarioGuardado);


console.log('🆔 Usuario ID que se enviará:', usuarioId);

// ============================================
// COMPUTED
// ============================================
const cursosAMostrar = computed(() => {
  return mostrarTodos.value ? todosCursos.value : cursosActivos.value;
});

// ============================================
// MÉTODOS
// ============================================
const cargarCursos = async () => {
  if (!usuarioId) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo obtener el usuario',
      life: 3000,
    });
    return;
  }

  loading.value = true;
  try {
    const [activos, todos] = await Promise.all([
      getCursosActivosByUsuario(usuarioId),
      getAllCursosByUsuario(usuarioId),
    ]);
    console.log('✅ Datos recibidos - Activos:', JSON.stringify(activos, null, 2));
    console.log('✅ Datos recibidos - Todos:', JSON.stringify(todos, null, 2));
    cursosActivos.value = activos;
    todosCursos.value = todos;
  } catch (error) {
    console.error('Error cargando cursos:', error);
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

const confirmarCancelar = (cursoId: number) => {
  confirm.require({
    message: '¿Estás seguro de cancelar tu inscripción a este curso?',
    header: 'Confirmar Cancelación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí, cancelar',
    rejectLabel: 'No',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await cancelarInscripcionCurso(cursoId);
    },
  });
};

const cancelarInscripcionCurso = async (cursoId: number) => {
  try {
  
    const inscripcionId = 1; // 
    
    await cancelarInscripcion(inscripcionId);
    
    toast.add({
      severity: 'success',
      summary: 'Inscripción cancelada',
      detail: 'Tu inscripción ha sido cancelada exitosamente',
      life: 3000,
    });

    // Recargar cursos
    await cargarCursos();
  } catch (error) {
    console.error('Error cancelando inscripción:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cancelar la inscripción',
      life: 3000,
    });
  }
};

const verDetalleCurso = (cursoId: number) => {
  router.push({ name: 'detalle-curso', params: { id: cursoId } });
};

const getEstadoLabel = (estado: string): string => {
  const labels: Record<string, string> = {
    ACTIVO: 'Activo',
    CANCELADO: 'Cancelado',
    COMPLETADO: 'Completado',
  };
  return labels[estado] || estado;
};

const getEstadoSeverity = (estado: string) => {
  const severities: Record<string, string> = {
    ACTIVO: 'success',
    CANCELADO: 'danger',
    COMPLETADO: 'info',
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