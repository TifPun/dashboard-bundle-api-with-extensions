var React = require("react");
var Remarkable = require("Remarkable");

module.exports = React.createClass({

  render: function(){
    return (
      <div className="comment">
        <span>{this.props.author} {': '} {this.props.text}</span> 
      </div>
    )
  }
});