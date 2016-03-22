import React from 'react'
import Immutable from 'immutable'
import diff from 'immutablediff'
import { Button, ButtonToolbar } from 'react-bootstrap'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

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
      <ReactCSSTransitionGroup
        component="div"
        className="dialog-transition"
        transitionName="dialog-transition"
        transitionEnterTimeout={10}
        transitionLeaveTimeout={350}
        transitionAppear={true}
        transitionAppearTimeout={10}>
        {configDiff.size != 0 &&
          <Dialog className="configuration-diff-bar">
            <ButtonToolbar className="pull-right">
              <Button bsStyle="primary"
                onClick={this.resetConfig}>
                CANCEL
              </Button>
              <Button className="btn btn-save"
                onClick={this.props.saveConfig}
                disabled={this.props.saving}>
                {this.props.saving ? 'SAVING...' : 'SAVE'}
              </Button>
            </ButtonToolbar>
            <div className="configuration-dialog-content">
              <p className="configuration-dialog-title">
                {configDiff.size} Change{configDiff.size > 1 && 's'}
              </p>
              <p>
                {configDiff.map((change, i) => {
                  return(
                    <span key={i}>
                      [{change.get('op')} {change.get('path')}]
                    </span>
                  )
                })}
              </p>
            </div>
          </Dialog>
        }
      </ReactCSSTransitionGroup>
    )
  }
}

ConfigurationDiffBar.displayName = 'ConfigurationDiffBar'
ConfigurationDiffBar.propTypes = {
  changeValue: React.PropTypes.func,
  currentConfig: React.PropTypes.instanceOf(Immutable.Map),
  originalConfig: React.PropTypes.instanceOf(Immutable.Map),
  saveConfig: React.PropTypes.func,
  saving: React.PropTypes.bool
}

module.exports = ConfigurationDiffBar
