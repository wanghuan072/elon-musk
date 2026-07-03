<template>
  <div class="main">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { loadPopunder } from './utils/adLoader.js'

onMounted(() => {
  loadPopunder()
})
</script>
