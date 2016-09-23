var React = require("react");
var List = require("./List");

module.exports = React.createClass({
  filterList: function(event){
    var updatedList = this.state.initialItems;
    updatedList = updatedList.filter(function(item){
      return item.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });

    // update state
    this.setState({
      items: updatedList
    });
  },

  getInitialState: function(){
    // host ready
    return {
      initialItems: [
        "Apples",
        "Broccoli",
        "Chicken",
        "Duck",
        "Eggs",
        "Fish",
        "Granola",
        "Hash Browns"
      ],
      items: []
    }
  },

  componentWillMount: function(){
    // postCreate. setState
    this.setState({
      items: this.state.initialItems
    });
  },

  render: function(){
    return (
      <div className="filter-list">
        <input type="text" placeholder="Search" onChange={this.filterList}/>
        <List items={this.state.items}/>
      </div>
    );
  }
});