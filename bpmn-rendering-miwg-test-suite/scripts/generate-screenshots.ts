/**
 * Copyright 2022 Bonitasoft S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as fs from 'node:fs';
import {chromium} from 'playwright-chromium';

type Configuration = {
    /**
     * Number of diagrams in the file that needs to be exported.
     * Currently, only export the first one and postfix the screenshot file name with a number.
     * It will change with https://github.com/process-analytics/bpmn-visualization-js/issues/729
     **/
    diagramsNumber?: number;
    viewport?: { width: number, height: number }
}


// TODO lot of things are duplicated with the 'version-to-version' tool
const outputDirectory = 'build/screenshots';
fs.rmSync(outputDirectory, {recursive: true, force: true});
fs.mkdirSync(outputDirectory, {recursive: true});


// list files from the public directory
const diagrams = fs.readdirSync('public')
    .filter(file => file.endsWith('.bpmn'))
    .map(file => file.substring(0, file.indexOf('.bpmn')));
// Use this to check a dedicated diagram
// const diagrams = ['B.2.0'];
// const diagrams = ['A.1.0', 'B.2.0', 'C.4.0'];

// configuration stores viewport
const configuration = new Map<string, Configuration>([
    ['A.1.0', {viewport: {width: 771, height: 111}}],
    ['A.2.0', {viewport: {width: 810, height: 343}}],
    ['A.3.0', {viewport: {width: 770, height: 440}}],
    ['A.4.0', {viewport: {width: 1222, height: 807}}],
    ['A.4.1', {viewport: {width: 1284, height: 1037}}],
    ['B.1.0', {viewport: {width: 1103, height: 1011}}],
    ['B.2.0', {viewport: {width: 1926, height: 1413}}],
    // ['C.1.0', {}], // no need for config
    // ['C.2.0', {}], // no need for config
    // ['C.3.0', {}], // no need for config
    ['C.4.0', {diagramsNumber: 4, viewport: {width: 2240, height: 800}}], // viewport only for the first diagram (other viewports will be configured later when we support the rendering of more diagrams)
    ['C.5.0', {diagramsNumber: 2, viewport: {width: 3821, height: 984}}], // viewport only for the first diagram (other viewports will be configured later when we support the rendering of more diagrams)
    ['C.6.0', {viewport: {width: 2081, height: 942}}],
    // ['C.7.0', {}], // no need for config
    ['C.8.0', {viewport: {width: 2158, height: 850}}],
    ['C.8.1', {viewport: {width: 1920, height: 800}}],
]);

const baseUrl = 'localhost:5173/index.html';

// playwright default
const defaultViewPort = { width: 1280, height: 720 };
// other
// const defaultViewPort = { width: 1024, height: 768 };

(async () => {
    const browser = await chromium.launch({headless: false});
    const page = await browser.newPage();

    for (const fileName of diagrams) {
        console.info('Processing file', fileName);

        const diagramConfiguration = configuration.get(fileName);
        const viewPort = diagramConfiguration?.viewport ?? defaultViewPort;
        console.info('viewport:', viewPort);
        await page.setViewportSize(viewPort);

        await page.goto(`${baseUrl}?bpmnFileName=${fileName}`);

        console.info('Waiting for diagram rendering...');
        // TODO wait for generated element instead of waiting for 1 second (risk of flaky generation, see https://playwright.dev/docs/api/class-page#pagewaitfortimeouttimeout)
        // we do this in bpmn-visualization tests
        // we could at least check mxgraph initialization or check the existence of a specific BPMN SVG nodes by looking for its related data-bpmn-id
        await page.waitForTimeout(1000);
        console.info('Wait done');

        // https://playwright.dev/docs/screenshots
        // TODO ensure no fullPage, configure css to make fitCenter work or configure viewport for each file
        // TODO when several bpmn diagram in a file, the file name must be prefix by '.<number>'
        const screenshotFileNamePostfix = diagramConfiguration?.diagramsNumber ? '.1' : '';
        await page.screenshot({path: `${outputDirectory}/${fileName}-import${screenshotFileNamePostfix}.png`, fullPage: true});
        console.info(`Screenshot generated for ${fileName}`);
        // TODO decide if we use need to use 'locator'
        // await page.locator('#bpmn-container').screenshot({path: `${outputDirectory}/${fileName}-import-1-alternative.png`});
    }

    // TODO properly exit the script
    await browser.close();
    process.exit(0);
})();

