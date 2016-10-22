var React = require("react");
var FormGroup = require("react-bootstrap/lib/FormGroup");
var ControlLabel = require("react-bootstrap/lib/ControlLabel");
var FormControl = require("react-bootstrap/lib/FormControl");
var Radio = require("react-bootstrap/lib/Radio");
var UrlSetting = require("./UrlSetting");

module.exports = React.createClass({
  getInitialState: function () {
    return {
      isPortalSelected: true
    }
  },

  onServerOptionChanged: function (event) {
    this.state.isPortalSelected = event.target.id === "portal";

    this.props.selectEnvironment(this.state.isPortalSelected);
  },

  render: function () {
    return (
      <FormGroup controlId="serverSettings" >
        <ControlLabel > Choose where the extensions will be hosted</ControlLabel>
        <FormGroup >
          <Radio inline name="serverOption" id="portal" checked={this.state.isPortalSelected} onChange={this.onServerOptionChanged} >
            ArcGIS Portal
          </Radio>
          <Radio inline name="serverOption" id="webServer" checked={!this.state.isPortalSelected} onChange={this.onServerOptionChanged} >
            Web server
          </Radio>
        </FormGroup>

        <UrlSetting isPortalSelected={this.state.isPortalSelected} onUrlChange={this.props.setServerUrl} />
      </FormGroup>
    );
  }
});