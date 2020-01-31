export default [
      {text: 'Forecast', longText: 'SEAS5-based fire occurrence probability', value: 'forecast', thresholds: [10,30,50,70,90], shift: 0},
      {text: 'Anomaly', longText: 'SEAS5 probability anomaly vs ERA5 climatology', value: 'forecast',  thresholds: [-50, -10, -5, 5, 10, 50], shift: 0},
]
