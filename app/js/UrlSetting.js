var React = require("react");
var FormGroup = require("react-bootstrap/lib/FormGroup");
var ControlLabel = require("react-bootstrap/lib/ControlLabel");
var FormControl = require("react-bootstrap/lib/FormControl");

module.exports = React.createClass({
  getInitialState: function () {
    return {
      url: ""
    }
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (prevProps.isPortalSelected != this.props.isPortalSelected) {
      this.notifyParentOnUrlChange();
    }
  },

  returnLabelText: function () {
    return this.props.isPortalSelected === true ?
      "Enter ArcGIS Portal URL" : "Enter web server URL";
  },

  getPlaceHolder: function () {
    return this.props.isPortalSelected === true ?
      "https://portal.domain.com/webadapter" : "https://eden.esri.com/sandbox/tif";
  },

  notifyParentOnUrlChange: function () {
    var validateOk = this.validateUrl();

    if (validateOk)
      this.props.onUrlChange(this.state.url);
    else
      this.props.onUrlChange();
  },

  validateUrl: function () {
    var url = this.state.url;

    // check if the url doesn't start with either http or https
    if (!url.startsWith("https:") && !url.startsWith("http:"))
      return false;

    // check if the URL contains a domain
    var urlDomain = url.split("//")[1];
    if (!urlDomain)
      return false;

    // validation is successful at this point if the host is a web server
    if (!this.props.isPortalSelected)
      return true;

    // check if the portal URL contains a domain portion and a web adapter portion  
    if (urlDomain.indexOf("/") === -1)
      return false;

    // check if the web adapter portion is missing
    if (!urlDomain.split("/")[1])
      return false;

    return true;
  },

  onUrlChange: function (event) {
    this.state.url = event.target.value;

    this.notifyParentOnUrlChange();
  },

  render: function () {
    return (
      <FormGroup controlId="serverrl">
        <ControlLabel>{this.returnLabelText()}</ControlLabel>
        <FormControl type="text" placeholder={this.getPlaceHolder()} onChange={this.onUrlChange} />
      </FormGroup>
    );
  }
});

