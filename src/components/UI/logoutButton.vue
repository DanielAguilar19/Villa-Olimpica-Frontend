<template>
  <div>
    <Button id="backButton" variant="text" @click="logout" icon="pi pi-sign-out">Cerrar Sesión </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from 'primevue';
import { useRouter } from 'vue-router';

const router = useRouter();

function logout() {
  router.push({ name: 'login' });
  localStorage.removeItem('usuario')
}
</script>

<style scoped>
#backButton {
  width: auto;
}
</style>
