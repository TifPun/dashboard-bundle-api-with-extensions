var React = require("react");
var Well = require("react-bootstrap/lib/Well");
var PageHeader = require("react-bootstrap/lib/PageHeader"); 
var Form = require("./Form"); 
var ServerMessage = require("./ServerMessage");

module.exports = React.createClass({
  getInitialState: function(){
    return {
      serverMessage: ""
    }
  },

  showServerMessage: function(_serverMessage){
    this.setState({
      serverMessage: _serverMessage
    })
  },

  render: function(){
    return (
      <div className="container">
        <PageHeader>bundlr <br/> <small>(Bundle ArcGIS JSAPI with Ops Dashboard extensions)</small></PageHeader>
        <Well>
          <Form showServerMessage={this.showServerMessage}/>
          <ServerMessage message={this.state.serverMessage}/>
        </Well>
      </div>
    );
  }
}); 