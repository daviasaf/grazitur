<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (import.meta.client) {
    setInterval(() => {
      $fetch('/api/ping').catch(() => {})
    }, 40 * 1000) 
}})
</script>