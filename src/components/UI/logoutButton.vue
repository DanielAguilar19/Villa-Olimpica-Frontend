<template>
  <div>
    <Button @click="logout" class="logout-btn">
      <i class="pi pi-sign-out"></i>
      Salir 
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from 'primevue';
import { useRouter } from 'vue-router';

const router = useRouter();

function logout() {
  router.push({ name: 'login' });
}
</script>

<style scoped>
.logout-btn {
  background-color: #ee6868 !important;
  border-color: #ee6868 !important;
  color: white !important;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: #F87171 !important;
  border-color: #F87171 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
}

.logout-btn i {
  font-size: 1.25rem;
}
</style>
