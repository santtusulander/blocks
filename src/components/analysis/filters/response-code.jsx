import React from 'react'
import Immutable from 'immutable'
import { Input } from 'react-bootstrap'

import STATUS_CODES from '../../../constants/status-codes'

export class FilterResponseCode extends React.Component {
  render() {
    return (
      <div>
        <div className="sidebar-section-header">
          Response Code
        </div>
        <div className="sidebar-content">
          <Input type="checkbox"
            label="All"
            checked={this.props.statusCodes.size === STATUS_CODES.length}
            onChange={() => this.props.toggleStatusCode(STATUS_CODES)}/>
          {STATUS_CODES.map((code, index) =>
            <Input type="checkbox" key={index} label={code}
              checked={this.props.statusCodes.includes(code)}
              onChange={() => this.props.toggleStatusCode(code)}
              />
          )}
        </div>
      </div>
    );
  }
}

FilterResponseCode.displayName = 'FilterResponseCode'
FilterResponseCode.propTypes = {
  statusCodes: React.PropTypes.instanceOf(Immutable.List),
  toggleStatusCode: React.PropTypes.func
}
FilterResponseCode.defaultProps = {
  statusCodes: Immutable.List()
}

module.exports = FilterResponseCode
