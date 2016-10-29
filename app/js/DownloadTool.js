var React = require("react");
var Well = require("react-bootstrap/lib/Well");
var ControlLabel = require("react-bootstrap/lib/ControlLabel");
var FormControl = require("react-bootstrap/lib/FormControl");
var Button = require("react-bootstrap/lib/Button");

module.exports = React.createClass({
  componentWillMount: function () {
    if (this.props.isPortalSelected) {
      this.configs = {
        extensionsDir: "jsapi-bundled",
        host: "Portal for ArcGIS installation directory",
        parentFolder: "[InstallDir]\arcgis\portal\apps\dashboard\extensions"
      }
    }
    else {
      this.configs = {
        extensionsDir: "opsDashboardExtensions",
        host: "web server directory",
        parentFolder: this.props.extensionsParentFolder
      }
    }
  },

  render: function () {
    // <Panel bsStyle="primary" header={<h3>Deploy extensions</h3>}>
    return (
      <Well>
        <ControlLabel > Deploy extensions</ControlLabel>
        <FormControl.Static>Extension has been created successfully with the ArcGIS JSAPI bundled. Follow the steps below to finish the deployment</FormControl.Static>
        <ol>
          <li><a href="/downloadOutput">Download the extensions from here</a></li>
          <li>Unzip the folder</li>
          <li>Copy the <b>{this.configs.extensionsDir}</b> folder to your {this.configs.host} under <b>{this.configs.extensionsParentFolder}</b></li>
        </ol>
      </Well>
    )
  }
});