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
    var socket = io.connect('http://localhost:3000/');
    socket.on('update', function (data) {
      this.showServerMessage(data);
    }.bind(this));
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

  showServerMessage: function (data) {
    if (data && data.message)
      this.props.showServerMessage(data.message);
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
        this.showServerMessage(data);
      }.bind(this),
      error: function (xhr, status, err) {
        // todo: need to revise if this is a good way to handle error 
        // read: 
        // https://webapplog.com/error-handling-and-running-an-express-js-app/
        // http://stackoverflow.com/questions/20902144/sending-custom-error-message-from-express-js-over-to-backbone
        this.showServerMessage(xhr.responseJSON);
      }.bind(this)
    });
  },

  render: function () {
    return (
      <form onSubmit={this.submitForm}>
        <ServerSettings setServerUrl={this.setServerUrl} selectEnvironment={this.selectEnvironment} />
        <Button type="submit" disabled={!this.state.urlString} >Submit</Button>
      </form>
    );
  }
});

