import './style.css'
import {BpmnVisualization, FitType} from "bpmn-visualization";

const bpmnVisualization = new BpmnVisualization({container: 'bpmn-container', renderer: {ignoreBpmnColors: false}});

const fetchBpmnContent = (url: string) => fetch(url)
    .then(response => {
        if (!response.ok) {
            throw Error(String(response.status));
        }
        return response.text();
    })
    .catch(error => {
        throw new Error(`Unable to fetch ${url}. ${error}`);
    });


const parameters = new URLSearchParams(window.location.search);
const bpmnFileName = parameters.get('bpmnFileName');

fetchBpmnContent(`/${bpmnFileName}.bpmn`).then(bpmn => bpmnVisualization.load(bpmn, {
    fit: {
        type: FitType.Center,
        margin: 10
    }
}));
