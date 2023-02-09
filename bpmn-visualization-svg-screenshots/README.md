# How-to do SVG screenshots/exports of bpmn-visualization demo

## Context

SVG instead of PNG (or other raster images): vectorial better rendering than regular images. For example, in the PA website. 

bpmn-visualization
  - SVG exporter: partially implemented, not fully working (overlays are misplaced). Only available in the code of the
  demo provided by the library (no API).
  - extract manually the SVG definition from the DOM: text are not correctly positioned. This is because we currently (v0.30.0)
  HTML labels that are positioned with foreign objects. The position is only accurate within the webpage
  - extra CSS class applied to the elements: they would require to manually copy the CSS rules within the SVG definitions


## A possible solution: `html2svg`

https://github.com/fathyb/html2svg

```bash
docker run fathyb/html2svg https://cdn.statically.io/gh/process-analytics/bpmn-visualization-examples/v0.30.0/demo/monitoring-all-process-instances/index.html --format
svg > monitoring.svg
```

