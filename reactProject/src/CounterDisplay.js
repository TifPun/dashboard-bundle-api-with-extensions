var React = require("react");

module.exports = React.createClass({
  
  propTypes: {
    counterProp: React.PropTypes.number.isRequired,
    incrementCount: React.PropTypes.func.isRequired,
    decrementCount: React.PropTypes.func.isRequired
  },

  render: function(){
    return (
      <div>
        <button onClick={this.props.incrementCount}>+</button>
        <button onClick={this.props.decrementCount}>-</button>
        {this.props.counterProp}
      </div>
    );
  }
});