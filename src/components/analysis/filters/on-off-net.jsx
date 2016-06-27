import React from 'react'
import Immutable from 'immutable'
import { Input } from 'react-bootstrap'

const FilterOnOffNet = ({toggleFilter, onOffNetValues}) => {
  return (
    <div>
      <div className="sidebar-section-header">
        On-Net/Off-Net
      </div>
      <div className="sidebar-content">
        <Input type="checkbox" label="On-Net"
          checked={onOffNetValues.contains('on-net') }
          onChange={ () => { toggleFilter('on-net') } }
        />
        <Input type="checkbox" label="Off-Net"
          checked={onOffNetValues.contains('off-net') }
          onChange={ () => { toggleFilter('off-net') } }
        />
      </div>
    </div>
  );
}

FilterOnOffNet.displayName = 'FilterOnOffNet'
FilterOnOffNet.propTypes = {
  onOffNetValues: React.PropTypes.instanceOf(Immutable.List),
  toggleFilter: React.PropTypes.func
}
FilterOnOffNet.defaultProps = {
  onOffNetValues: Immutable.List()

}

module.exports = FilterOnOffNet
