var ReactDOM = require("react-dom");
var React = require("react");
var MyComponent = require("./MyComponent")
var Counter = require("./Counter")
var FilteredList = require("./FilteredList")
var TextDisplay = require("./TextDisplay")

ReactDOM.render(<MyComponent name="Esri"/>, document.getElementById("mount-point-intro"));

ReactDOM.render(<TextDisplay/>, document.getElementById("mount-point-message"));

ReactDOM.render(<Counter name="Counter"/>, document.getElementById("mount-point-counter"));

ReactDOM.render(<FilteredList/>, document.getElementById("mount-point-filteredList"));