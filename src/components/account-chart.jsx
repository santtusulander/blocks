import React from 'react'

class AccountChart extends React.Component {
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
      <div className="account-chart" onClick={this.props.toggleActive}>
        <div className="glow"></div>
        <div className="circle-base">
          <div className="circle-gradient"></div>
          <div className="text-content">
            <div className="account-chart-id">{this.props.id}</div>
            <div className="account-chart-name">{this.props.name}</div>
            <div className="account-chart-description">{this.props.description}</div>
            <a href="#" onClick={this.deleteAccount}>
              <div>Delete</div>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

AccountChart.displayName = 'AccountChart'
AccountChart.propTypes = {
  delete: React.PropTypes.func,
  description: React.PropTypes.string,
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  toggleActive: React.PropTypes.func
}

module.exports = AccountChart
