import React from 'react'
import Immutable from 'immutable'
import { Input } from 'react-bootstrap'

export class FilterServiceType extends React.Component {
  constructor(props) {
    super(props);

    this.toggleServiceType = this.toggleServiceType.bind(this)
  }
  toggleServiceType(type) {
    return () => {
      // TODO: Maybe some general error messaging box?
      if(this.props.serviceTypes.size === 1 && this.props.serviceTypes.includes(type)) {
        alert('There must be at least one service type selected.')
      }
      else {
        this.props.toggleServiceType(type)
      }
    }
  }
  render() {
    return (
      <div>
        <div className="sidebar-content">
          <Input type="checkbox" label="HTTP"
            checked={this.props.serviceTypes.includes('http')}
            onChange={ () => { this.props.toggleServiceType('http')} } />
          <Input type="checkbox" label="HTTPS"
            checked={this.props.serviceTypes.includes('https')}
            onChange={ () => { this.props.toggleServiceType('https') } }/>
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
