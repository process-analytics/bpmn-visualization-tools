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

// manage file copy from 'miwg-test-suite/Reference' to the 'public' folder by providing the MIWG_TEST_SUITE_PATH environment variable
const pathToMiwgTestSuiteDirectory = process.env.MIWG_TEST_SUITE_PATH;
if (!pathToMiwgTestSuiteDirectory) {
    throw new Error(`Pass the 'MIWG_TEST_SUITE_PATH' environment variable`);

}

// ensure source exist
const pathToReferenceDirectory = `${pathToMiwgTestSuiteDirectory}/Reference`;
const isSourceExist = fs.existsSync(pathToReferenceDirectory);
if (!isSourceExist) {
    throw new Error(`migw-test-suite Reference directory does not exist: ${pathToReferenceDirectory}`);
}

const bpmnDestinationDirectory = 'public';
fs.rmSync(bpmnDestinationDirectory, {recursive: true, force: true});
fs.mkdirSync(bpmnDestinationDirectory, {recursive: true});

// get the list of BPMN files in the source directory
const bpmnFiles = fs.readdirSync(pathToReferenceDirectory)
    .filter(file => file.endsWith('.bpmn'));

console.info(`Copying files from ${pathToReferenceDirectory} to ${bpmnDestinationDirectory}`);
for (const bpmnFile of bpmnFiles) {
    console.info(`File ${bpmnFile}`);
    fs.copyFileSync(`${pathToReferenceDirectory}/${bpmnFile}`, `${bpmnDestinationDirectory}/${bpmnFile}`);
}
console.info('Copy done');
