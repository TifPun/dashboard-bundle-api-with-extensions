var React = require("react");

module.exports = React.createClass({

  render: function(){
    return (
      <ul>
        {
          this.props.servers.map(function(server){
            return (
                <li key={server} onClick={this.props.populateTextBox}>{server}</li>            
              )
          }.bind(this))
        }      
      </ul>
    );
  }
});