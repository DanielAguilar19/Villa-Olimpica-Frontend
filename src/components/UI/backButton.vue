<template>
  <div>
    <Button @click="back">Atras</Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from 'primevue';
import { useRouter } from 'vue-router';

const router = useRouter();

function back() {
  localStorage.removeItem('usuario')
  router.push({ name: 'login' });
}
</script>

<style scoped></style>
