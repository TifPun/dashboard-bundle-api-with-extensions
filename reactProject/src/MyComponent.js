var React = require("react");

module.exports = React.createClass({
  getInitialState: function(){
    return {
      count: 2016
    }
  },

  getDefaultProps: function(){

  },

  render: function(){
    return <b>Hello world from {this.props.name} @ {this.state.count}</b>;
  }
});