var React = require("react");
var CounterDisplay = require("./CounterDisplay");

module.exports = React.createClass({
  getInitialState: function () {
    return {
      count: 0
    }
  },

  getDefaultProps: function(){
    return {
      name: "Default Name Prop"
    }
  },

  handleIncrement: function () {
    this.setState({ count: this.state.count + 1 });
  },

  handleDecrement: function () {
    this.setState({ count: this.state.count - 1 });
  },

  incrementCount: function () {
    this.setState({
      count: this.state.count + 1
    });
  },

  render: function () {
    return (
      <div>
        <p/>
        <div>this.props.name: {this.props.name}</div>
        <button type="button" onClick={this.incrementCount}>Increment</button>
        <span>{this.state.count}</span>
        <CounterDisplay counterProp={this.state.count} incrementCount={this.handleIncrement} decrementCount={this.handleDecrement}></CounterDisplay>        
      </div>
    );
  }
});