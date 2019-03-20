<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Prediction of fire activity for the year 2015 in Indonesia
      </h1>
    </div>

    <section class="section">
      <div class="container has-text-centered is-size-3">
        <div class="content is-medium">
          Monthly fire occurrence probability on a 0.25 degree grid predicted by a range of different algorithms used in the <strong>ToFEWSI</strong> modelling analyses. Predictions are based on mean monthly fire weather index, drought index, fine fuel moisture content and forest cover change datasets. Select month and different models to compare.
        </div>
      </div>
    </section>
    <div class="container">
      <div class="columns">
        <div class="column">
          <h1>Compare data for month:</h1>
          <select-option :options="monthOptions" 
                         :selected="selectedMonth"
                         @updateOption="selectedMonth = $event"
           ></select-option>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <h1>Select model</h1>
          <select-option :options="modelOptions.map(a => a.text)" 
                         :selected="selectedModelLeft" 
                         @updateOption="selectedModelLeft = $event"
                         ></select-option>
          <base-m :zoom-transform.sync="zoomTransform" :datas="getLeft" />
        </div>
        <div class="column">
          <h1>Select model</h1>
          <select-option :options="modelOptions.map(a => a.text)" 
                         :selected="selectedModelRight"
                         @updateOption="selectedModelRight = $event"
                         ></select-option>
          <base-m :zoom-transform.sync="zoomTransform" :datas="getRight" />
        </div>
      </div>
    </div>
    </div>
  </section>
</template>

<script>
import BaseMap from '@/components/BaseMap.vue'
import BaseM from '@/components/BaseM.vue'
import selectOption from '@/components/selectOption.vue'
import Probs from '@/assets/probdata.json'
import lonLats from '@/assets/geo/lonlats_pdtest.json'

export default {
  components: {
    selectOption: selectOption,
    BaseMap: BaseMap,
    BaseM: BaseM
  },
  data() {
    return {
        probs: {},
        selectedMonth: 'August',
        selectedModelLeft: 'SVC rbf',
        selectedModelRight: 'Mean FRP',
        monthOptions: [
            'January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August', 'September',
            'October', 'November', 'December'
        ],
        modelOptions: [
            {text: 'Neural Networks', value: 'NN', threshold: '50'},
            {text: 'Maxent', value: 'Maxent', threshold: '50'},
            {text: 'SVC rbf', value: 'SVC', threshold: '1'},
            {text: 'Mean FRP', value: 'frp', threshold: '1'},
        ],
      dataValuesLeft: [],
      dataValuesRight: [],
      lonLats: [],
      zoomTransform: {
        k: 1,
        x: 0,
        y: 0
      }
    }
  },
  created() {
    this.probs = Probs
    this.lonLats = lonLats
  },

  computed: {

      getLeft: function() {
        var model = this.modelOptions.find(x => x.text === this.selectedModelLeft)
        var datas = Probs[this.selectedMonth][model.value]
        var result = datas.map((s, i) => [s, this.lonLats[i]]) //combine values
          .filter(s => s[0] > model.threshold) //
        return result
      },

      getRight: function() {
        var model = this.modelOptions.find(x => x.text === this.selectedModelRight)
        var datas = Probs[this.selectedMonth][model.value]
        var result = datas.map((s, i) => [s, this.lonLats[i]]) //combine values
          .filter(s => s[0] > model.threshold) //
        return result
      }

  },

  methods: {

      updateMonth(value) {
          this.selectedMonth = value
      }
  }
}
</script>

<style>
</style>
