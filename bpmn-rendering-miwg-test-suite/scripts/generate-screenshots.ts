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
     * The id of the BPMN element present in the diagram that is used to detect that the diagram has been rendered.
     */
    checkedBpmnElementId?: string;
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
    ['A.1.0', {
        checkedBpmnElementId: '_e70a6fcb-913c-4a7b-a65d-e83adc73d69c', // Task 3
        viewport: {width: 771, height: 111}
    }],
    ['A.2.0', {
        checkedBpmnElementId: '_258f51eb-b764-4a71-b681-3a01cca14143', // End Event
        viewport: {width: 810, height: 343}
    }],
    ['A.2.1', {
        checkedBpmnElementId: ' _To9Z2TOCEeSknpIVFCxNIQ', // Gateway&#10;(Merge Flows)
    }],
    ['A.3.0', {
        checkedBpmnElementId: '_1ac4b759-40e3-4dfb-b0e3-ad1d201d6c3d', // sequence flow
        viewport: {width: 770, height: 440}
    }],
    ['A.4.0', {
        checkedBpmnElementId: '_ee35fa2c-dfea-40cf-a469-845b765a7b50', // Expanded Sub-Process 1
        viewport: {width: 1222, height: 807}
    }],
    ['A.4.1', {
        checkedBpmnElementId: 'sid-70D2F83B-77E6-4301-835C-AFF6357344F8', // Start Event 1
        viewport: {width: 1284, height: 1037}
    }],
    ['B.1.0', {
        checkedBpmnElementId: '_bd04180e-49f6-4cf0-a7d6-da59e2840b4b', // Group
        viewport: {width: 1103, height: 1011}
    }],
    ['B.2.0', {
        checkedBpmnElementId: '_1237e756-d53c-4591-a731-dafffbf0b3f9', // Collapsed Call Activity
        viewport: {width: 1926, height: 1413}
    }],
    ['C.1.0', {
        checkedBpmnElementId: 'sid-05039C4F-59F7-4CBD-8C84-D35E27C7B5EF', // Scan Invoice
    }],
    ['C.1.1', {
        checkedBpmnElementId: 'invoice_approved', // Invoice Approved (Gateway)
    }],
    ['C.2.0', {
        checkedBpmnElementId: '_2f24e6da-b44f-4e30-8d85-fd35fd56e209', // Pay Order
    }],
    ['C.3.0', {
        checkedBpmnElementId: '_a92069f7-377b-4dbd-a1fd-1da071aabf6d', // Replace fridge
    }],
    ['C.4.0', {
        diagramsNumber: 4,
        //  configuration only for the first diagram (other viewports will be configured later when we support the rendering of more diagrams)
        checkedBpmnElementId: '_f9e3cd76-809a-48b5-be1c-e84fc4324268', // 'Contract terms accepted ?"
        viewport: {width: 2240, height: 800}
    }],
    ['C.5.0', {diagramsNumber: 2,
        //  configuration only for the first diagram (other viewports will be configured later when we support the rendering of more diagrams)
        checkedBpmnElementId: '_05a1a66a-9308-41c7-a611-4fc57627a058', // End business relation
        viewport: {width: 3821, height: 984}}],
    ['C.6.0', {
        checkedBpmnElementId: '_b595ec43-0769-4864-8f2e-403c405c8217', // Book Hotel
        viewport: {width: 2081, height: 942}
    }],
    ['C.7.0', {
        checkedBpmnElementId: '_64eabfe9-6947-43eb-ac45-8d331745f86c', // Publish on &#10;homepage
    }],
    ['C.8.0', {
        checkedBpmnElementId: '_a97c1a48-faba-447b-bfa6-7aa81a6fe0a0', // Notify Employee of Approval
        viewport: {width: 2158, height: 850}
    }],
    ['C.8.1', {
        checkedBpmnElementId: '_1a818a94-ba6f-413b-a7e8-6f8fd2a11e32', // Vacation Approval
        viewport: {width: 1920, height: 800}
    }],
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

        const checkedBpmnElementId = diagramConfiguration?.checkedBpmnElementId;
        console.info(`Waiting for diagram rendering, expected BPMN element '${checkedBpmnElementId}' to be present...`);
        // await expect(page.locator..).toBeVisible()
        // workaround to wait for the locator to be available https://github.com/microsoft/playwright/issues/9179#issuecomment-928549627
        // There are 2 SVG elements, one for the shape and one for the label. Exclude the element related to the label (it is identified with a bpmn-label CSS class). Otherwise, playwright complains
        // locator.elementHandle: Error: strict mode violation: locator('#bpmn-container svg g g:nth-child(2) g[data-bpmn-id=_1237e756-d53c-4591-a731-dafffbf0b3f9]') resolved to 2 elements:
        //     1) <g transform="translate(0.5,0.5)" class="bpmn-type-…>…</g> aka locator('g:nth-child(101)')
        //     2) <g data-bpmn-id="_1237e756-d53c-4591-a731-dafffbf0b…>…</g> aka locator('g').filter({ hasText: 'Collapsed Call Activity' }).nth(2)
        await page.locator(`#bpmn-container svg g g:nth-child(2) g[data-bpmn-id=${checkedBpmnElementId}]:not(.bpmn-label)`).elementHandle({timeout: 2_000});
        console.info('Found BPMN element');

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

