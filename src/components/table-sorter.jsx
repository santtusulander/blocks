import React from 'react';

class TableSorter extends React.Component {
  constructor(props) {
    super(props);

    this.activateSort = this.activateSort.bind(this)
  }
  activateSort(e) {
    e.preventDefault()
    let direction = this.props.reversed ? -1 : 1
    if(this.props.column === this.props.activeColumn) {
      direction = -1 * this.props.activeDirection
    }
    this.props.activateSort(this.props.column, direction, this.props.sortFunc)
  }
  render() {
    const width = this.props.width
    let caret = ''
    if(this.props.column === this.props.activeColumn) {
      if(this.props.activeDirection < 0) {
        caret = <span className="caret up" />
      }
      else {
        caret = <span className="caret" />
      }
    }
    return (
      <th className="table-sorter" {...{ width }}>
        <a href="#"  className={caret ? ' active' : ''} onClick={this.activateSort}>
          {this.props.children}{caret}
        </a>
      </th>
    )
  }
}
TableSorter.displayName = 'TableSorter'
TableSorter.propTypes = {
  activateSort: React.PropTypes.func,
  activeColumn: React.PropTypes.string,
  activeDirection: React.PropTypes.number,
  children: React.PropTypes.node,
  column: React.PropTypes.string,
  reversed: React.PropTypes.bool,
  sortFunc: React.PropTypes.string,
  width: React.PropTypes.string
};

export default TableSorter
