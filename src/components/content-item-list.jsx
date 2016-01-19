import React from 'react'

class ContentItemList extends React.Component {
  constructor(props) {
    super(props);

    this.deleteAccount = this.deleteAccount.bind(this)
  }
  deleteAccount(e) {
    e.stopPropagation()
    e.preventDefault()
    this.props.delete(this.props.id)
  }
  render() {
    return (
      <div className="content-item-list" onClick={this.props.toggleActive}>
        <div className="content-item-list-row">
          <div className="content-item-details">
            <div>{this.props.id}</div>
            <div className="content-item-list-name">{this.props.name}</div>
            <div>{this.props.description}</div>
            <a href="#" onClick={this.deleteAccount}>Delete</a>
          </div>
        </div>
      </div>
    )
  }
}

ContentItemList.displayName = 'ContentItemList'
ContentItemList.propTypes = {
  delete: React.PropTypes.func,
  description: React.PropTypes.string,
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  toggleActive: React.PropTypes.func
}

module.exports = ContentItemList
