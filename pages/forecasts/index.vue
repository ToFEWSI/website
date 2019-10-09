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
      <p>Fire occurrence probabilities for the ongoing 2019 dry season in Indonesia produced by the ToFEWSI modelling system. The predictions are generated using Neural Networks model. The model is trained using ERA5 reanalysis weather, past forest cover change and map of peatland distribution in Indonesia. Forecast probabilities are computed using ECMWF SEAS5 model seasonal forecasts. Validation is performed against MODIS active fire observations. To find out more about the method see the <a href="https://drive.google.com/file/d/1OiLitt4IQf2cSLr6FV6UZH-rvEogaqRr/preview" target="_blank" class="button is-info is-outlined is-small nuxt-lind">EGU2019 poster</a></p>
    </div>
  </div>
  </section>
  <section>
    <div class="container">
      <div class="columns">
         <div class="column is-one-quarter">
    <h1>SEAS5 forecast issued:</h1>
              <select-option :options="monthOptions.map(a => a.text)" 
                             :selected="selectedMonth" 
                             @updateOption="selectedMonth = $event"
                             ></select-option>

    <h1>lead time: </h1>
          <select-option :options="leadOptions.map(a => a.text)" 
                         :selected="selectedLead"
                         @updateOption="selectedLead = $event"
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
      selectedMonth: 'September',
      baseDate: {},
      selectedLead: '1 month lead',
      selectedProd: 'Forecast',
      selectedCompProd: 'Active fires',
      
      prodOptions: [
          {text: 'Forecast', longText: 'SEAS5 based fire occurrence probability', value: 'probs', thresholds: [10,30,50,70,90]},
          {text: 'Climatology', longText: 'Fire occurrence probability based on ERA5 climate', value: 'clim_probs', thresholds: [10,30,50,70,90]},
          {text: 'Anomaly', longText: 'SEAS5 probability anomaly vs ERA5 climatology', value: 'probs',  thresholds: [-50, -10, -5, 5, 10, 50]},
      ],

      compOptions: [
          {text: 'Active fires', longText: 'MODIS Active fire count', value: 'frp', thresholds: [10,20,40,80,160]},
      ],

      monthOptions: [
            {text: 'July', value: '2019-7'},
            {text: 'August', value: '2019-8'},
            {text: 'September', value: '2019-9'}
      ],

      leadOptions: [
          {text: '1 month lead', value: '1'},
          {text: '2 month lead', value: '2'},
          {text: '3 month lead', value: '3'},
          {text: '4 month lead', value: '4'},
      ],

      zoomTransform: {
        k: 1,
        x: 0,
        y: 0
      }
    }
  },

  created() {
    this.probs = Probs;
    this.lonLats = lonLats;
    this.baseDate = new Date(this.baseYear.concat(this.selectedMonth, '1'))
  },

  computed: {
      getProdText: function() {
        let text = this.prodOptions.find(x => x.text === this.selectedProd)
        return text.longText
      },

      getLeft: function() {
        let month = this.monthOptions.find(x => x.text === this.selectedMonth)
        let lead = this.leadOptions.find(x => x.text === this.selectedLead)
        let selProd = this.prodOptions.find(x => x.text === this.selectedProd)
        let datas = this.probs[month.value][lead.value][selProd.value]
          if (selProd.text === 'Anomaly') {
              let clim = this.probs[month.value][lead.value]['clim_probs']
              datas = datas.map((x, i) => x - clim[i])
          }
        let result = datas.map((s, i) => [s, this.lonLats[i]]) //combine values
        //let final_result = result.filter(s => s[0] > 10)
        return {'vals': result, 'label': selProd.text, 'thresholds': selProd.thresholds}
      },

     getRight: function() {
        let month = this.monthOptions.find(x => x.text === this.selectedMonth)
        let lead = this.leadOptions.find(x => x.text === this.selectedLead)
        let selProd = this.compOptions.find(x => x.text === this.selectedCompProd)
        let datas = this.probs[month.value][lead.value][selProd.value]
        let result = datas.map((s, i) => [s, this.lonLats[i]]) //combine values
         let final_result = result.filter(s => s[0] > 10)
        return {'vals': final_result, 'label': selProd.text, 'thresholds': selProd.thresholds}
      },

      getDate: function() {
        let baseDate = new Date(this.selectedMonth + ' 1, ' + this.baseYear)
        let newDate = new Date(baseDate.setMonth(baseDate.getMonth() + parseInt(this.selectedLead)-1));
        const month = newDate.toLocaleString('default', { month: 'long' });
        return newDate.getFullYear().toString().concat(' ', month)
      },

    },

}
</script>
