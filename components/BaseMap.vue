<template>
  <div class="block">
    <svg
      ref="svg"
      class="pan-zoom"
      :zoom-transform="zoomTransform"
      :viewBox="viewBoxString"
    >
      <!-- Inner Content -->
      <svg 
        style="overflow: hidden;"
        width="100%"
        height="100%"
        class="pan-content"
      >

        <g v-bind="transformProp">
          <path
            fill="#808080"
            stroke="white"
            stroke-width="0.5"
            :d="d()"
          />
          <rect 
            v-for="(item, index) in coords"
            :key="index"
            :x="item[0]"
            :y="item[1]"
            width="3.4"
            height="3.4"
            :fill="colorA[index]"
          />
        </g>
      </svg>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { event, zoom, zoomIdentity } from 'd3'
import * as topojson from 'topojson-client'
import dataset from '@/assets/geo/ind_topo_simp_quant.json'
import lonlats from '@/assets/geo/lonlats_pd.json'
import frp from '@/assets/frp.json'

// const land = topojson.feature(dataset, dataset.objects.IDN_adm1_lon_lat)
const land = topojson.feature(dataset, dataset.objects.ind_geojson)
export default {
  components: {},
  props: {
    zoomTransform: {
      type: Object,
      default() {
        return {
          k: 1,
          x: 0,
          y: 0
        }
      }
    }
  },

  data() {
    return {
      colorA: [],
      colorScale: null,
      coords: [],
      land: null,
      frp: [],
      dimensions: {
        width: 610,
        height: 225
        // viewBox: '0 0 700 700'
      },
      probsp: [],
      probs: [],
      transformProp: null,
      selection: null,
      zooming: false,
      watcher: null,

      mapwidth: 610,
      mapheight: 225,
      translator: null,
      scaler: null,
      transform: {
        k: 1,
        x: 0,
        y: 0
      },
      d: null,
      projection: d3
        .geoEquirectangular()
        .scale(1)
        .translate([0, 0])
    }
  },

  computed: {
    getColorC: function() {
      return this.colorScale(Math.random())
    },

    zoom() {
      return zoom().scaleExtent([1, 3])
    },

    viewBoxString() {
      return `0 0 ${this.mapwidth} ${this.mapheight}`
    },
    realProjection() {
      return d3
        .geoEquirectangular()
        .translate(this.translator)
        .scale(this.scaler)
        .precision(0.001)
    }
  },

  created() {
    this.frp = this.divideArray(frp.frp)
    this.path = d3.geoPath().projection(this.projection)
    this.d = () => this.path(land)
  },

  mounted() {
    this.colorScale = d3.scaleSequential(d3.interpolateInferno).domain([0, 500])
    this.colorA = this.getColorA(this.frp)
    this.land = land
    d3.csv('test_probs_int.csv', d => {
      return d.Maxent
    }).then(data => {
      this.probs = data
    })

    window.addEventListener('resize', this.updateDimensions)
    this.updateDimensions()

    // determine scale and translatio
    const b = this.path.bounds(land)
    this.scaler =
      0.99 /
      Math.max(
        (b[1][0] - b[0][0]) / this.mapwidth,
        (b[1][1] - b[0][1]) / this.mapheight
      )
    this.translator = [
      (this.mapwidth - this.scaler * (b[1][0] + b[0][0])) / 2,
      (this.mapheight - this.scaler * (b[1][1] + b[0][1])) / 2
    ]
    this.projection = this.realProjection

    this.coords = this.reproject(lonlats)
    // this.coords = this.coords.slice(1,10)
    this.path = d3.geoPath().projection(this.projection)
    this.d = () => this.path(land)

    this.selection = d3.select(this.$el)
    this.zoom.on('zoom', this.onZoom)
    this.zoom.on('start', () => {
      if (this.watcher) this.watcher()
      this.zooming = true
    })
    this.zoom.on('end', () => {
      this.zooming = false
      this.watcher = this.$watch(
        () => {
          return {
            w: this.dimensions.width,
            h: this.dimensions.height,
            k: this.zoomTransform.k,
            x: this.zoomTransform.x,
            y: this.zoomTransform.y
          }
        },
        () => {
          if (this.selection)
            this.zoom.transform(this.selection, this.zoomTransform)
        }
      )
    })
    this.zoom(this.selection)
  },
  Updated() {
    this.onZoom()
  },

  beforeDestroy() {
    if (this.watcher) this.watcher()
    this.zoom.on('zoom', null)
    window.removeEventListener('resize', this.updateDimensions)
  },

  activated() {
    window.addEventListener('resize', this.updateDimensions)
  },
  deactivated() {
    window.removeEventListener('resize', this.updateDimensions)
  },

  methods: {
    getColorA(dataVals) {
      const colorA = []
      for (let i = 0; i < dataVals.length; i++) {
        colorA[i] = this.colorScale(dataVals[i])
      }
      return colorA
    },

    getColor(value) {
      return this.colorScale(value)
    },
    reproject(coords) {
      const coordsNew = []
      for (let i = 0; i < coords.length; i++) {
        coordsNew[i] = this.projection(coords[i])
      }
      return coordsNew
    },

    divideArray(dataArray) {
      const array2 = []
      for (let i = 0, length = dataArray.length; i < length; i++) {
        array2[i] = dataArray[i] / 100
      }
      return array2
    },

    updateDimensions() {
      this.$nextTick(() => {
        const bounds = (this.$refs.svg || this.$el).getBoundingClientRect()
        this.dimensions.width = bounds.width
        this.dimensions.height = bounds.height
      })
    },

    onZoom() {
      /** @type {D3ZoomEvent} */
      const e = event
      const tx = Math.min(
        0,
        Math.max(e.transform.x, this.mapwidth - this.mapwidth * e.transform.k)
      )
      const ty = Math.min(
        0,
        Math.max(e.transform.y, this.mapheight - this.mapheight * e.transform.k)
      )
      e.transform.x = tx
      e.transform.y = ty
      this.transformProp = {
        transform: e.transform.toString()
      }

      this.$emit('update:zoomTransform', e.transform)
    },
    reset() {
      this.$emit('zoomTransform', zoomIdentity)
    }
  }
}
</script>

<style scoped lang="scss">
.pan-zoom {
  overflow: visible;
  position: relative;
}

.pan-content {
  clip-path: rect(0 0 0 0px);
}

div.block {
  border: 1px solid #404040;
}
</style>
