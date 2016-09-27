var React = require("react");

module.exports = React.createClass({
  propType: function(){
    
  },

  getInitialState: function () {
    var initialMessage = "waiting for text input...";
    var message = initialMessage;
    return {
      initialMessage: initialMessage,
      message: message
    }
  },

  updateMessageDisplay: function (event) {
    if (this.state.message === this.state.initialMessage)
      this.state.message = "";

    this.setState({
      message: event.target.value
    })
  },

  render: function () {
    return (
      <div>
        <div>{this.state.message}</div>
        <input type="text" onChange={this.updateMessageDisplay}/>
      </div>
    );
  }
});