<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Indonesia maps
      </h1>
      <h2 class="subtitle">
        what not
      </h2>
      <div class="columns">
        <div class="column">
          <h1>Model predicted fire probability (select model, time)</h1>
          <base-map :zoom-transform.sync="zoomTransform" />
        <!-- Add content or other tiles -->
        </div>
        <div class="column">
          <h1>Observed fire for the same month</h1>
          <base-map :zoom-transform.sync="zoomTransform" />
        <!-- Add content or other tiles -->
        </div>
      </div>
    </div>
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
<style>
</style>
