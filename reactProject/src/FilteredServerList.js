var React = require("react");
var ServerList = require("./ServerList");

module.exports = React.createClass({
  getInitialState: function () {
    return {
      servers: [
        "https://portalhostqa.ags.esri.com/gis/home",
        "https://portalhostds.ags.esri.com/gis/home",
        "https://portalfedqa.ags.esri.com/gis/home",
        "https://portalscsqa.ags.esri.com/gis/home"
      ], 
      url: ""
    }
  },

  componentWillMount: function () {
    this.setState({
      filteredList: this.state.servers
    })
  },

  filterItems: function (event) {
    this.setState({
      filteredList: this.state.servers.filter(function (server) {
        return server.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
      })
    })
  },

  populateTextBox: function(event){    
    this.setState({
      url: event.target.innerHTML
    })
  },

  render: function () {
    return (
      <div>
        <input type="text" placeholder="search" onChange={this.filterItems}/>
        <label>{this.state.url} is being selected</label>
        <ServerList servers={this.state.filteredList} populateTextBox={this.populateTextBox}/>
      </div>
    );
  }
});