import React from 'react'
import Immutable from 'immutable'
import diff from 'immutablediff'
import { Button, ButtonToolbar } from 'react-bootstrap'

import Dialog from '../layout/dialog'

class ConfigurationDiffBar extends React.Component {
  constructor(props) {
    super(props)

    this.resetConfig = this.resetConfig.bind(this)
  }
  resetConfig() {
    this.props.changeValue([], this.props.originalConfig)
  }
  render() {
    const configDiff = diff(this.props.originalConfig, this.props.currentConfig)
    return (
      <Dialog className="configuration-diff-bar">
        <ButtonToolbar className="pull-right">
          <Button bsStyle="primary"
            onClick={this.resetConfig}>
            CANCEL
          </Button>
          <Button className="btn btn-save"
            onClick={this.props.saveConfig}>
            SAVE
          </Button>
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
  changeValue: React.PropTypes.func,
  currentConfig: React.PropTypes.instanceOf(Immutable.Map),
  originalConfig: React.PropTypes.instanceOf(Immutable.Map),
  saveConfig: React.PropTypes.func
}

module.exports = ConfigurationDiffBar
