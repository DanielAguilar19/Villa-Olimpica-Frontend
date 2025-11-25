<template>
  <div class="admin-layout">
    <AdminSidebar />

    <div class="admin-content">
      <!-- Barra superior -->
      <header class="admin-header">
        <div class="header-left">
          <h1>{{ pageTitle }}</h1>
          <span class="breadcrumb">{{ breadcrumb }}</span>
        </div>

        <div class="header-right">
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">Administrador</span>
          </div>
          <div class="user-avatar">
            {{ userInitials }}
          </div>
          <logoutButton />
        </div>
      </header>

      <!-- Contenido dinámico -->
      <main class="admin-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AdminSidebar from '@/components/UI/AdminSidebar.vue';
import logoutButton from '@/components/UI/logoutButton.vue';

const route = useRoute();

const userName = computed(() => {
  const name = localStorage.getItem('username');
  if (!name) {
    return 'Administrador';
  }
  return name;
});



const userInitials = computed(() => {
  const name = userName.value;
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

// Títulos de página según la ruta
const pageTitles: Record<string, { title: string; breadcrumb: string }> = {
  '/admin/home': {
    title: 'Dashboard',
    breadcrumb: 'Admin / Dashboard'
  },
  '/admin/disciplinas': {
    title: 'Gestión de Disciplinas',
    breadcrumb: 'Admin / Disciplinas'
  },
  '/admin/reservas': {
    title: 'Gestión de Reservas',
    breadcrumb: 'Admin / Reservas'
  },
  '/admin/instalaciones': {
    title: 'Gestión de Instalaciones',
    breadcrumb: 'Admin / Instalaciones'
  },
  '/admin/usuarios': {
    title: 'Gestión de Usuarios',
    breadcrumb: 'Admin / Usuarios'
  }
};

const pageTitle = computed(() => {
  return pageTitles[route.path]?.title || 'Panel de Administración';
});

const breadcrumb = computed(() => {
  return pageTitles[route.path]?.breadcrumb || 'Admin';
});
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

/* Contenido principal */
.admin-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.header-left h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.breadcrumb {
  font-size: 0.875rem;
  color: #64748b;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.125rem;
}

.user-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
}

.user-role {
  font-size: 0.75rem;
  color: #64748b;
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* Main content */
.admin-main {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-header {
    padding: 1rem;
  }

  .header-left h1 {
    font-size: 1.25rem;
  }

  .user-info {
    display: none;
  }

  .admin-main {
    padding: 1rem;
  }
}

/* Scrollbar personalizado */
.admin-main::-webkit-scrollbar {
  width: 8px;
}

.admin-main::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.admin-main::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.admin-main::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
