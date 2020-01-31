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
    <h1>Forecast for:</h1>
        <select-option :options="Object.values(dateOptions)" 
                       :selected="dateOptions[selectedMonth]" 
                             @updateOption="updateSelectedMonth($event)"
                             ></select-option>

    <h1>SEAS5 lead: </h1>
          <select-option :options="Object.values(parseLead)" 
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
            <p>{{ getProdText }} for <strong>{{ getDate }}</strong>, SEAS5 forecast released on the <strong>1st {{ getSEAS5Date }}</strong></p>
          <base-m :zoom-transform.sync="zoomTransform" :mapData="getLeft"/>
        </div>
        </div>
</div>
    <br>
      <div class="columns">
         <div class="column is-one-quarter">
        <h1>Compare to: </h1>
          <select-option :options="parseProducts" 
                         :selected="selectedCompProd"
                         @updateOption="selectedCompProd = $event"
           ></select-option>
         </div>
         <div class="column">
             <p> {{ getCompText }} for <strong> {{ getDate }} </strong></p>
          <base-m :zoom-transform.sync="zoomTransform" :mapData="getRight" />
          </div>
        </div>
    </div>

  </section>
  </section>
</template>

<script>
/* @flow */
import SelectOption from '@/components/SelectOption.vue'
import Probs from '@/assets/forecast.json'
import lonLats from '@/assets/geo/lonlats_fore.json'
import BaseM from '@/components/BaseM.vue'
import { mapActions } from 'vuex'

export default {

  components: {
    SelectOption: SelectOption,
    BaseM: BaseM,
  },

  data() {
    return {
      probs: {},
      leadOptions: {},
      availProducts: {},
      dateOptions: {},
      selectedMonth: '2019-9',
      selectedLead: '1',
      selectedProd: 'Forecast',
      selectedCompProd: 'Active fires',
      
      prodOptions: [
          {text: 'Forecast', longText: 'SEAS5-based fire occurrence probability', value: 'forecast', thresholds: [10,30,50,70,90], shift: 0},
          {text: 'Anomaly', longText: 'SEAS5 probability anomaly vs ERA5 climatology', value: 'forecast',  thresholds: [-50, -10, -5, 5, 10, 50], shift: 0},
      ],

      compOptions: [
          {text: 'Climatology', longText: '1985 - 2018 ERA5 climate-based fire occurrence probability', value: 'climatology', thresholds: [10,30,50,70,90], shift: 0},
          {text: 'Active fires', longText: 'MODIS Active fire count', value: 'frp', thresholds: [10,20,40,80,160], shift: 0},
          {text: 'Validation', longText: 'TN - true negatives, TP - true positives, FN - false negatives, FP - false positives', value: 'frp', thresholds: ['TN', 'TP', 'FN', 'FP'], shift: 18},
      ],

      zoomTransform: {
        k: 1,
        x: 0,
        y: 0
      }
    }
  },

  created() {
    this.$store.dispatch('selector/initProbs');
    this.lonLats = lonLats
    this.probs = this.getProbs
    this.dateOptions = this.parseDates
    this.leadOptions = this.parseLead
    this.availProducts = this.parseProducts
  },

  computed: {
      parseDates: function() {
        this.dateOptions = {}
        let dateStrings = Object.keys(Probs)
        dateStrings.map(x => this.dateOptions[x] = this.getDateText(x))
        return this.dateOptions
      },

      parseLead: function() {
          this.leadOptions = {}
          let leadKeys = Object.keys(Probs[this.selectedMonth]['forecast'])
          leadKeys.map(x => this.leadOptions[x] = x.concat(" month lead"))
          this.validateSelectedLead
          return this.leadOptions
      },

      parseProducts: function() {
          let prodKeys = Object.keys(Probs[this.selectedMonth])
          if (prodKeys.length !== 3) {
              this.availProducts = [this.compOptions.find(x => x.text === 'Climatology')]
              this.validateSelectedProd
              return this.availProducts.map(x => x.text)
          } else {
              this.availProducts = this.compOptions
          }
          return this.availProducts.map(x => x.text)
      },

      getProbs: function() {
        return Probs[this.selectedMonth]
      },

      getCompText: function() {
        let text = this.availProducts.find(x => x.text === this.selectedCompProd)
        return text.longText
      },

      getProdText: function() {
        let text = this.prodOptions.find(x => x.text === this.selectedProd)
        return text.longText
      },

      getLeft: function() {
        let selProd = this.prodOptions.find(x => x.text === this.selectedProd)
        let datas = Probs[this.selectedMonth][selProd.value][this.selectedLead]
          if (selProd.text === 'Anomaly') {
              datas = this.getAnomalies(datas)
          }
        let result = datas.map((s, i) => [s, this.lonLats[i]]) //combine values
        //let final_result = result.filter(s => s[0] > 10)
        return {'vals': result, 'label': selProd.text, 'thresholds': selProd.thresholds, 'shift': selProd.shift}
      },

     getRight: function() {
        let selProd = this.availProducts.find(x => x.text === this.selectedCompProd)
        let frps = Probs[this.selectedMonth][selProd.value]
        if (selProd.text === 'Validation') {
            let selProd = this.prodOptions.find(x => x.text === this.selectedProd)
            let foreProbs = Probs[this.selectedMonth][selProd.value][this.selectedLead]
            frps = this.getValidation(frps, foreProbs)
            let unique = frps.filter((item, i, ar) => ar.indexOf(item) === i)
          }
        let final_result = frps.map((s, i) => [s, this.lonLats[i]]) //combine values
        //let final_result = result.filter(s => s[0] > 10)
        return {'vals': final_result, 'label': selProd.text, 'thresholds': selProd.thresholds, 'shift': selProd.shift}
      },

      getDate: function() {
        let yearMonth = this.selectedMonth.split("-")
        let baseDate = new Date(yearMonth[1] + ' 1, ' + yearMonth[0])
        let month = baseDate.toLocaleString('default', { month: 'long' })
        return month.concat(' ', baseDate.getFullYear().toString())
      },

      getSEAS5Date: function() {
          let yearMonth = this.selectedMonth.split("-")
          let startDate = new Date(yearMonth[1] + ' 1, ' + yearMonth[0])
          let newDate = new Date(startDate.setMonth(startDate.getMonth() - parseInt(this.selectedLead) + 1))
          let month = newDate.toLocaleString('default', { month: 'long' })
          return month.concat(' ', newDate.getFullYear().toString())
      },

      validateSelectedLead: function() {
            if (!(this.selectedLead in this.leadOptions)) {
                this.selectedLead = Object.keys(this.leadOptions)[0]
            }
        },

     validateSelectedProd: function() {
            if (!(this.selectedCompProd in this.availProducts)) {
                this.selectedCompProd = 'Climatology'
            }
        },

    },

    methods: {
        getDateText: function(dateString) {
            let yearMonth = dateString.split("-")
            const baseDate = new Date(yearMonth[1] + ' 1, ' + yearMonth[0])
            let month = baseDate.toLocaleString('default', { month: 'long' });
            let dateText = baseDate.getFullYear().toString().concat(' ', month)
            return dateText
        },

        getValidation: function(frps, foreProbs) {
            let vali = foreProbs.map((forecast, i) => this.truePositives(forecast, frps[i]))
            return vali
        },

        truePositives: function(forecast, frp) {
            if (forecast > 49 && frp > 9) {
                return 'TP'
            } else if (forecast > 49 && frp < 10) {
                return 'FP'
            } else if (forecast < 50 && frp < 10) {
                return 'TN'
            } else if (forecast < 50 && frp > 9) {
                return 'FN'
            }
        },

        getAnomalies: function(datas) {
             let clim = Probs[this.selectedMonth]['climatology']
             let anomaly = datas.map((x, i) => x - clim[i])
             return anomaly
        },

        updateSelectedLead: function(selected) {
          this.selectedLead = Object.keys(this.leadOptions)
                .find(key => this.leadOptions[key] === selected);
        },

        updateSelectedMonth: function(selected) {
          this.selectedMonth = Object.keys(this.dateOptions)
                .find(key => this.dateOptions[key] === selected);
        },
    },

}
</script>
