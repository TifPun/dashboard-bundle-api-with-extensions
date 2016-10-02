var React = require("react");
var Comment = require("./Comment");

module.exports = React.createClass({

  componentDidMount: function () {
  },

  render: function () {
    var commentNodes = this.props.comments.map(function (comment) {
      return <Comment key={comment.id} author={comment.author} text={comment.text} />
    });

    return (
      <div>
        <h4>Comments from customers:</h4>        
        {commentNodes}
      </div>
    )
  }
});