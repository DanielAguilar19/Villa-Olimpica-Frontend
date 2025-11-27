<template>
  <div class="cursos-container">
    <header class="cursos-header">
      <h1> Villa Olímpica </h1>
      <h2>Programas Deportivos Disponibles</h2>
      <p>Elige entre los programas de formación deportiva disponibles</p>
    </header>

    <div v-if="cursos.length === 0" class="no-cursos">
      <p>No hay cursos disponibles actualmente.</p>
    </div>

    <div class="cursos-grid" v-else>
      <div class="curso-card" v-for="curso in cursos" :key="curso.id">
        <h3>{{ curso.titulo }}</h3>
        <p class="descripcion">{{ curso.descripcion }}</p>
        <span class="estado" :class="curso.estado">{{ curso.estado }}</span>
      </div>
    </div>
  </div>
</template>
<!-- eslint-disable vue/block-lang -->
<script setup>
import { ref, onMounted } from 'vue'
import { obtenerCursos } from '@/services/cursoService'

const cursos = ref([])

onMounted(async () => {
  cursos.value = await obtenerCursos()
})
</script>

<style scoped>
.cursos-container {
  padding: 2rem;
  font-family: "Poppins", sans-serif;
  background: #f4f8ff;
  min-height: 100vh;
}

.cursos-header {
  text-align: center;
  background: linear-gradient(120deg, #0056b3, #007bff);
  padding: 2rem;
  color: white;
  border-radius: 10px;
  margin-bottom: 2rem;
}

.cursos-header h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.cursos-header h2 {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.cursos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.curso-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  border-left: 4px solid #007bff;
}

.curso-card:hover {
  transform: translateY(-4px);
}

.curso-card h3 {
  color: #0056b3;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.descripcion {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 0.8rem;
}

.estado {
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
}

.estado.activo {
  background-color: #28a745;
  color: white;
}

.no-cursos {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
}
</style>
