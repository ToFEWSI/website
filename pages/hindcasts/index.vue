<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Hindcast prediction of fire activity in Indonesia
      </h1>
    </div>

  <section class="section">
      <div class="container is-size-3">
        <div class="content is-medium">
            <p>
            Monthly fire occurrence probability in Indonesia predicted by a range of machine learning methods. The probabilities are modeled at 25km spatial resolution and monthly time steps for 2002 - 2018 period. Fire activity is characterised by MODIS active fire detections. Any grid cell with more than 10 active fire detections withing a month is considered to contain a fire event.
            </p>

            <p>
            Select year, month and fire occurrence probability given by different models or, MODIS active fires detection count or median fire weather indices. 
            </p>
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
      <section class="section">
    <div class="container">
      <h2 class="title">
        The method
      </h2>
    </div>


      <section class="section">
      <div class="container is-size-3">
        <div class="content is-medium">
            <p>
            Supervised learning algorithms;<strong> logistic regression, Maxent, support vector machines and neural networks </strong> were trained to predict the probability of a grid cell having fire or not. Fire weather index, drought index and fine fuel moisture content features were calculated from ECMWF ERA5 reanalysis dataset using the Canadian fire weather index system. We have used monthly median, 0.75 quantiles and weekly running mean maximum values as features characterising fire weather conditions. Another important feature set was derived from the forest cover change dataset (Hansen et al., 2013, Science 342). These include fraction of primary and secondary forest loss in the grid cell and forest cover gain. We have also used mean grid cell elevation and fraction of peatlands in the modelling.

            </p>
        </div>
      </div>
      </section>
    </section>
  </section>
</template>

<script>
import BaseM from '@/components/BaseM.vue'
import selectOption from '@/components/selectOption.vue'
import ProbsAll from '@/assets/probdata_all.json'
import lonLats from '@/assets/geo/lonlats_all.json'

export default {
  components: {
    selectOption: selectOption,
    BaseM: BaseM
  },
  data() {
    return {
        probs: {},
        ProbsAll: {},
        selectedYear: '2015',
        selectedMonth: 'October',
        selectedModelLeft: 'Neural Networks',
        selectedModelRight: 'Active fires count',
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
            {text: 'Support Vector Machines', value: 'SVC', threshold: '1'},
            {text: 'Active fires count', value: 'frp', threshold: '1'},
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
          var result = datas.map((s, i) => [s, this.lonLats[i]]).filter(s => s[0] > 49) //combine values
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
