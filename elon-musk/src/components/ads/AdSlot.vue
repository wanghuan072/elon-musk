<template>
  <aside class="container" aria-label="Advertisement" :style="slotStyle">
    <div ref="adContainer"></div>
  </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { loadNativeBanner, loadBannerAd, getBannerSize } from '../../utils/adLoader.js'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['native', 'banner'].includes(value),
  },
})

const adContainer = ref(null)
const slotStyle = ref(
  'display: flex; justify-content: center; align-items: center; width: 100%; min-height: 90px;'
)

function updateSlotStyle() {
  if (props.type === 'native') {
    slotStyle.value =
      'display: flex; justify-content: center; align-items: center; width: 100%; min-height: 280px;'
    return
  }

  const { height } = getBannerSize()
  slotStyle.value = `display: flex; justify-content: center; align-items: center; width: 100%; min-height: ${height}px;`
}

onMounted(async () => {
  updateSlotStyle()
  await nextTick()

  if (!adContainer.value) return

  if (props.type === 'native') {
    loadNativeBanner(adContainer.value)
  } else {
    loadBannerAd(adContainer.value)
  }
})

onUnmounted(() => {
  if (adContainer.value) {
    adContainer.value.innerHTML = ''
  }
})
</script>
