var React = require("react");
var ControlLabel = require("react-bootstrap/lib/ControlLabel");
var Well = require("react-bootstrap/lib/Well");
var UserConfig = require("./UserConfig");
var ServerMessage = require("./ServerMessage");

module.exports = React.createClass({
  getInitialState: function(){
    return {
      serverMessage: ""
    }
  },

  showServerMessage: function(_serverMessage){
    this.setState({
      serverMessage: _serverMessage.charAt(0).toUpperCase() + _serverMessage.slice(1)
    })
  },

  render: function () {
    // <Panel bsStyle="primary" header={<h3>Create extension bundle</h3>}>
    return (
      <Well>
        <ControlLabel >Create extension bundle</ControlLabel>
        <UserConfig showServerMessage={this.showServerMessage} />
        <ServerMessage message={this.state.serverMessage} />
      </Well>
    );
  }
});