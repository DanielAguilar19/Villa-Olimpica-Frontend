<template>
  <div class="page-container">
    <!-- Top banner estilo Material -->
    <div class="top-banner md-elevation-2">
      <backButton />
      <div class="banner-info">
        <div class="title">Reservas de <span class="username">{{ userNameDisplay }}</span></div>
        <div class="subtitle" v-if="instalacionSeleccionada">Instalación: <strong>{{ instalacionSeleccionada }}</strong>
        </div>
      </div>

      <div class="banner-actions">
        <Dropdown v-model="filtroInstalacion" :options="instalacionesOptions" optionLabel="label" optionValue="value"
          placeholder="Instalación" />
        <div class="range-buttons">
          <Button label="Todas" :class="{ 'p-button-outlined': filtroRango !== 'all' }" @click="setRango('all')" />
          <Button label="Futuras" :class="{ 'p-button-outlined': filtroRango !== 'future' }"
            @click="setRango('future')" />
          <Button label="Pasadas" :class="{ 'p-button-outlined': filtroRango !== 'past' }" @click="setRango('past')" />
        </div>
      </div>
    </div>

    <!-- content -->
    <div class="content-grid">
      <div v-if="loading" class="loading">
        <progress class="w-full"></progress>
      </div>

      <div v-if="!loading && filtered.length === 0" class="empty">
        No hay reservas que coincidan.
      </div>

      <div v-else class="cards-grid">
        <ReservaCard v-for="r in filtered" :key="r.id" :reserva="r" @ver="onVer" @cancel="onCancel" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ReservaCard from '@/features/reservas/components/cardComponent.vue';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import type { obtenerReservas } from '@/interfaces/reserva/reserva';
import { reservasApi } from '@/api/reserva/reservaApi';
import backButton from '@/components/UI/backButton.vue';

// route + router
const route = useRoute();
const router = useRouter();
const usuarioId = Number(route.params.usuarioId ?? 0);

// state
const items = ref<obtenerReservas[]>([]);
const userName = ref<string | null>(localStorage.getItem('username'));
const loading = ref(false);
const filtroEstado = ref<string | null>(null);
const filtroRango = ref<'all' | 'past' | 'future'>('all');
const search = ref('');
const filtroInstalacion = ref<string | null>(null);



// load
const load = async () => {
  loading.value = true;
  try {
    const data = await reservasApi.getAllByUsuario(usuarioId);
    console.log('reservas para ')
    items.value = data.map(d => ({ ...d, inicioTs: d.inicioTs, finTs: d.finTs }));
  } catch (err) {
    console.error('error cargando reservas', err);
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
      if (filtroEstado.value && r.estado !== filtroEstado.value) return false;
      if (filtroInstalacion.value) {
        const name = r.instalacionNombre ?? `ID ${r.instalacionId}`;
        if (name !== filtroInstalacion.value) return false;
      }
      if (filtroRango.value === 'future' && new Date(r.inicioTs) <= now) return false;
      if (filtroRango.value === 'past' && new Date(r.finTs) >= now) return false;
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

function onVer(reserva: obtenerReservas) {
  // navegar a detalle (crea la ruta si hace falta)
  router.push({ name: 'ReservaDetalle', params: { id: String(reserva.id) } });
}

function onCancel(reserva: obtenerReservas) {
  if (!confirm(`¿Cancelar reserva ${reserva.id}?`)) return;
  // si tienes endpoint de cancelar, lo llamas y luego recargas:
  // await reservasApi.cancelarReserva(reserva.id); await load();
  console.log('cancelar', reserva.id);
}

// header display
const userNameDisplay = computed(() => userName.value ?? 'Usuario');
</script>

<style scoped>
:root {
  --primary-500: #0b5cff;
  --primary-700: #063a9a;
  --bg-panel: rgba(3, 37, 65, 0.6);
  --panel-border: rgba(11, 92, 255, 0.07);
  --text-main: #e6f0ff;
  --muted: #93a7c9;
  --accent: #7dd3fc;
}

/* Page container */
.page-container {
  max-width: 1200px;
  margin: 1.5rem auto;
  padding: 0 1rem;
  color: var(--text-main);
}

/* Top banner - material + glass */
.top-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(3, 37, 65, 0.6), rgba(3, 37, 65, 0.52));
  border: 1px solid var(--panel-border);
  margin-bottom: 18px;
  color: var(--text-main);
}

.banner-info .title {
  font-size: 1.18rem;
  font-weight: 700;
  color: var(--text-main);
}

.banner-info .username {
  color: var(--accent);
  font-weight: 600;
}

.banner-info .subtitle {
  color: var(--muted);
  font-size: 0.95rem;
  margin-top: 6px;
}

/* actions area */
.banner-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.banner-actions .p-dropdown,
.banner-actions .p-inputtext {
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-main);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.banner-actions .p-dropdown .p-dropdown-label,
.banner-actions .p-inputtext {
  color: var(--text-main);
}

/* buttons group */
.range-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* outline buttons styling */
.p-button-outlined {
  border-color: rgba(11, 92, 255, 0.16);
  color: var(--text-main);
}

/* content area */
.content-grid {
  margin-top: 12px;
}

.loading {
  padding: 36px 0;
}

.empty {
  text-align: center;
  color: var(--muted);
  padding: 24px 0;
}

/* cards grid: responsive tiles */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

/* small helpers & elevation */
.md-elevation-2 {
  box-shadow: 0 6px 20px rgba(2, 6, 23, 0.28);
}

/* interactive focus outlines for accessibility */
:focus {
  outline: 3px solid rgba(11, 92, 255, 0.14);
  outline-offset: 2px;
  border-radius: 6px;
}

/* mobile tweaks */
@media (max-width: 640px) {
  .banner-info .title {
    font-size: 1rem;
  }

  .banner-actions {
    gap: 8px;
  }

  .cards-grid {
    gap: 12px;
  }
}
</style>
