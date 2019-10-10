<template>
  <section class="section">
    <br>
    <div class="container">
      <h2 class="title">
        Fire occurrence forecasts
      </h2>
    </div>
      <section class="section">
      <div class="container is-size-3">
        <div class="content is-medium">
      <p>Fire occurrence probabilities for the ongoing 2019 dry season in Indonesia produced by the ToFEWSI modelling system. The predictions are generated using Neural Network algorithm. The model is trained using ERA5 reanalysis weather, past forest cover change and map of peatland distribution in Indonesia. Forecast probabilities are computed using ECMWF SEAS5 model seasonal forecasts. Validation is performed against MODIS active fire observations. To find out more about the method see this <a href="https://drive.google.com/file/d/1OiLitt4IQf2cSLr6FV6UZH-rvEogaqRr/preview" target="_blank">EGU2019 poster</a>.</p>
    </div>
  </div>
  </section>
  <section>
    <div class="container">
      <div class="columns">
         <div class="column is-one-quarter">
    <h1>SEAS5 forecast issued:</h1>
              <select-option :options="Object.values(monthOptions)" 
                             :selected="monthOptions[selectedMonth]" 
                             @updateOption="updateSelectedMonth($event)"
                             ></select-option>

    <h1>lead time: </h1>
          <select-option :options="Object.values(leadOptions)" 
                         :selected="leadOptions[selectedLead]"
                         @updateOption="updateSelectedLead($event)"
                         ></select-option>

    <h1>Prediction product: </h1>
          <select-option :options="prodOptions.map(a => a.text)" 
                         :selected="selectedProd"
                         @updateOption="selectedProd = $event"
                         ></select-option>

         </div>

        <div class="column">
        <div class="container">
            <p>{{ getProdText }} for <strong>{{ getDate }}</strong></p>
          <base-m :zoom-transform.sync="zoomTransform" :mapData="getLeft"/>
        </div>
        </div>
</div>
    <br>
      <div class="columns">
         <div class="column is-one-quarter">
        <h1>Compare to: </h1>
          <select-option :options="compOptions.map(a => a.text)" 
                         :selected="selectedCompProd"
                         @updateOption="selectedCompProd = $event"
           ></select-option>
         </div>
         <div class="column">
             <p>MODIS Active fires for <strong> {{ getDate }}</strong></p>
          <base-m :zoom-transform.sync="zoomTransform" :mapData="getRight" />
          </div>
        </div>
    </div>

  </section>
  </section>
</template>

<script>
/* @flow */
import selectOption from '@/components/selectOption.vue'
import Probs from '@/assets/forecast.json'
import lonLats from '@/assets/geo/lonlats_fore.json'
import BaseM from '@/components/BaseM.vue'

export default {

  components: {
    selectOption: selectOption,
    BaseM: BaseM,
  },

  data() {
    return {
      probs: {},
      baseYear: '2019',
      selectedMonth: '2019-9',
      baseDate: {},
      selectedLead: '1',
      selectedProd: 'Forecast',
      selectedCompProd: 'Active fires',
      
      prodOptions: [
          {text: 'Forecast', longText: 'SEAS5 based fire occurrence probability', value: 'probs', thresholds: [10,30,50,70,90], shift: 0},
          {text: 'Climatology', longText: 'Fire occurrence probability based on ERA5 climate', value: 'clim_probs', thresholds: [10,30,50,70,90], shift: 0},
          {text: 'Anomaly', longText: 'SEAS5 probability anomaly vs ERA5 climatology', value: 'probs',  thresholds: [-50, -10, -5, 5, 10, 50], shift: 0},
      ],

      compOptions: [
          {text: 'Active fires', longText: 'MODIS Active fire count', value: 'frp', thresholds: [10,20,40,80,160], shift: 0},
          {text: 'Validation', longText: 'True and false positives', value: 'frp', thresholds: ['TN', 'TP', 'FN', 'FP'], shift: 18},
      ],

      monthOptions: {
            '2019-7': 'July',
            '2019-8': 'August',
            '2019-9': 'September'
      },

      leadOptions: {
          '1': '1 month lead',
          '2': '2 month lead',
          '3': '3 month lead',
          '4': '4 month lead',
      },

      zoomTransform: {
        k: 1,
        x: 0,
        y: 0
      }
    }
  },

  created() {
    this.lonLats = lonLats
    this.baseDate = new Date(this.baseYear.concat(this.selectedMonth, '1'))
    this.probs = this.getProbs
  },

  computed: {
      getProbs: function() {
        console.log('getting probs')
        return Probs[this.selectedMonth][this.selectedLead]
        this.getLeft
      },

      getProdText: function() {
        let text = this.prodOptions.find(x => x.text === this.selectedProd)
        return text.longText
      },

      getLeft: function() {
        console.log('getting left')
        let selProd = this.prodOptions.find(x => x.text === this.selectedProd)
        let datas = Probs[this.selectedMonth][this.selectedLead][selProd.value]
          if (selProd.text === 'Anomaly') {
              datas = this.getAnomalies(datas)
          }
        let result = datas.map((s, i) => [s, this.lonLats[i]]) //combine values
        //let final_result = result.filter(s => s[0] > 10)
        return {'vals': result, 'label': selProd.text, 'thresholds': selProd.thresholds, 'shift': selProd.shift}
      },

     getRight: function() {
        let selProd = this.compOptions.find(x => x.text === this.selectedCompProd)
        let frps = Probs[this.selectedMonth][this.selectedLead][selProd.value]
        if (selProd.text === 'Validation') {
            let selProd = this.prodOptions.find(x => x.text === this.selectedProd)
            console.log(selProd)
            let foreProbs = Probs[this.selectedMonth][this.selectedLead][selProd.value]
            frps = this.getValidation(frps, foreProbs)
            let unique = frps.filter((item, i, ar) => ar.indexOf(item) === i)
            console.log(unique)
          }
        let final_result = frps.map((s, i) => [s, this.lonLats[i]]) //combine values
        //let final_result = result.filter(s => s[0] > 10)
        return {'vals': final_result, 'label': selProd.text, 'thresholds': selProd.thresholds, 'shift': selProd.shift}
      },

      getDate: function() {
        let baseDate = new Date(this.monthOptions[this.selectedMonth] + ' 1, ' + this.baseYear)
        let newDate = new Date(baseDate.setMonth(baseDate.getMonth() + parseInt(this.selectedLead)-1));
        const month = newDate.toLocaleString('default', { month: 'long' });
        return newDate.getFullYear().toString().concat(' ', month)
      },
    },

    methods: {
        getValidation: function(frps, foreProbs) {
            let vali = foreProbs.map((forecast, i) => this.truePositives(forecast, frps[i]))
            return vali
        },

        truePositives: function(forecast, frp) {
            if (forecast > 49 && frp > 9) {
                return 'TP'
            }
            if (forecast > 49 && frp < 10) {
                return 'FP'
            }
            if (forecast < 50 && frp < 10) {
                return 'TN'
            }
            if (forecast < 50 && frp > 9) {
                return 'FN'
            }
        },

        getAnomalies: function(datas) {
             let clim = this.probs['clim_probs']
             let anomaly = datas.map((x, i) => x - clim[i])
             return anomaly
        },

        updateSelectedLead: function(selected) {
          this.selectedLead = Object.keys(this.leadOptions)
                .find(key => this.leadOptions[key] === selected);
        },

        updateSelectedMonth: function(selected) {
          this.selectedMonth = Object.keys(this.monthOptions)
                .find(key => this.monthOptions[key] === selected);
        },
    },

}
</script>
