var React = require("react");
// var Well = require("react-bootstrap/lib/Well");
var PageHeader = require("react-bootstrap/lib/PageHeader"); 
// var UserConfig = require("./UserConfig"); 
// var ServerMessage = require("./ServerMessage");
var BundleTool = require("./BundleTool");

module.exports = React.createClass({

  render: function(){
    return (
      <div className="container">
        <PageHeader>bundlr <br/> <small>(Bundle ArcGIS JSAPI with Ops Dashboard extensions)</small></PageHeader>
        <BundleTool />
      </div>
    );
  }
}); 