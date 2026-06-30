import './style.css'
import {BpmnVisualization, FitType} from "bpmn-visualization";

const bpmnVisualization = new BpmnVisualization({container: 'bpmn-container', renderer: {ignoreBpmnColors: false}});

const fetchBpmnContent = async (url: string) => {
    let response: Response;
    try {
        response = await fetch(url);
    } catch (error) {
        throw new Error(`Unable to fetch ${url}. ${error}`);
    }
    if (!response.ok) {
        throw new Error(`Unable to fetch ${url}. Error: ${response.status}`);
    }
    return response.text();
};


const parameters = new URLSearchParams(window.location.search);
const bpmnFileName = parameters.get('bpmnFileName');

const bpmn = await fetchBpmnContent(`/${bpmnFileName}.bpmn`);
bpmnVisualization.load(bpmn, {
    fit: {
        type: FitType.Center,
        margin: 10
    }
});
