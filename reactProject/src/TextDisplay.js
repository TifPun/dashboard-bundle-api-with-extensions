var React = require("react");

module.exports = React.createClass({

  getInitialState: function () {
    return {
      initialMessage: "waiting for text input..."
    }
  },

  componentWillMount: function () {
    this.setState({
      message: this.state.initialMessage
    });
  },

  updateMessageDisplay: function (event) {
    if (event.target.value === "")
      this.setState({ message: this.state.initialMessage });
    else
      this.setState({ message: event.target.value });
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