<template>
  <Card class="reserva-card">
    <template #title>
      <div class="title-row">
        <div class="title-left">
          <div class="instalacion-name">{{ reserva?.instalacionNombre ?? ('ID ' + (reserva?.instalacionId ?? '-')) }}
          </div>
          <div class="subtitle">Reserva #{{ reserva?.id ?? '-' }}</div>
        </div>

        <div class="date-range">{{ formattedDateRange }}</div>
      </div>
    </template>

    <!-- body / content -->
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
          <Badge :value="String(reserva?.estado ?? '-')" :severity="estadoSeverity" />
        </div>
      </div>
    </div>

    <!-- footer: botones siempre visibles en p-card-footer -->
    <template #footer>
      <div class="card-footer">
        <Button label="Ver detalle" icon="pi pi-eye" class="my-btn primary" @click="onVer" />
        <Button v-if="canCancel" label="Cancelar" icon="pi pi-times" class="my-btn danger" @click="onCancel" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
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
:root {
  --primary: #0b5cff;
  --bg-card: rgba(3, 37, 65, 0.72);
  --glass-border: rgba(11, 92, 255, 0.08);
  --text-main: #e6f0ff;
  --text-muted: rgba(230, 240, 255, 0.68);
  --danger: #ff6b6b;
}

/* Card */
.reserva-card {
  background: var(--bg-card);
  color: var(--text-main);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 12px;
  transition: transform .15s ease, box-shadow .15s ease;
}

.reserva-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.45);
}

/* Title */
.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.title-left {
  display: flex;
  flex-direction: column;
}

.instalacion-name {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--text-main);
}

.subtitle {
  font-size: .86rem;
  color: var(--text-muted);
}

.date-range {
  font-size: .9rem;
  color: var(--text-muted);
}

/* Grid content */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 8px;
}

@media(min-width:640px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.field .label {
  font-size: .75rem;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.field .value {
  color: var(--text-main);
  font-weight: 600;
}

/* Footer (botones) */
.card-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.02);
}

/* botón base visible: fondo suave + texto claro */
.my-btn {
  border-radius: 999px;
  padding: .45rem .9rem;
  font-weight: 600;
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-main) !important;
}

.my-btn:hover {
  color: black;
}

/* estilo primario */
.my-btn.primary {
  background: linear-gradient(180deg, rgba(11, 92, 255, 0.14), rgba(11, 92, 255, 0.08));
  border: 1px solid rgba(11, 92, 255, 0.18);
  color: var(--text-main) !important;
}

/* estilo danger */
.my-btn.danger {
  background: linear-gradient(180deg, rgba(255, 107, 107, 0.12), rgba(255, 107, 107, 0.06));
  border: 1px solid rgba(255, 107, 107, 0.14);
  color: white !important;
}

/* asegurar que iconos de PrimeIcons aparecen */
:deep(.pi) {
  color: inherit !important;
}

/* si alguna regla global mete `display:none` a p-button, forzamos display */
:deep(.p-button) {
  display: inline-flex !important;
  align-items: center !important;
}

/* accesibilidad focus */
.my-btn:focus {
  outline: 3px solid rgba(11, 92, 255, 0.16);
  outline-offset: 2px;
  border-radius: 999px;
}
</style>
