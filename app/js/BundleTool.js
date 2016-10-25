var React = require("react");
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
    return (
      <Well>
        <UserConfig showServerMessage={this.showServerMessage} />
        <ServerMessage message={this.state.serverMessage} />
      </Well>
    );
  }
});