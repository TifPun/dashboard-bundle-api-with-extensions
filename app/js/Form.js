var React = require("react");
var Button = require("react-bootstrap/lib/Button");
var ServerSettings = require("./ServerSettings");

module.exports = React.createClass({
  getInitialState: function () {
    return {
      url: ""
    }
  },

  componentDidMount: function () {
    var socket = io.connect('http://localhost:3000/');
    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });
  },

  submitForm: function (event) {
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
      success: function (data) {
        // console.log(data.url);
        console.log("got response from server: " + data);
      }.bind(this),
      error: function (xhr, status, err) {

        // this.props.url, status, 
        console.error("error from server: " + status + ", " + err.toString());
      }.bind(this)
    });

    // trim the url and remove leading and trailing spaces before sending to server
  },

  setServerUrl: function (url) {
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

