var React = require("react");
var FormGroup = require("react-bootstrap/lib/FormGroup");
var FormControl = require("react-bootstrap/lib/FormControl");

module.exports = React.createClass({

  render: function () {
    return (
      <FormGroup controlId="serverMessage">
        <FormControl.Static>
          {this.props.message}
        </FormControl.Static>
      </FormGroup>
    );
  }
})