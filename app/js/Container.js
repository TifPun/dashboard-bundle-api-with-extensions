var React = require("react");
var Jumbotron = require("react-bootstrap/lib/Jumbotron");
var PageHeader = require("react-bootstrap/lib/PageHeader"); 
var Form = require("./Form"); 
var ServerMessage = require("./ServerMessage");

module.exports = React.createClass({

  render: function(){
    return (
      <div className="container">
        <PageHeader>bundlr <br/> <small>(Bundle ArcGIS JSAPI with Ops Dashboard extensions)</small></PageHeader>
        <Jumbotron>
          <Form />
          <ServerMessage />
        </Jumbotron>
      </div>
    );
  }
}); 