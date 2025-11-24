<template>
  <div class="admin-home-root">
    <div class="home-header card-like">
      <div>
        <h2 class="text-black">Bienvenido, {{ userName }}</h2>
        <p class="subtitle">Panel de administración — accede rápido a las secciones principales</p>
      </div>
    </div>

    <div class="cards-grid">
      <Card class="home-card card-like">
        <template #title>
          <div class="card-title">
            <Avatar class="card-avatar" label="R" shape="circle" size="large" />
            <div class="card-meta">
              <h3>Reservas</h3>
              <p>Administrar y revisar todas las reservas del sistema.</p>
            </div>
          </div>
        </template>

        <div class="card-body">
          <p>Ver, editar, filtrar y confirmar reservas. Accede a los detalles por usuario o cancha.</p>
        </div>

        <template #footer>
          <div class="card-footer">
            <Button label="Ir a Reservas" icon="pi pi-arrow-right" @click="goTo('/admin/reservas')" />
          </div>
        </template>
      </Card>

      <Card class="home-card card-like">
        <template #title>
          <div class="card-title">
            <Avatar class="card-avatar" label="D" shape="circle" size="large"
              style="background: linear-gradient(135deg,#06b6d4,#0ea5a0)" />
            <div class="card-meta">
              <h3>Disciplinas</h3>
              <p>Gestiona disciplinas, horarios y estadísticas por deporte.</p>
            </div>
          </div>
        </template>

        <div class="card-body">
          <p>Crear/editar disciplinas, asignar instalaciones y revisar disponibilidad.</p>
        </div>

        <template #footer>
          <div class="card-footer">
            <Button label="Ir a Disciplinas" icon="pi pi-arrow-right" @click="goTo('/admin/disciplinas')" />
          </div>
        </template>
      </Card>

      <Card class="home-card card-like">
        <template #title>
          <div class="card-title">
            <Avatar class="card-avatar" label="CU" shape="circle" size="large" />
            <div class="card-meta">
              <h3>Crear usuarios</h3>
              <p>Formulario para crear todo tipo de usuarios.</p>
            </div>
          </div>
        </template>

        <div class="card-body">
          <p>Ver, editar, filtrar y confirmar reservas. Accede a los detalles por usuario o cancha.</p>
        </div>

        <template #footer>
          <div class="card-footer">
            <Button label="Ir a Reservas" icon="pi pi-arrow-right" @click="goTo('/admin/crear-usuarios')" />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';

const router = useRouter();
const userName = localStorage.getItem('username') || 'Administrador';

function goTo(path: string) {
  router.push(path);
}



</script>

<style scoped>
/* Root - usar paddings similares a admin-main */
.admin-home-root {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  /* ya el layout agrega padding vertical */
}

.text-black {
  color: black !important;
}

/* Card-like container para header y cards (coincidir con AdminLayout) */
.card-like {
  background: white !important;
  color: #0f172a !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06) !important;
  border: 1px solid rgba(2, 6, 23, 0.04) !important;
}

/* Header */
.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
}

.subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.95rem;
}

/* Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

/* Card specifics */
.home-card {
  padding: 1rem !important;
  min-height: 170px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

/* Title area */
.card-title {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.card-avatar {
  width: 56px;
  height: 56px;
  font-weight: 700;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06);
  border: none !important;
}

.card-meta h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #0f172a;
}

.card-meta p {
  margin: 0.15rem 0 0;
  color: #64748b;
  font-size: 0.9rem;
}

.card-body {
  margin-top: 0.75rem;
  color: #475569;
}

/* Footer buttons */
.card-footer {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  align-items: center;
}

/* Forzar colores de botones si tema oscuro aplica estilos globales */
.home-card .p-button,
.card-like .p-button {
  background-color: #10b981 !important;
  /* verde similar al que usas */
  border-color: transparent !important;
  color: white !important;
  box-shadow: none !important;
}

.home-card .p-button.p-button-text {
  background: transparent !important;
  color: #0f172a !important;
}

/* make sure Card header/title areas inherit dark->light override */
.home-card .p-card-title,
.home-card .p-card-subtitle,
.home-card .p-card-content {
  color: inherit !important;
}

/* Responsive */
@media (max-width: 900px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }

  .admin-home-root {
    padding: 0 0.75rem;
  }
}
</style>
