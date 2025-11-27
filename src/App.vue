<script setup lang="ts">
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
</script>
<template>
  <Router-view class="content" />
  <Toast />
  <ConfirmDialog />
</template>
<style scoped>
.content {
  margin: 0;
  height: 100%;
  width: 100%;
}
</style>
