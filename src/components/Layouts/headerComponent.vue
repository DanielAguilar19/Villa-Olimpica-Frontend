<template>
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
          <InputText v-model="searchQuery" placeholder="Buscar disciplinas o cursos" class="search-input" />
        </IconField>
      </div>

      <!-- Acciones del header (derecha) -->
      <div class="header-actions">

        <!-- Perfil -->
        <Button label="Perfil" icon="pi pi-user" text class="btn-perfil" @click="irAlPerfil" />

        <!-- Cerrar sesión -->
        <logoutButton />
      </div>
    </div>
  </header>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import logoutButton from '@/components/UI/logoutButton.vue';

const router = useRouter()
const searchQuery = ref('')

const irAlPerfil = () => router.push({ name: 'perfil' })

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
  width: 150%;
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
</style>
