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
      <p>ToFEWSI fire occurrence probabilities for the ongoing 2019 dry season in Indonesia predicted by Neural Network classifier. The predictions are based on ECMWF SEAS5 seasonal forecasts, past forest cover change and map of peatland distribution in Indonesia.</p>
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
         </div>
        <div class="column">
        <div class="container">
          <p>Fire occurrence forecast for <strong>{{ getDate }}</strong></p>
          <base-m :zoom-transform.sync="zoomTransform" :datas="getLeft" />
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
             <p>{{ getCompText }} for <strong> {{ getDate }}</strong></p>
          <base-m :zoom-transform.sync="zoomTransform" :datas="getRight" />
          </div>
        </div>
    </div>

  </section>
  </section>
</template>

<script>
import selectOption from '@/components/selectOption.vue'
import ProbsAll from '@/assets/probdata_all.json'
import Probs from '@/assets/forecast.json'
import lonLats from '@/assets/geo/lonlats_fore.json'
import BaseMap from '@/components/BaseMap.vue'
import BaseM from '@/components/BaseM.vue'

export default {
  components: {
    selectOption: selectOption,
    BaseMap: BaseMap,
    BaseM: BaseM
  },

  data() {
    return {
      probs: {},
      baseYear: '2019',
      selectedMonth: 'September',
      baseDate: {},
      selectedLead: '1 month lead',
      selectedProd: 'probs',
      selectedCompProd: 'Climatology',
      
      compOptions: [
          {text: 'Active fires', longText: 'MODIS Active fire count', value: 'frp'},
          {text: 'Climatology', longText: 'ERA5 1985 - 2018 mean climate based prediction', value: 'clim_probs'},
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
      getCompText: function() {
        var text = this.compOptions.find(x => x.text === this.selectedCompProd)
        return text.longText
      },

      getLeft: function() {
        var month = this.monthOptions.find(x => x.text === this.selectedMonth)
        var lead = this.leadOptions.find(x => x.text === this.selectedLead)
        var datas = Probs[month.value][lead.value][this.selectedProd]
        var result = datas.map((s, i) => [s, this.lonLats[i]]) //combine values
        //  .filter(s => s[0] > model.threshold) //
        return result
      },

     getRight: function() {
        var month = this.monthOptions.find(x => x.text === this.selectedMonth)
        var lead = this.leadOptions.find(x => x.text === this.selectedLead)
        var selProd = this.compOptions.find(x => x.text === this.selectedCompProd)
        console.log(selProd.value)
        var datas = Probs[month.value][lead.value][selProd.value]
        var result = datas.map((s, i) => [s, this.lonLats[i]]) //combine values
        //  .filter(s => s[0] > model.threshold) //
        return result
      },

      getDate: function() {
        var baseDate = new Date(this.baseYear.concat(this.selectedMonth, '1'))
        var newDate = new Date(baseDate.setMonth(baseDate.getMonth() + parseInt(this.selectedLead)-1));
        const month = newDate.toLocaleString('default', { month: 'long' });
        return newDate.getFullYear().toString().concat(' ', month)
      },
    },

}
</script>
