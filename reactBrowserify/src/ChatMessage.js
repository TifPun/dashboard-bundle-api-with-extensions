var React = require("react"); // have been npm-ed

module.exports = React.createClass({
  render: function() {
    return <p>{this.props.message}</p>;
  }
});