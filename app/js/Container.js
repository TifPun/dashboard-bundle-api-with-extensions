var React = require("react");
var Jumbotron = require("react-bootstrap/lib/Jumbotron");
var PageHeader = require("react-bootstrap/lib/PageHeader"); 
var Form = require("./Form"); 

module.exports = React.createClass({

  render: function(){
    return (
      <div className="container">
        <PageHeader>bundlr <br/> <small>(Bundles ArcGIS JSAPI with Ops Dashboard extensions)</small></PageHeader>
        <Jumbotron>
          <Form />
        </Jumbotron>
      </div>
    );
  }
}); 