import React from 'react'
import { connect } from 'react-redux'
import Immutable from 'immutable'
import { Input } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { showInfoDialog, hideInfoDialog } from '../../../redux/modules/ui'

const FilterOnOffNet = ({ toggleFilter, onOffNetValues, hideInfoDialog, showInfoDialog }) => {
  const toggle = type => () => {
    // TODO: Maybe some general error messaging box?
    if(onOffNetValues.size === 1 && onOffNetValues.includes(type)) {
      showInfoDialog({
        title: <FormattedMessage id="portal.analytics.onOffNet.noOptionsSelected.title"/>,
        content: <FormattedMessage id="portal.analytics.onOffNet.noOptionsSelected.text"/>,
        okButton: hideInfoDialog
      });
    }
    else {
      toggleFilter(type)
    }
  }
  return (
    <div>
      <h5><FormattedMessage id="portal.analysis.filters.onOffNet.title"/></h5>
      <div className="sidebar-content form-inline">
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
