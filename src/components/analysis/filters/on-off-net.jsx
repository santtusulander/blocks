import React from 'react'
import { connect } from 'react-redux'
import Immutable from 'immutable'
import { Input } from 'react-bootstrap'

import UDNButton from '../../button'

import { showInfoDialog, hideInfoDialog } from '../../../redux/modules/ui'

const FilterOnOffNet = ({ toggleFilter, onOffNetValues, hideInfoDialog, showInfoDialog }) => {
  const toggle = type => () => {
    // TODO: Maybe some general error messaging box?
    if(onOffNetValues.size === 1 && onOffNetValues.includes(type)) {
      showInfoDialog({
        title: 'Error',
        content: 'There must be at least one option selected.',
        buttons: <UDNButton onClick={hideInfoDialog} bsStyle="primary">OK</UDNButton>
      });
    }
    else {
      toggleFilter(type)
    }
  }
  return (
    <div>
      <div className="sidebar-section-header">
        On-Net/Off-Net
      </div>
      <div className="sidebar-content">
        <Input type="checkbox" label="On-Net"
          checked={onOffNetValues.contains('on-net')}
          onChange={toggle('on-net')}
        />
        <Input type="checkbox" label="Off-Net"
          checked={onOffNetValues.contains('off-net')}
          onChange={toggle('off-net')}
        />
      </div>
    </div>
  );
}

FilterOnOffNet.displayName = 'FilterOnOffNet'
FilterOnOffNet.propTypes = {
  hideInfoDialog: React.PropTypes.func,
  onOffNetValues: React.PropTypes.instanceOf(Immutable.List),
  showInfoDialog: React.PropTypes.func,
  toggleFilter: React.PropTypes.func
}
FilterOnOffNet.defaultProps = {
  onOffNetValues: Immutable.List()

}

export default connect(null, { showInfoDialog, hideInfoDialog })(FilterOnOffNet)
