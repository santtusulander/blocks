import React from 'react'
import { connect } from 'react-redux'
import Immutable from 'immutable'
import { Checkbox, FormGroup } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { showInfoDialog, hideInfoDialog } from '../../../redux/modules/ui'

// eslint-disable-next-line no-shadow
const FilterOnOffNet = ({ toggleFilter, onOffNetValues, hideInfoDialog, showInfoDialog }) => {
  const toggle = type => () => {
    // TODO: Maybe some general error messaging box?
    if (onOffNetValues.size === 1 && onOffNetValues.includes(type)) {
      showInfoDialog({
        title: <FormattedMessage id="portal.analytics.onOffNet.noOptionsSelected.title"/>,
        content: <FormattedMessage id="portal.analytics.onOffNet.noOptionsSelected.text"/>,
        okButton: true,
        cancel: () => hideInfoDialog()
      });
    }  else {
      toggleFilter(type)
    }
  }
  return (
    <div>
      <h5><FormattedMessage id="portal.analysis.filters.onOffNet.title"/></h5>
      <div className="sidebar-content form-inline">
        <FormGroup>
          <Checkbox
            checked={onOffNetValues.contains('on')}
            disabled={onOffNetValues.contains('on') && onOffNetValues.size === 1}
            onChange={toggle('on')}>
            <span>On-Net</span>
          </Checkbox>
        </FormGroup>
        <FormGroup>
          <Checkbox
            checked={onOffNetValues.contains('off')}
            disabled={onOffNetValues.contains('off') && onOffNetValues.size === 1}
            onChange={toggle('off')}>
            <span>Off-Net</span>
          </Checkbox>
        </FormGroup>
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
