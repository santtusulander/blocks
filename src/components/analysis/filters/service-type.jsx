import React from 'react'
import Immutable from 'immutable'
import { Input } from 'react-bootstrap'

export class FilterServiceType extends React.Component {
  render() {
    return (
      <div>
        <div className="sidebar-section-header">
          HTTP/HTTPS
        </div>
        <div className="sidebar-content">
          <Input type="checkbox" label="HTTP"
            checked={this.props.serviceTypes.includes('http')}
            onChange={this.props.toggleServiceType('http')}/>
          <Input type="checkbox" label="HTTPS"
            checked={this.props.serviceTypes.includes('https')}
            onChange={this.props.toggleServiceType('https')}/>
        </div>
      </div>
    );
  }
}

FilterServiceType.displayName = 'FilterServiceType'
FilterServiceType.propTypes = {
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  toggleServiceType: React.PropTypes.func
}
FilterServiceType.defaultProps = {
  serviceTypes: Immutable.List()
}

module.exports = FilterServiceType
