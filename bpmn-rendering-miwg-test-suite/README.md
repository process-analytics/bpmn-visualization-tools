# Generate screenshots of BPMN Diagram from migw-test-suite with `bpmn-visualization`

## Purpose

This tools helps in preparing the `bpmn-visualization` submission to https://github.com/bpmn-miwg/bpmn-miwg-test-suite/, to demonstrate
how it renders the Reference diagrams.

The screenshots shows the "BPMN in Color" support of `bpmn-visualization` that has been introduced in version 0.35.0.


### Submission process

Everything is explained in https://github.com/bpmn-miwg/bpmn-miwg-test-suite/#how-to-test-a-bpmn-tool-using-this-test-suite.

Use this tools to prepare the required resources prior creating a Pull Request.

Think about automating if we submit often.


## Install

Node: 16

Run `npm install`

Test the dev server
- run `npm run dev`
- open http://localhost:5173/?bpmnFileName=C.1.0. The `bpmnFileName` query parameter is used to load any BPMN diagram available in the `public` directory.

## How-to use

### Prepare the BPMN files from miwg-test-suite

Get the miwg-test-suite repository
```
git clone git@github.com:bpmn-miwg/bpmn-miwg-test-suite.git
```

To copy or update the reference files used by the tool in the `public` directory, pass the `MIWG_TEST_SUITE_PATH` environment
variable to the following command prior running it: `npm run copy-ref-bpmn`

For instance, by running
```bash
MIWG_TEST_SUITE_PATH=/tmp/bpmn-miwg-test-suite npm run copy-ref-bpmn
```

### Generate the screenshots

- run the dev server: `npm run dev`
- run the script that generates screenshots using playwright: `npm run generate-screenshots`

The screenshots are generated in the `build/screenshots` directory.

## How it works

The dev server is provided by [Vite](https://vitejs.dev/).

The screenshots are taken thanks to [Playwright](https://playwright.dev/):
- a custom page opens in Chromium
- for each miwg reference file, the page displays the diagram
- a screenshot is taken
