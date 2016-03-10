import React from 'react'
import Immutable from 'immutable'
import diff from 'immutablediff'
import { Button, ButtonToolbar } from 'react-bootstrap'

import Dialog from '../layout/dialog'

class ConfigurationDiffBar extends React.Component {
  render() {
    const configDiff = diff(this.props.originalConfig, this.props.currentConfig)
    return (
      <Dialog className="configuration-diff-bar">
        <ButtonToolbar className="pull-right">
          <Button bsStyle="primary">CANCEL</Button>
          <Button className="btn btn-save">SAVE</Button>
        </ButtonToolbar>
        <div>
          <p className="configuration-dialog-title">
            {configDiff.size} Changes
          </p>
          <div>
            {configDiff.map((change, i) => {
              return(
                <span key={i}>
                  [{change.get('op')} {change.get('path')}]
                </span>
              )
            })}
          </div>
        </div>
      </Dialog>
    )
  }
}

ConfigurationDiffBar.displayName = 'ConfigurationDiffBar'
ConfigurationDiffBar.propTypes = {
  currentConfig: React.PropTypes.instanceOf(Immutable.Map),
  originalConfig: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = ConfigurationDiffBar
