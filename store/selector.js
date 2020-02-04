import Probs from '@/assets/forecast.json'
import prodOptions from '@/assets/prodOpts.js'
import compOptions from '@/assets/prodOpts.js'

const state = () => ({
    probs: {},
    leadOptions: {},
    availProds: {},
    availDates: {},
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
    'SET_DATES' (state, dates) {
        state.availDates = dates;
    },
    'SET_LEAD_OPTIONS' (state, leadOptions) {
        state.leadOptions = leadOptions;
    },

    'SET_AVAIL_PRODS' (state, availProds) {
        state.availProds = availProds;
    }
};

export const actions = {
    initProbs: ({commit}) => {
        commit('SET_PROBS', Probs);
    },

    initDates: ({commit}, dates) => {
        commit('SET_DATES', dates)
    },

    setLead: ({commit}, leadOptions) => {
        commit('SET_LEAD_OPTIONS', leadOptions)
    },

    setAvailProds: ({commit}, availProds) => {
        commit('SET_AVAIL_PRODS', availProds)
    },

};

export const getters = {

    availDates: state => {
        return state.availDates;
    },

    availProds: state => {
        return state.availProds;
    },
};

