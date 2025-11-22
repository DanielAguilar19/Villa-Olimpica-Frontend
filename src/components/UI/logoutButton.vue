<template>
  <div>
    <Button @click="logout">Cerrar Sesión </Button>
  </div>
</template>

<script setup lang="ts">

import { useRouter } from 'vue-router';

const router = useRouter();

function logout() {
  router.push({ name: 'login' });
}
</script>

<style scoped></style>
