<template>
  <Card class="reserva-card">
    <!-- TITLE (tu header) -->
    <template #title>
      <div class="title-row">
        <div class="title-left">
          <div class="instalacion-name">
            {{ reserva?.instalacionNombre ?? ('ID ' + (reserva?.instalacionId ?? '-')) }}
          </div>
          <div class="subtitle">Reserva #{{ reserva?.id ?? '-' }}</div>
        </div>

        <div class="date-range">{{ formattedDateRange }}</div>
      </div>

      <div class="card-grid">
        <div class="field">
          <div class="label">Instalación</div>
          <div class="value">{{ reserva?.instalacionNombre ?? ('ID ' + (reserva?.instalacionId ?? '-')) }}</div>
        </div>

        <div class="field">
          <div class="label">Usuario</div>
          <div class="value">{{ reserva?.usuarioNombre ?? ('ID ' + (reserva?.usuarioId ?? '-')) }}</div>
        </div>

        <div class="field">
          <div class="label">Inicio</div>
          <div class="value">{{ formattedInicio }}</div>
        </div>

        <div class="field">
          <div class="label">Fin</div>
          <div class="value">{{ formattedFin }}</div>
        </div>

        <div class="field">
          <div class="label">Estado</div>
          <div class="value">
            <Badge :value="reserva?.estado ?? '-'" :severity="estadoSeverity" />
          </div>
        </div>
      </div>
    </template>

    <!-- DEFAULT SLOT (contenido del card): aseguramos que se muestre -->


    <!-- FOOTER SLOT -->
    <template #footer>
      <div class="card-footer">
        <Button label="Ver detalle" icon="pi pi-eye" class="my-btn primary" @click="onVer" />
        <Button v-if="canCancel" label="Cancelar" icon="pi pi-times" class="my-btn danger" @click="onCancel" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
/* -- mantén tu script tal cual -- */
import { computed } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import type { obtenerReservas } from '@/interfaces/reserva/reserva';

const props = defineProps<{ reserva: obtenerReservas | null | undefined; showActions?: boolean }>();
const emit = defineEmits<{ (e: 'ver', reserva: obtenerReservas): void; (e: 'cancel', reserva: obtenerReservas): void }>();

const reserva = props.reserva ?? null;

const fmt = (iso?: string | null) => {
  if (!iso) return '-';
  try { return new Date(iso).toLocaleString(); } catch { return String(iso); }
};

const formattedInicio = computed(() => fmt(reserva?.inicioTs));
const formattedFin = computed(() => fmt(reserva?.finTs));

const formattedDateRange = computed(() => {
  const a = reserva?.inicioTs; const b = reserva?.finTs;
  if (!a || !b) return '-';
  try {
    const d1 = new Date(a); const d2 = new Date(b);
    return `${d1.toLocaleDateString()} • ${d1.toLocaleTimeString()} → ${d2.toLocaleTimeString()}`;
  } catch { return '-'; }
});

const estadoSeverity = computed(() => {
  const s = String(reserva?.estado ?? '').toLowerCase();
  if (s.includes('cancel')) return 'danger';
  if (s.includes('act') || s.includes('confirm')) return 'success';
  if (s.includes('pend')) return 'info';
  return 'warning';
});

const canCancel = computed(() => {
  if (!reserva) return false;
  try {
    const fin = new Date(reserva.finTs);
    return fin.getTime() > Date.now() && (props.showActions ?? true);
  } catch { return false; }
});

function onVer() { if (reserva) emit('ver', reserva); }
function onCancel() { if (reserva) emit('cancel', reserva); }
</script>

<style scoped>
/* ---------- aseguramos que el contenido del p-card se muestre correctamente ---------- */

/* estilo base del card (tu paleta) */
.reserva-card {
  background: rgba(18, 20, 28, 0.66) !important;
  color: #f8f9fb !important;
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
  border-radius: 12px !important;
  padding: 0 !important;
  /* dejamos que primevue maneje padding en p-card-content */
  overflow: visible !important;
}

/* Forzamos que la estructura interna de PrimeVue p-card no oculte nada */
:deep(.p-card) {
  background: transparent !important;
  box-shadow: none !important;
  overflow: visible !important;
}

/* IMPORTANT: asegurar que el contenido por defecto (slot) de p-card sea visible */
:deep(.p-card .p-card-content) {
  display: block !important;
  padding: 14px !important;
  /* espacio interior para el contenido */
  color: inherit !important;
  overflow: visible !important;
  height: auto !important;
  /* quitar cualquier height:0 heredado */
  min-height: 1px !important;
}

/* title area (primevue coloca el title fuera del p-card-content, por eso lo ves bien) */
.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

/* el contenido que sigue al title debe verse */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding: 12px 16px 0 16px;
  /* espacio en p-card-content ya incluido */
}

/* etiquetas/valores */
.field .label {
  font-size: 0.72rem;
  color: rgba(248, 249, 251, 0.6);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.field .value {
  color: #f8f9fb;
  font-weight: 700;
  font-size: 0.94rem;
}

/* footer forcing */
:deep(.p-card .p-card-footer) {
  display: block !important;
  padding: 12px 16px 16px 16px !important;
  border-top: 1px solid rgba(255, 255, 255, 0.03) !important;
  background: transparent !important;
}

/* tu footer local */
.card-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
}

/* botones */
.my-btn {
  border-radius: 999px;
  padding: .45rem .9rem;
  font-weight: 700;
}

/* Si alguna regla global setea visibility:hidden o opacity:0 lo quitamos */
:deep(.p-card *[style*="visibility:hidden"]) {
  visibility: visible !important;
}

:deep(.p-card *[style*="opacity:0"]) {
  opacity: 1 !important;
}

/* Responsive */
@media (min-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
