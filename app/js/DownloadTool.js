var React = require("react");
var Well = require("react-bootstrap/lib/Well");
var ControlLabel = require("react-bootstrap/lib/ControlLabel");
var FormControl = require("react-bootstrap/lib/FormControl");
var Button = require("react-bootstrap/lib/Button");

module.exports = React.createClass({
  downloadError: function () {
    // todo how to test this?
    // console.log("download error");
    alert("download error");
  },

  render: function () {
    if (this.props.isPortalSelected) {
      this.configs = {
        extensionsDir: "jsapi-bundled",
        host: "Portal for ArcGIS installation directory",
        parentFolder: " under [InstallDir]\\arcgis\\portal\\apps\\dashboard\\extensions"
      }
    }
    else {
      this.configs = {
        extensionsDir: "opsDashboardExtensions",
        host: "web server directory",
        parentFolder: ""
      }
    }

    var style = {
      "overflowWrap": "break-all",
      "wordWrap": "break-all"
    }

    // <Panel bsStyle="primary" header={<h3>Deploy extensions</h3>}>
    return (
      <Well>
        <ControlLabel > Deploy extensions</ControlLabel>
        <FormControl.Static>Extension has been created successfully with the ArcGIS JSAPI bundled. Follow the steps below to finish the deployment:</FormControl.Static>
        <ol>
          <li>Download the extensions from <a href="/downloadOutput" onError={this.downloadError}>here</a>.</li>
          <li>Unzip the folder.</li>
          <li>Copy the <b>{this.configs.extensionsDir}</b> folder to your {this.configs.host}{this.configs.parentFolder}.
            {!this.props.isPortalSelected ? " Make sure your web server is anonymously accessible." : ""}</li>
          <li>You should now be able to access each extension via <b style={style}>{this.props.extensionsUrl}&lt;extensionFolder&gt;/&lt;extensionName&gt;.json</b>.
           Follow <a href="#">this doc</a> to register the extensions to your ArcGIS organization.</li>
        </ol>
      </Well>
    )
  }
});