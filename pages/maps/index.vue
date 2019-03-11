<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Fire Weather forecasts
      </h1>
      <p>Will be able to select month/dataset here to see the SEAS5 based fwi/dc/ffmc forecast.</p>
      <base-map />
    </div>
  </section>
</template>

<script>
import BaseMap from '@/components/BaseMap.vue'
export default {
  components: {
    BaseMap: BaseMap
  },

  data() {
    return {
      zoomTransform: {
        k: 1,
        x: 0,
        y: 0
      }
    }
  }
}
</script>
