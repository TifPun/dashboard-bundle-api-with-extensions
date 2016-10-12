var React = require("react");
var Button = require("react-bootstrap/lib/Button");
var ServerSettings = require("./ServerSettings");

module.exports = React.createClass({
  getInitialState: function(){
    return {
      url: ""
    }
  },

  submitForm: function(event){
    event.preventDefault();

    // todo add logic to capture isPortalSelected
    // todo: change url to urlString 
    $.ajax({
      url: "/submit",
      dataType: 'json',
      type: 'POST',
      data: {
        url: this.state.url,
        isPortalSelected: true
      },
      success: function(data) {
        console.log(data.url);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

    // trim the url and remove leading and trailing spaces before sending to server
  },

  setServerUrl: function(url){
    this.setState({
      url: url
    });
  },

  render: function () {
    return (
      <form onSubmit={this.submitForm}>
        <ServerSettings setServerUrl={this.setServerUrl}/>
        <Button type="submit" disabled={!this.state.url} >Submit</Button>
      </form>
    );
  }
});

