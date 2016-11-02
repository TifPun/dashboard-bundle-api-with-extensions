var React = require("react");
var ControlLabel = require("react-bootstrap/lib/ControlLabel");
var Well = require("react-bootstrap/lib/Well");
var UserConfig = require("./UserConfig");
var ServerMessage = require("./ServerMessage");
var DownloadTool = require("./DownloadTool");

module.exports = React.createClass({
  getInitialState: function () {
    return {
      isPortalSelected: "",
      extensionsUrl: "",
      serverMessage: "",
      canDownload: false
    }
  },

  showServerMessage: function (_serverMessage) {
    this.setState({
      serverMessage: _serverMessage.charAt(0).toUpperCase() + _serverMessage.slice(1)
    });
  },

  showUserConfig: function (_isPortalSelected, _extensionsUrl) {
    this.setState({
      isPortalSelected: _isPortalSelected,
      extensionsUrl: _extensionsUrl
    });
  },

  showDownloadUI: function () {
    this.setState({
      canDownload: true
    });
  },

  hideDownloadUI: function () {
    this.setState({
      canDownload: false
    });
  },

  render: function () {
    // <Panel bsStyle="primary" header={<h3>Create extension bundle</h3>}>
    return (
      <div>
        <Well>
          <ControlLabel >Create extension bundle</ControlLabel>
          <UserConfig showServerMessage={this.showServerMessage} showUserConfig={this.showUserConfig} showDownloadUI={this.showDownloadUI} hideDownloadUI={this.hideDownloadUI} />
          <ServerMessage message={this.state.serverMessage} />
        </Well>

        // {this.state.canDownload ? <DownloadTool isPortalSelected={this.state.isPortalSelected} extensionsUrl={this.state.extensionsUrl} /> : null}
        <DownloadTool isPortalSelected={this.state.isPortalSelected} extensionsUrl={this.state.extensionsUrl} />
      </div>
    );
  }
});