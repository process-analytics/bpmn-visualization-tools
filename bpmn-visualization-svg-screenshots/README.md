# How-to do SVG screenshots/exports of bpmn-visualization demo

## Context

Why using SVG instead of PNG (or other raster images)? Vectorial images offer better rendering than regular images. For example, for the PA website. 

`bpmn-visualization`
  - SVG exporter: partially implemented, not fully working (overlays are misplaced). Only available in the code of the
  demo provided by the library (no API).
  - extract manually the SVG definition from the DOM: text are not correctly positioned. This is because we currently (v0.30.0)
  HTML labels that are positioned with foreign objects. The position is only accurate within the webpage
  - extra CSS class applied to the elements: they would require to manually copy the CSS rules within the SVG definitions


## A possible solution: `html2svg`

https://github.com/fathyb/html2svg

```bash
docker run fathyb/html2svg \
  https://cdn.statically.io/gh/process-analytics/bpmn-visualization-examples/v0.30.0/demo/monitoring-all-process-instances/index.html \
  --format svg \
  > monitoring.svg
```

Don't forget to put the URL between quotes if it contains query parameters:
```bash
docker run fathyb/html2svg \
  "https://cdn.statically.io/gh/process-analytics/bpmn-visualization-examples/070cfc9/demo/monitoring-all-process-instances/index.html?useCase=frequency&dataType=both" \
  --format svg \
  > monitoring.svg
```

### Post-process

The visible part or the whole page have been exported as an SVG file. We need to crop the content to only keep the releavant part of the demo.

In the future, it may be possible to only export a dedicated html element. See https://github.com/fathyb/html2svg/issues/27

**TODO** find an editor which is able to read the content of the exported SVG.
- On ubuntu 20, the svg files seem empty when opening them with inkscape 1.2 or the default Images Viewer.

Workaround
- update the content of the page to only keep the part you want to export as an SVG image. This is what was done in [PA website #899](https://github.com/process-analytics/process-analytics.dev/pull/899).



#### Final optimization of the SVG file

Optimize the SVG content with svggo, for instance by using https://jakearchibald.github.io/svgomg/.

May be also available in html2svg in the future, see https://github.com/fathyb/html2svg/issues/5
