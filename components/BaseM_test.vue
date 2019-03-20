<template>
    <div class="box"
         id="map"
         >
     <!-- Inner Content -->
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
      zoomable: false,
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
      .domain([1, 100])
    this.colorA = this.getColorA
    this.land = land

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

    
    console.log(this.dimensions.width)
    console.log(this.dimensions.height)
    const svg = d3.select('#map').append('svg')
          .attr('width', this.dimensions.width)
          .attr('height', this.dimensions.height)
           .style("background-color", "#909090")
           
    let g = null
    let zoom = null

    console.log(this.coords)
    //svg.append("g")
    //  .selectAll(".square")
    //  .data(this.coords)
     // .enter().append("rect")
      // .attr("class", "square")
    //  .attr("x", function(d) { return (d[1][0]); })
    //  .attr("y", function(d) { return (d[1][1]); })    
    //  .attr("width", 3.4)
    //  .attr("height", 5)
    //  .style("fill", "#101919")
    //  .style("stroke", "none");

    if (this.zoomable) {
      g = svg.append('g')
      zoom = d3.zoom().scaleExtent([0.9, 8]).on('zoom', this.zoomed(g))
      svg.call(zoom).on('wheel', () => d3.event.preventDefault())
      svg.call(zoom.transform, d3.zoomIdentity)
    }
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
      const coordsNew = []
      for (let i = 0; i < this.datas.length; i++) {
        coordsNew[i] = this.projection(this.datas[i][1])
      }
      return coordsNew
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
        const bounds = (this.$refs.map || this.$el).getBoundingClientRect()
        this.dimensions.width = bounds.width
        this.dimensions.height = bounds.width / (this.mapwidth / this.mapheight)
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
