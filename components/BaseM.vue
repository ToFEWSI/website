<template>
    <div class="box"
    >
      <!-- Inner Content -->
      <svg 
        style="overflow: hidden;"
        width="100%"
        height="100%"
        class="pan-zoom"
        :zoom-transform="zoomTransform"
        :datas="datas"
        :viewBox="viewBoxString"
      >

        <g v-bind="transformProp">
          <path
            fill="colorBack"
            stroke="#505050"
            stroke-width="0.5"
            :d="d()"
          />
          <rect 
            v-for="(item, index) in coords"
            :key="index"
            :x="item[0][0]"
            :y="item[0][1]"
            width="3.4"
            height="3.4"
            :fill="item[1]"
          />
        </g>
      </svg>
    </div>
</template>

<script>
import * as d3 from 'd3'
import { event, zoom, zoomIdentity } from 'd3'
import * as topojson from 'topojson-client'
import dataset from '@/assets/geo/ind_topo_simp_quant.json'

// const land = topojson.feature(dataset, dataset.objects.IDN_adm1_lon_lat)
const land = topojson.feature(dataset, dataset.objects.ind_geojson)
export default {
  components: {},
  props: {
    zoomTransform: {
      type: Object,
        },
    datas: Array
  },

  data() {
    return {
      colorA: [],
      colorScale: null,
      coords: [],
      land: null,
      dimensions: {
        width: 610,
        height: 225
        // viewBox: '0 0 700 700'
      },
      transformProp: null,
      selection: null,
      zooming: false,
      watcher: null,

      mapwidth: 610,
      mapheight: 225,
      translator: null,
      scaler: null,
      transform: this.zoomTransform,
      d: null,
      projection: d3
        .geoEquirectangular()
        .scale(1)
        .translate([0, 0])
    }
  },

  created() {
    this.path = d3.geoPath().projection(this.projection)
    this.d = () => this.path(land)
  },

  watch: {
    datas(newVal) {
      this.colorA = this.getColorA
      this.coords = this.reproject
    }
  },

  mounted() {
    this.colorScale = d3
      .scaleSequential(d3.interpolateInferno)
      .domain([5, 9])
    this.colorA = this.getColorA
    this.land = land
    this.colorBack = this.colorScale(0)

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

    this.coords = this.reproject
    this.path = d3.geoPath().projection(this.projection)
    this.d = () => this.path(land)

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

  computed: {
    getColorA: function() {
      const colorA = []
      for (let i = 0; i < this.datas.length; i++) {
        colorA[i] = this.colorScale(this.datas[i][0])
      }
      return colorA
    },

    reproject: function() {
      console.log('reprojecting')
      var coordsNew = []
      for (let i = 0; i < this.datas.length; i++) {
        coordsNew[i] = []; // Initialize inner array
            coordsNew[i][0] = this.projection(this.datas[i][1])
            coordsNew[i][1] = this.colorScale(this.datas[i][0])
      }
      return coordsNew
    },

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

  methods: {

    updateDimensions() {
        const bounds = (this.$refs.svg || this.$el).getBoundingClientRect()
        this.dimensions.width = bounds.width
        this.dimensions.height = bounds.height
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
div.box {
  padding: 0px;
  margin: 0px;
  display: flex;
}
.pan-zoom {
  overflow: visible;
  position: relative;
}

.pan-content {
  clip-path: rect(0 0 0 0px);
}
</style>
