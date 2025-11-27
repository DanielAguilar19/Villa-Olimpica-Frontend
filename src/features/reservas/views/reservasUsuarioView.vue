<template>
  <div class="page-container">
    <!-- Top banner: título + filtros -->
    <div class="top-banner md-elevation-2">
      <div class="banner-left">
        <backButton />
        <div class="banner-info">
          <div class="title">Reservas de <span class="username">{{ userNameDisplay }}</span></div>
          <div class="subtitle" v-if="instalacionSeleccionada">Instalación: <strong>{{ instalacionSeleccionada
          }}</strong></div>
        </div>
      </div>

      <div class="banner-right">
        <div class="controls-row">
          <div class="search-wrap">
            <i class="pi pi-search search-icon" aria-hidden="true"></i>
            <input v-model="search" type="search" placeholder="Buscar usuario, instalación o disciplina..."
              class="search-input" />
          </div>

          <select v-model="filtroEstado" class="select-filter">
            <option value="">Todos los estados</option>
            <option value="ACTIVA">Activa</option>
            ¿ <option value="completada">Completada</option>
            <option value="CANCELADA">Cancelada</option>
          </select>

          <Dropdown v-model="filtroInstalacion" :options="instalacionesOptions" optionLabel="label" optionValue="value"
            placeholder="Instalación" class="p-dropdown-compact" />
        </div>

        <div class="range-buttons">
          <Button label="Todas" :class="['pill-btn', { active: filtroRango === 'all' }]" @click="setRango('all')" />
          <Button label="Futuras" :class="['pill-btn', { active: filtroRango === 'future' }]"
            @click="setRango('future')" />
          <Button label="Pasadas" :class="['pill-btn', { active: filtroRango === 'past' }]" @click="setRango('past')" />
        </div>
      </div>
    </div>

    <!-- content -->
    <div class="content-grid">
      <div v-if="loading" class="loading">
        <div class="spinner" role="status" aria-hidden="true"></div>
        <div class="loading-text">Cargando reservas...</div>
      </div>

      <div v-if="!loading && filtered.length === 0" class="empty">
        <i class="pi pi-calendar-times empty-icon"></i>
        <div class="empty-title">No hay reservas</div>
        <div class="empty-sub">Ajusta filtros o crea reservas nuevas.</div>
      </div>

      <transition-group name="list" tag="div" class="cards-grid" v-else>
        <ReservaCard v-for="r in filtered" :key="r.id" :reserva="r" @cancel="cambiarEstado(r, r.estado)"
          class="card-item" />
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
/* tu script original (sin cambios) */
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ReservaCard from '@/features/reservas/components/cardComponent.vue';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import type { obtenerReservas } from '@/interfaces/reserva/reserva';
import { reservasApi, cambiarEstadoReserva } from '@/api/reserva/reservaApi'; // <-- asegúrate que exportes cambiarEstadoReserva
import backButton from '@/components/UI/backButton.vue';
import { LanzarAlerta } from '@/utils/alertas';

// route + router
const route = useRoute();
const router = useRouter();
const usuarioId = Number(route.params.usuarioId ?? 0);

// state
const items = ref<obtenerReservas[]>([]);
const userName = ref<string | null>(localStorage.getItem('username'));
const loading = ref(false);
const filtroEstado = ref<string | null>(null); // ahora usado en filtrado
const filtroRango = ref<'all' | 'past' | 'future'>('all');
const search = ref('');
const filtroInstalacion = ref<string | null>(null);

// per-item pending set (para botones spinner/disable)
const pendingIds = ref<Record<number, boolean>>({});

// util alerta segura
function lanzarAlertaSafe(message: string, tipo: 'success' | 'error' | 'info' = 'info') {
  try {
    if (typeof LanzarAlerta === 'function') { LanzarAlerta(message, tipo); return; }
  } catch (e) { console.log('LanzarAlerta no disponible', e); }
  // fallback
  alert(message);
}

// load
const load = async () => {
  loading.value = true;
  try {
    const data = await reservasApi.getAllByUsuario(usuarioId);
    // aseguramos fechas en ISO y estructura
    items.value = data.map(d => ({ ...d, inicioTs: d.inicioTs, finTs: d.finTs }));
  } catch (err) {
    console.error('error cargando reservas', err);
    lanzarAlertaSafe('Error cargando reservas', 'error');
    items.value = [];
  } finally {
    loading.value = false;
  }
};
onMounted(load);

// instalaciones options (nombres únicos)
const instalacionesOptions = computed(() => {
  const set = new Set<string>();
  items.value.forEach(r => set.add(r.instalacionNombre ?? `ID ${r.instalacionId}`));
  return [{ label: 'Todas', value: null }, ...Array.from(set).map(v => ({ label: v, value: v }))];
});

const instalacionSeleccionada = computed(() => filtroInstalacion.value);

// filtered
const filtered = computed(() => {
  const now = new Date();
  return items.value
    .filter(r => {
      // estado filter (si se selecciona)
      if (filtroEstado.value && r.estado !== filtroEstado.value) return false;

      // instalacion filter
      if (filtroInstalacion.value) {
        const name = r.instalacionNombre ?? `ID ${r.instalacionId}`;
        if (name !== filtroInstalacion.value) return false;
      }

      // rango (future / past)
      if (filtroRango.value === 'future' && new Date(r.inicioTs) <= now) return false;
      if (filtroRango.value === 'past' && new Date(r.finTs) >= now) return false;

      // search (si existe)
      if (search.value) {
        const q = search.value.toLowerCase();
        const inInst = (r.instalacionNombre ?? '').toLowerCase().includes(q);
        const inUser = (r.usuarioNombre ?? '').toLowerCase().includes(q);
        return inInst || inUser;
      }

      return true;
    })
    .sort((a, b) => new Date(b.inicioTs).getTime() - new Date(a.inicioTs).getTime());
});

// handlers
function setRango(v: 'all' | 'past' | 'future') { filtroRango.value = v; }

// función para cambiar estado genérico (útil para confirmar u otros cambios)
async function cambiarEstado(reserva: obtenerReservas, nuevoEstado: string) {
  const id = Number(reserva.id);
  if (nuevoEstado === "ACTIVO") {
    nuevoEstado = "CANCELADA"
  } else {
    nuevoEstado = "ACTIVA"
  }
  if (!confirm(`¿Cambiar estado de la reserva #${id} a "${nuevoEstado}"?`)) return;
  pendingIds.value[id] = true;
  try {
    await cambiarEstadoReserva(id, nuevoEstado);
    const idx = items.value.findIndex(r => Number(r.id) === id);
    if (idx !== -1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (items.value[idx] as any).estado = nuevoEstado;
      lanzarAlertaSafe(`Estado actualizado a ${nuevoEstado}`, 'success');
    } else {
      await load();
    }
  } catch (err) {
    console.error('Error cambiando estado', err);
    lanzarAlertaSafe('Error actualizando estado', 'error');
  } finally {
    delete pendingIds.value[id];
  }
}

// header display
const userNameDisplay = computed(() => userName.value ?? 'Usuario');
</script>

<style scoped>
/* VARS fallback (si no están definidas en global) */
:root {
  --bg-card: rgba(18, 20, 28, 0.66);
  --panel-border: rgba(255, 255, 255, 0.06);
  --text-main: #e6eefc;
  --muted: rgba(255, 255, 255, 0.62);
  --accent: #a8a4ac;
  --glass: rgba(255, 255, 255, 0.02);
}

/* Layout */
.page-container {
  max-width: 1200px;
  margin: 1.6rem auto;
  padding: 0 1rem;
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
}

/* Top banner */
.top-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(250, 250, 250, 0.94));
  border: 1px solid rgba(17, 24, 39, 0.06);
  margin-bottom: 18px;
  color: #0b1220;
  /* texto oscuro para contraste */
  align-items: flex-start;
  box-shadow: 0 8px 30px rgba(2, 6, 23, 0.06);
}

/* left group (logo + título) */
.banner-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* título principal: oscuro y claro */
.banner-info .title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0b1220;
  /* heading oscuro */
}

/* username: acento púrpura suave para contraste */
.banner-info .username {
  color: #7c3aed;
  /* purple-600 */
  font-weight: 700;
  margin-left: 6px;
}

/* subtítulo: gris oscuro */
.banner-info .subtitle {
  color: #475569;
  font-size: 0.9rem;
  margin-top: 6px;
}

/* right area: usar fondo transparente sobre el blanco para inputs */
.banner-right {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
  width: 100%;
  max-width: 720px;
}

/* controls row: horizontal alignment */
.controls-row {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
}

/* search input: claro, borde suave y foco púrpura */
.search-input {
  width: 100%;
  padding: 10px 12px 10px 38px;
  border-radius: 10px;
  background: #ffffff;
  color: #0b1220;
  border: 1px solid rgba(17, 24, 39, 0.08);
  transition: box-shadow .12s ease, transform .08s ease;
  font-size: 0.95rem;
  box-shadow: 0 4px 14px rgba(17, 24, 39, 0.04);
}

.search-input::placeholder {
  color: #94a3b8;
  /* placeholder gris azulado */
}

.search-input:focus {
  outline: none;
  box-shadow: 0 8px 28px rgba(124, 58, 237, 0.12);
  /* púrpura suave */
  transform: translateY(-1px);
  border-color: rgba(124, 58, 237, 0.28);
}

/* select filter: limpio sobre fondo claro */
.select-filter {
  background: #fff;
  color: #0b1220;
  border-radius: 10px;
  padding: 9px 12px;
  border: 1px solid rgba(17, 24, 39, 0.08);
  font-size: 0.92rem;
  box-shadow: 0 4px 12px rgba(2, 6, 23, 0.03);
}

/* dropdown compact label color */
.p-dropdown-compact .p-dropdown-label {
  color: #0b1220 !important;
}

/* pill buttons (range) - estilo claro por defecto, púrpura activo */
.range-buttons {
  display: flex;
  gap: 8px;
  margin-top: 2px;
}

.pill-btn {
  border-radius: 999px !important;
  padding: 8px 12px !important;
  background: transparent !important;
  color: #475569 !important;
  border: 1px solid rgba(17, 24, 39, 0.06) !important;
  font-weight: 600 !important;
  font-size: 0.88rem !important;
  transition: all .12s ease;
  box-shadow: 0 2px 8px rgba(2, 6, 23, 0.03);
}

/* estado activo: púrpura con texto blanco e ícono oscuro */
.pill-btn.active {
  background: linear-gradient(180deg, rgba(124, 58, 237, 0.14), rgba(99, 102, 241, 0.06)) !important;
  color: #ffffff !important;
  border-color: rgba(124, 58, 237, 0.18) !important;
  box-shadow: 0 10px 28px rgba(124, 58, 237, 0.08) !important;
}

/* outline variant when using p-button-outlined (mantener contrast) */
.p-button-outlined {
  border-color: rgba(17, 24, 39, 0.08) !important;
  color: #0b1220 !important;
  background: transparent !important;
}

/* icon color inside inputs */
.search-icon {
  color: #94a3b8;
}

/* responsive: colocar controls en columna en pantallas pequeñas */
@media (max-width: 860px) {
  .banner-right {
    align-items: stretch;
  }

  .controls-row {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .range-buttons {
    justify-self: start;
  }
}

/* responsive: colocar controls en columna en pantallas pequeñas */
@media (max-width: 860px) {
  .banner-right {
    align-items: stretch;
  }

  .controls-row {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .range-buttons {
    justify-self: start;
  }
}

/* grid of cards */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

/* cards animation */
.list-enter-active,
.list-leave-active {
  transition: all .18s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.list-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* smaller card item wrapper (so margins inside transition-group) */
.card-item {
  display: block;
}

/* elevation util */
.md-elevation-2 {
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.24);
}

/* accessibility focus */
:focus {
  outline: 3px solid rgba(168, 85, 247, 0.12);
  outline-offset: 2px;
  border-radius: 8px;
}

/* responsive */
@media (max-width: 860px) {
  .banner-right {
    align-items: stretch;
  }

  .controls-row {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .range-buttons {
    justify-self: start;
  }
}

@media (max-width: 480px) {
  .top-banner {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .banner-left {
    gap: 8px;
  }

  .search-input {
    font-size: 0.92rem;
  }
}
</style>
