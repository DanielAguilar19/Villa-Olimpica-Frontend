<!-- src/components/UI/AdminSidebar.vue -->
<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-icon">🏛️</span>
        <h2>Admin Panel</h2>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section">
        <p class="section-title">Principal</p>

        <router-link to="/admin/reservas" class="nav-item">
          <span class="icon">
            <i class="pi pi-calendar-clock"></i>
          </span>
          <span class="text">Reservas</span>
        </router-link>

        <router-link to="/admin/disciplinas" class="nav-item">
          <span class="icon">
            <i class="pi pi-objects-column"></i>
          </span>
          <span class="text">Disciplinas</span>
        </router-link>

        <router-link to="/admin/usuarios" class="nav-item">
          <span class="icon">
            <i class="pi pi-user"></i>
          </span>
          <span class="text">Usuarios</span>
        </router-link>
      </div>
    </nav>

    <div class="sidebar-footer">
      <router-link to="/user/home" class="nav-item footer-item">
        <span class="icon">
          <i class="pi pi-home" style="color: #38BDF8; font-size: 1.4rem;"></i>
        </span>
        <span class="text">Volver al inicio</span>
      </router-link>
    </div>
  </aside>
</template>

<style scoped>
.admin-sidebar {
  width: 280px;
  min-height: 100vh;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

/* Header */
.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 2rem;
}

.logo h2 {
  margin: 0;
  font-size: 1.375rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 2rem;
}

.section-title {
  padding: 0 1.5rem;
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.5rem;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.nav-item.router-link-active {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, transparent 100%);
  color: white;
  border-left: 3px solid #3b82f6;
  padding-left: calc(1.5rem - 3px);
}

.nav-item.router-link-active::before {
  content: '';
  position: absolute;
  right: 1rem;
  width: 6px;
  height: 6px;
  background: #3b82f6;
  border-radius: 50%;
  box-shadow: 0 0 10px #3b82f6;
}

.nav-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.icon {
  font-size: 1.375rem;
  min-width: 1.5rem;
  text-align: center;
}

.text {
  font-size: 0.9375rem;
  font-weight: 500;
}

.badge-soon {
  margin-left: auto;
  padding: 0.125rem 0.5rem;
  font-size: 0.625rem;
  font-weight: 600;
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border-radius: 9999px;
  text-transform: uppercase;
}

/* Footer */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.footer-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

/* Scrollbar personalizado */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .admin-sidebar {
    width: 70px;
  }

  .logo h2,
  .text,
  .section-title,
  .badge-soon {
    display: none;
  }

  .logo {
    justify-content: center;
  }

  .nav-item {
    justify-content: center;
    padding: 0.875rem;
  }

  .icon {
    font-size: 1.5rem;
  }
}
</style>
