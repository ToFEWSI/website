<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Hindcast prediction of fire activity in Indonesia
      </h1>
    </div>

    <section class="section">
      <div class="container has-text-centered is-size-3">
        <div class="content is-medium">
          Monthly fire occurrence probability on a 0.25 degree grid predicted by a range of different algorithms used in the <strong>ToFEWSI</strong> modelling analyses. Predictions are based on mean monthly fire weather index, drought index, fine fuel moisture content and forest cover change datasets. Select year, month and different models or input datasets to compare.
        </div>
      </div>
    </section>
    <div class="container">
          <h1>Select year and month:</h1>
        <div class="form-group">
          <select-option :options="yearOptions" 
                         :selected="selectedYear"
                         @updateOption="selectedYear = $event"
           ></select-option>
          <select-option :options="monthOptions" 
                         :selected="selectedMonth"
                         @updateOption="selectedMonth = $event"
           ></select-option>
    </div>
</div>
<div class="container">
      <div class="columns">
        <div class="column">
          <h1>Select model or data:</h1>
          <select-option :options="modelOptions.map(a => a.text)" 
                         :selected="selectedModelLeft" 
                         @updateOption="selectedModelLeft = $event"
                         ></select-option>
          <base-m :zoom-transform.sync="zoomTransform" :datas="getLeft" />
        </div>
        <div class="column">
          <h1>Select model or data:</h1>
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
import ProbsAll from '@/assets/probdata_all.json'
import lonLats from '@/assets/geo/lonlats_all.json'

export default {
  components: {
    selectOption: selectOption,
    BaseMap: BaseMap,
    BaseM: BaseM
  },
  data() {
    return {
        probs: {},
        ProbsAll: {},
        selectedYear: '2010',
        selectedMonth: 'August',
        selectedModelLeft: 'SVC rbf',
        selectedModelRight: 'FRP pixel count',
        yearOptions: ['2002', '2003', '2004', '2005', '2006', '2007',
                      '2008', '2009', '2010', '2011', '2012', '2013',
                       '2014', '2015', '2016', '2017', '2018'],

        monthOptions: [
            'January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August', 'September',
            'October', 'November', 'December'
        ],
        modelOptions: [
            {text: 'Neural Networks', value: 'NN', threshold: '1'},
            {text: 'Logistic', value: 'Logistic', threshold: '1'},
            {text: 'Maxent', value: 'Maxent', threshold: '1'},
            {text: 'SVC rbf', value: 'SVC', threshold: '1'},
            {text: 'FRP pixel count', value: 'frp', threshold: '1'},
            {text: 'Median FWI', value: 'fwi', threshold: '-0.1'},
            {text: 'Median FFMC', value: 'ffmc', threshold: '1'},
            {text: 'Median DC', value: 'dc', threshold: '1'},
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
    this.ProbsAll = ProbsAll
    this.lonLats = lonLats
  },

  computed: {

      getLeft: function() {
        var model = this.modelOptions.find(x => x.text === this.selectedModelLeft)

        var datas = ProbsAll[this.selectedYear][this.selectedMonth][model.value]
        var result = datas.map((s, i) => [s, this.lonLats[i]]) //combine values
        //  .filter(s => s[0] > model.threshold) //
        return result
      },

      getRight: function() {
        var model = this.modelOptions.find(x => x.text === this.selectedModelRight)
        var datas = ProbsAll[this.selectedYear][this.selectedMonth][model.value]
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
