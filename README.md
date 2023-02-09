# Internal tools for bpmn-visualization

- [bpmn-visualization-svg-screenshots](bpmn-visualization-svg-screenshots): explain how to do SVG screenshots/exports of bpmn-visualization demo
- [bpmn-rendering-from-version-to-version](bpmn-rendering-from-version-to-version/README.md): Generate screenshots of BPMN
  Diagram rendering of the migw-test-suite B.2.0 reference file with various bpmn-visualization versions.
- [bpmn-rendering-miwg-test-suite](bpmn-rendering-miwg-test-suite/README.md): Generate screenshots of BPMN 
Diagram rendering of all reference files from the miwg-test-suite project. It helps to publish the results for a given
bpmn-visualization version.

## Release process

Go to [GitHub release](https://github.com/process-analytics/bpmn-visualization-tools/releases)

Then
- create a new draft release
- for tag, use **v**x.y.z (do not forget the 'v' prefix)
- for name, same value as tag without the 'v'
- use the auto-generated release notes (do some cleanup if necessary)
- publish to create the git tag and make the release publicly available
