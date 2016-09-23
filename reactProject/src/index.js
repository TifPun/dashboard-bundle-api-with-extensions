var ReactDOM = require("react-dom");
var React = require("react");
var MyComponent = require("./MyComponent")
var Counter = require("./Counter")
var FilteredList = require("./FilteredList")

ReactDOM.render(<MyComponent name="Esri"/>, document.getElementById("mount-point-message"));

ReactDOM.render(<Counter/>, document.getElementById("mount-point-counter"));

ReactDOM.render(<FilteredList/>, document.getElementById("mount-point-filteredList"));