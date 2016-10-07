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
    this.setState({
      isPortalSelected: event.target.id === "portal"
    });
  },

  // validateUrl: function (url) {
  //   // check if the url doesn't start with either http or https
  //   if (!url.startsWith("https:") && !url.startsWith("http:")) {
  //     this.props.setServerUrl();
  //     return;
  //   }

  //   // check if the URL contains a domain
  //   var urlDomain = url.split("//")[1];
  //   if (!urlDomain) {
  //     this.props.setServerUrl();
  //     return;
  //   }

  //   // validation is successful at this point if the host is a web server
  //   if (!this.state.isPortalSelected) {
  //     this.props.setServerUrl(url);
  //     return;
  //   }

  //   // check if the portal URL contains a domain portion and a web adapter portion  
  //   if (urlDomain.indexOf("/") === -1) {
  //     this.props.setServerUrl();
  //     return;
  //   }

  //   // check if the web adapter portion is missing
  //   if (!urlDomain.split("/")[1]) {
  //     this.props.setServerUrl();
  //     return;
  //   }

  //   this.props.setServerUrl(url);
  // },

  render: function () {
    // <UrlSetting isPortalSelected={this.state.isPortalSelected} handleUrlChange={this.props.setServerUrl} /> 
    return (
      <FormGroup controlId = "serverSettings" >
        <ControlLabel > Choose where the extensions will be hosted</ControlLabel>
        <FormGroup >
          <Radio inline name = "serverOption" id = "portal" checked = { this.state.isPortalSelected } onChange = { this.onServerOptionChanged } >
            ArcGIS Portal
          </Radio>
          <Radio inline name = "serverOption" id = "webServer" checked = { !this.state.isPortalSelected } onChange = { this.onServerOptionChanged } >
            Web server
          </Radio>
        </FormGroup>

        <UrlSetting isPortalSelected={this.state.isPortalSelected} onUrlChange={this.props.setServerUrl} />
      </FormGroup>
    );
  }
});