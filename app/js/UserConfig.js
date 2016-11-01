var React = require("react");
var Button = require("react-bootstrap/lib/Button");
var ServerSettings = require("./ServerSettings");

module.exports = React.createClass({
  getInitialState: function () {
    return {
      urlString: "",
      isPortalSelected: true,
      isBundling: false
    }
  },

  componentDidMount: function () {
    var socket = io.connect('http://localhost:3000/');
    socket.on("update", function (data) {
      this.showServerMessage(data);
    }.bind(this));

    socket.on("serverNotBusy", function (data) {
      this.showServerMessage(data);
      this.setIsBundling(false);

      if(data.success)
        this.props.showDownloadUI();
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

    this.props.hideDownloadUI();

    $.ajax({
      url: "/submit",
      dataType: "json",
      type: "POST",
      data: {
        urlString: this.state.urlString,
        isPortalSelected: this.state.isPortalSelected
      },
      beforeSend: function (xhrObj) {
        this.setIsBundling(true);
      }.bind(this),
      success: function (data) {
        this.props.showUserConfig(this.state.isPortalSelected, data.message);
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
        <Button type="submit" disabled={!this.state.urlString || this.state.isBundling} >Submit</Button>
      </form>
    );
  },

  setIsBundling: function (setting) {
    this.setState({
      isBundling: setting
    });
  }
});

