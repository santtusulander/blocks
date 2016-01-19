import React from 'react'

class ContentItemChart extends React.Component {
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
      <div className="content-item-chart" onClick={this.props.toggleActive}>
        <div className="glow"></div>
        <div className="circle-base">
          <div className="circle-gradient"></div>
          <div className="text-content">
            <div className="content-item-traffic">
              <div className="traffic-total">1234</div>
              <div className="traffic-suffix">Mbps</div>
            </div>
            <div className="content-item-hits">
              <div className="hits-total">1234</div>
              <div className="hits-suffix">hits/s</div>
            </div>
            <div className="content-item-chart-name">{this.props.name}</div>
            <div className="content-item-last-modified">Yesterday</div>
            <div>{this.props.description}</div>
            <div>{this.props.id}</div>
            <a href="#" onClick={this.deleteAccount}>Delete</a>
          </div>
        </div>
      </div>
    )
  }
}

ContentItemChart.displayName = 'ContentItemChart'
ContentItemChart.propTypes = {
  delete: React.PropTypes.func,
  description: React.PropTypes.string,
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  toggleActive: React.PropTypes.func
}

module.exports = ContentItemChart
