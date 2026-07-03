<template>
  <aside class="container" style="display: flex; justify-content: center; align-items: center">
    <div ref="adContainer"></div>
  </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { loadNativeBanner, loadBannerAd, cleanupNativeBanner } from '../../utils/adLoader.js'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['native', 'banner'].includes(value),
  },
})

const adContainer = ref(null)

onMounted(async () => {
  await nextTick()
  if (!adContainer.value) return

  if (props.type === 'native') {
    loadNativeBanner(adContainer.value)
  } else {
    loadBannerAd(adContainer.value)
  }
})

onUnmounted(() => {
  if (props.type === 'native') {
    cleanupNativeBanner()
  }
  if (adContainer.value) {
    adContainer.value.innerHTML = ''
  }
})
</script>
