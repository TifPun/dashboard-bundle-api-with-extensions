var React = require("react");
var FormGroup = require("react-bootstrap/lib/FormGroup");
var ControlLabel = require("react-bootstrap/lib/ControlLabel");
var FormControl = require("react-bootstrap/lib/FormControl");

module.exports = React.createClass({
  // getInitialState: function(){
  //   return {
  //     url: ""
  //   }
  // },

  returnLabelText: function () {
    return this.props.isPortalSelected === true ?
      "Enter ArcGIS Portal URL" : "Enter web server URL";
  },

  returnPlaceHolder: function () {
    return this.props.isPortalSelected === true ?
      "https://portal.domain.com/webadapter" : "https://eden.esri.com/sandbox/tif";
  },

  validateUrl: function (url) {
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
    var url = event.target.value;

    var validateOk = this.validateUrl(url); 
    // console.log("validateOK " + validateOk);

    if (this.validateUrl(url))
      this.props.onUrlChange(url);
    else 
      this.props.onUrlChange();

    // this.setState({
    //   url: ""
    // })
  },

  render: function () {
    return (
      <FormGroup controlId="serverUrl">
        <ControlLabel>
          { this.returnLabelText() }
        </ControlLabel>
        <FormControl type="text" placeholder={ this.returnPlaceHolder() } onChange={this.onUrlChange}/>
      </FormGroup>
    );
  }
});