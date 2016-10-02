var React = require("react");

module.exports = React.createClass({
  getInitialState: function(){
    return {
      author: "",
      text: ""
    }
  },

  authorChange: function(event){
    this.setState({
      author: event.target.value
    });
  },

  textChange: function(event){
    this.setState({
      text: event.target.value
    })
  },

  postComment: function(event){
    event.preventDefault();
    this.props.postComment({
      author: this.state.author,
      text: this.state.text
    });
    this.setState({
      author: "",
      text: ""
    })
  },
  
  render: function(){
    return (
      <form onSubmit={this.postComment}>
        <h4>What's your thought?</h4>      
        <input type="textbox" placeholder="your name" value={this.state.author} onChange={this.authorChange}/>
        <input type="textbox" placeholder="comment" value={this.state.text} onChange={this.textChange}/>
        <input type="submit" value="Post New"/>
      </form>
    );
  }
});