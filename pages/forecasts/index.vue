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
        <select-option :options="dates.map(x => x.text)" 
                       :selected="dates.find(x => x.id === selectedMonth).text" 
                             @updateOption="updateSelectedMonth($event)"
                             ></select-option>

    <h1>lead time: </h1>
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
            <p>{{ getProdText }} forecast issued <strong>{{ getSEAS5Date }}</strong></p>
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
import Probs from '@/assets/forecast_.json'
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
      leadOptions: {},
      dates: [],
      selectedMonth: '2019-9',
      selectedLead: '1',
      selectedProd: 'Forecast',
      selectedCompProd: 'Active fires',
      
      prodOptions: [
          {text: 'Forecast', longText: 'SEAS5 based fire occurrence probability', value: 'forecast', thresholds: [10,30,50,70,90], shift: 0},
          {text: 'Anomaly', longText: 'SEAS5 probability anomaly vs ERA5 climatology', value: 'forecast',  thresholds: [-50, -10, -5, 5, 10, 50], shift: 0},
      ],

      compOptions: [
          {text: 'Climatology', longText: 'Fire occurrence probability based on ERA5 climate', value: 'climatology', thresholds: [10,30,50,70,90], shift: 0},
          {text: 'Active fires', longText: 'MODIS Active fire count', value: 'frp', thresholds: [10,20,40,80,160], shift: 0},
          {text: 'Validation', longText: 'True and false positives', value: 'frp', thresholds: ['TN', 'TP', 'FN', 'FP'], shift: 18},
      ],

      zoomTransform: {
        k: 1,
        x: 0,
        y: 0
      }
    }
  },

  created() {
    this.lonLats = lonLats
    this.probs = this.getProbs
    this.dates = this.parseDates
    this.leadOptions = this.parseLead
  },

  computed: {
      getSelectedLead: function() {
          this.validateSelectedLead
          return this.leadOptions[this.selectedLead]
      },

      parseDates: function() {
        let dateOptions = []
        let dateStrings = Object.keys(Probs)
        dateStrings.map((x, i) => dateOptions[i] = this.datesObject(x))
        return dateOptions
      },

      parseLead: function() {
          this.leadOptions = {}
          let leadKeys = Object.keys(Probs[this.selectedMonth]['forecast'])
          leadKeys.map(x => this.leadOptions[x] = x.concat(" month lead"))
          this.validateSelectedLead
          return this.leadOptions
      },

      parseProducts: function() {
          this.availProducts = {}
          let prodKeys = Object.keys(Probs[this.selectedMonth])
          if (!(prodKeys.includes("frp"))) {
              this.compOptions = this.compOptions.find(x => x.text === 'Climatology') 
          }
          console.log('prodkeys', prodKeys)
          console.log(this.compOptions.map(x => x.text))
          return this.compOptions.map(x => x.text)
      },



      getProbs: function() {
        console.log('getProbs')
        console.log(Probs[this.selectedMonth])
        return Probs[this.selectedMonth]
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
        let selProd = this.compOptions.find(x => x.text === this.selectedCompProd)
        let frps = Probs[this.selectedMonth][selProd.value]
        console.log(frps)
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
      let baseDate = this.dates.find(x => x.id === this.selectedMonth).date
        const month = baseDate.toLocaleString('default', { month: 'long' });
        return baseDate.getFullYear().toString().concat(' ', month)
      },

      getSEAS5Date: function() {
      let baseDate = this.dates.find(x => x.id === this.selectedMonth).date
      let newDate = new Date(baseDate.setMonth(baseDate.getMonth() - parseInt(this.selectedLead) + 1));
        const month = newDate.toLocaleString('default', { month: 'long' });
        return newDate.getFullYear().toString().concat(' ', month)
      },

      validateSelectedLead: function() {
            if (!(this.selectedLead in this.leadOptions)) {
                this.selectedLead = Object.keys(this.leadOptions)[0]
                console.log('validating', Object.keys(this.leadOptions)[0])
            }
            console.log('selLead', this.selectedLead)
        },

    },

    methods: {
        datesObject: function(dateString) {
            let dateDef = {}
            dateDef['id'] = dateString
            let yearMonth = dateString.split("-")
            let baseDate = new Date(yearMonth[1] + ' 1, ' + yearMonth[0])
            const month = baseDate.toLocaleString('default', { month: 'long' });
            dateDef['text'] = baseDate.getFullYear().toString().concat(' ', month)
            dateDef['date'] = baseDate
            return dateDef
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
             let clim = this.probs['climatology']
             let anomaly = datas.map((x, i) => x - clim[i])
             return anomaly
        },


        updateSelectedLead: function(selected) {
          this.selectedLead = Object.keys(this.leadOptions)
                .find(key => this.leadOptions[key] === selected);
        },

        updateSelectedMonth: function(selected) {
          this.selectedMonth = this.dates
                .find(x => x.text === selected).id;
        },
    },

}
</script>
