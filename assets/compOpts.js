export default [
      {text: 'Climatology', longText: '1985 - 2018 ERA5 climate-based fire occurrence probability', value: 'climatology', thresholds: [10,30,50,70,90], shift: 0},
      {text: 'Active fires', longText: 'MODIS Active fire count', value: 'frp', thresholds: [10,20,40,80,160], shift: 0},
      {text: 'Validation', longText: 'TN - true negatives, TP - true positives, FN - false negatives, FP - false positives', value: 'frp', thresholds: ['TN', 'TP', 'FN', 'FP'], shift: 18},
]


