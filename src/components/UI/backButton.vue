<template>
  <div>
    <Button raised @click="back" label="Regresar" icon="pi pi-chevron-left" />
  </div>
</template>

<script setup lang="ts">
import { Button } from 'primevue';
import { useRouter } from 'vue-router';

const router = useRouter();

function back() {
  router.push({
    name: 'home'
  })
}
</script>

<style scoped></style>
