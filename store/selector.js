import Probs from '@/assets/forecast.json'
import prodOptions from '@/assets/prodOpts.js'
import compOptions from '@/assets/prodOpts.js'

export const state = () => ({
    probs: {},
    leadOptions: {},
    availProducts: {},
    dateOptions: {},
    selectedMonth: '2019-9',
    selectedLead: '1',
    selectedProd: 'Forecast',
    selectedCompProd: 'Active fires',
    prodOptions: [
        {
            text: 'Forecast',
            longText: 'SEAS5-based fire occurrence probability',
            value: 'forecast',
            thresholds: [10,30,50,70,90],
            shift: 0 
        },
        {
            text: 'Anomaly',
            longText: 'SEAS5 probability anomaly vs ERA5 climatology',
            value: 'forecast',
            thresholds: [-50, -10, -5, 5, 10, 50],
            shift: 0
        },
    ],

    compOptions: [
        {
            text: 'Climatology',
            longText: '1985 - 2018 ERA5 climate-based fire occurrence probability',
            value: 'climatology', thresholds: [10,30,50,70,90],
            shift: 0
        },
        {
            text: 'Active fires',
            longText: 'MODIS Active fire count',
            value: 'frp',
            thresholds: [10,20,40,80,160],
            shift: 0
        },
        {
            text: 'Validation',
            longText: 'TN - true negatives, TP - true positives, FN - false negatives, FP - false positives',
            value: 'frp',
            thresholds: ['TN', 'TP', 'FN', 'FP'],
            shift: 18
        },
    ],
})

export const mutations = {
    'SET_PROBS' (state, probs) {
        state.probs = probs;
    },
    'SET_PROBS' (state, probs) {
        state.probs = probs;
    },
    'SET_PROBS' (state, probs) {
        state.probs = probs;
    },
}

export const actions = {
    initProbs: ({commit}) => {
        commit('SET_PROBS', Probs);
    }
}


