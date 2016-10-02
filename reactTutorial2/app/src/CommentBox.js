var React = require("react");
var CommentList = require("./CommentList");
var CommentForm = require("./CommentForm");

module.exports = React.createClass({
  getInitialState: function(){
    return {
      data: []
    }
  },

  loadCommentsFromServer: function(){
    $.ajax({
      url: "/api/comments",
      dataType: "json",
      cache: false, 
      success: function(data){
        this.setState({
          data: data
        })
      }.bind(this),
      error: function(xhr, status, err){
        console.log("/api/comments", status, err.toString());
      }.bind(this)
    });
  },

  componentWillMount: function(){
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, 5000);
  },

  postComment: function(comment){
    // var comments = this.state.data;
    // comment.id = Date.now();
    // var newComments = comments.concat([comment]);
    // this.setState({data: newComments});

     $.ajax({
      url: "api/comments",
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        // this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function () {

    return (
      <div>
        <CommentList comments={this.state.data}/>
        <CommentForm postComment={this.postComment}/>
      </div>
    );
  }
});