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
// const diagrams = fs.readdirSync('public')
//     .filter(file => file.endsWith('.bpmn'))
//     .map(file => file.substring(0, file.indexOf('.bpmn')));
// TODO temp to configure the viewport for each file
const diagrams = ['A.1.0', 'B.2.0', 'C.4.0'];

// configuration stores viewport
// TODO we currently use an arbitrary load configuration for fit. See if we need to configure it for each file and diagram
// TODO for files that contain several diagrams, need to list diagram index, dedicated viewport
const configuration = new Map<string, Configuration>([
    ['B.2.0', {viewport: { width: 2078, height: 1616 }}],
    ['C.4.0', {diagramsNumber: 4}],
    ['C.5.0', {diagramsNumber: 2}],
]);

const baseUrl = 'localhost:5173/index.html';

// playwright default
const defaultViewPort = { width: 1280, height: 720 };

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

        // TODO wait for generated element instead of waiting for 1 second (risk of flaky generation, see https://playwright.dev/docs/api/class-page#pagewaitfortimeouttimeout)
        // we do this in tests (for specific elements, this require data attribute that are not available in all versions or the attribute name changes from version to version
        // we could at least check mxgraph initialization (svg node in the bpmn-container, but it may not have the same id in all pages)
        // or check the existence of bpmn svg nodes (probably the easiest way as they will be present for all versions)
        console.info('Waiting for diagram rendering...');
        // TODO the 2nd group is not empty (should also be checked in the other tool)
        await page.waitForTimeout(1000);
        console.info('Wait done');

        // https://playwright.dev/docs/screenshots
        // TODO ensure no fullPage, configure css to make fitCenter work or configure viewport for each file
        // TODO when several bpmn diagram in a file, the file name must be prefix by '.<number>'
        const screenshotFileNamePostfix = diagramConfiguration?.diagramsNumber ? '-1' : '';
        await page.screenshot({path: `${outputDirectory}/${fileName}-import${screenshotFileNamePostfix}.png`, fullPage: true});
        console.info(`Screenshot generated for ${fileName}`);
        // TODO decide if we use need to use 'locator'
        // await page.locator('#bpmn-container').screenshot({path: `${outputDirectory}/${fileName}-import-1-alternative.png`});
    }

    // TODO properly exit the script
    await browser.close();
    process.exit(0);
})();

