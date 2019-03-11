<template>
  <g>
    <rect
      v-for="(item, index) in coords.longitude"
      :key="index"
      r="100"
      :cx="reproject(item, coords.latitude[index])[0]"
      :cy="reproject(item, coords.latitude[index])[1]"
      projection="projection"
      fill="#050505"
      @click="onClick(item)"
    />
  </g>
</template>

<script>
import lonlats from '@/static/topolonlats.json'
import frp from '@/static/frp.json'
export default {
  props: {
    projection: {
      type: Function,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      lons: [],
      lats: [],
      coords: []
    }
  },

  created() {
    this.coords = lonlats
    console.log('created', this.coords)
    this.frp = this.divideArray(frp.frp)
  },
  mounted() {},

  methods: {
    reproject(lon, lat) {
      return this.projection([lon, lat])
    },

    onClick(item) {
      console.log('this is the item!', item)
    },

    divideArray(dataArray) {
      const array2 = []
      for (let i = 0, length = dataArray.length; i < length; i++) {
        array2[i] = dataArray[i] / 100
      }
      return array2
    }
  }
}
</script>
