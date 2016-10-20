var React = require("react");
var Button = require("react-bootstrap/lib/Button");
var ServerSettings = require("./ServerSettings");

module.exports = React.createClass({
  getInitialState: function () {
    return {
      urlString: "",
      isPortalSelected: true
    }
  },

  componentDidMount: function () {
    // var socket = io.connect('http://localhost:3000/');
    // socket.on('update', function (data) {
    //   console.log("update: " + data.message);
    // });
  },

  selectEnvironment: function (isPortalSelected) {
    this.setState({
      isPortalSelected: isPortalSelected
    })
  },

  setServerUrl: function (url) {
    this.setState({
      urlString: url
    });
  },

  submitForm: function (event) {
    event.preventDefault();

    $.ajax({
      url: "/submit",
      dataType: 'json',
      type: 'POST',
      data: {
        urlString: this.state.urlString,
        isPortalSelected: true
      },
      success: function (data) {
        console.log("Form submission completed. Server replies: " + data.message);
      }.bind(this),
      error: function (xhr, status, err) {
        // code missing from server side 
        console.error("error from server: " + status + ", " + err.toString());
      }.bind(this)
    });
  },

  render: function () {
    return (
      <form onSubmit={this.submitForm}>
        <ServerSettings setServerUrl={this.setServerUrl} selectEnvironment={this.selectEnvironment} />
        <Button type="submit" disabled={!this.state.url} >Submit</Button>
      </form>
    );
  }
});

