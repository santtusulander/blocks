import React from 'react'
import {Button, Input, ButtonToolbar, FormControls} from 'react-bootstrap'

import {FormattedMessage, injectIntl} from 'react-intl'

class ConfigurationPublishVersion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      publishTarget: ''
    }

    this.setPublishTarget = this.setPublishTarget.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }
  setPublishTarget(target) {
    return () => this.setState({publishTarget: target})
  }
  handleSave(e) {
    e.preventDefault()

    if (this.state.publishTarget) {
      this.props.saveChanges(this.state.publishTarget)
    } else {
      // TODO: notify user?
    }
  }
  render() {
    return (
      <form className="configuration-publish-version">

        {/* Version Name */}
        <FormControls.Static label={this.props.intl.formatMessage({id: 'portal.policy.edit.publishVersion.versionName.text'})}
          value={this.props.versionName}/>

        <hr/>

        {/* Publish To */}
        <label><FormattedMessage id="portal.policy.edit.publishVersion.publishTo.text"/></label>
        {/* Sandbox publishing is disabled for 1.0 */}
        <Input type="radio"
          disabled={true}
          label={this.props.intl.formatMessage({id: 'portal.policy.edit.publishVersion.sandboxPlatform.text'})}
          onChange={this.setPublishTarget(2)}
          checked={this.state.publishTarget === 2}/>
        <Input type="radio"
          label={this.props.intl.formatMessage({id: 'portal.policy.edit.publishVersion.productionPlatform.text'})}
          onChange={this.setPublishTarget(3)}
          checked={this.state.publishTarget === 3}/>

        {/* Action buttons */}
        <ButtonToolbar className="text-right extra-margin-top">
          <Button bsStyle="primary" onClick={this.props.hideAction}>
            <FormattedMessage id="portal.button.cancel"/>
          </Button>
          <Button bsStyle="primary"
            className="save-btn"
            onClick={this.handleSave}
            disabled={this.props.publishing || !this.state.publishTarget}>
            {this.props.publishing ? <FormattedMessage id="portal.button.PUBLISHING"/> : <FormattedMessage id="portal.button.PUBLISH"/>}
          </Button>
        </ButtonToolbar>
      </form>
    )
  }
}

ConfigurationPublishVersion.displayName = 'ConfigurationPublishVersion'
ConfigurationPublishVersion.propTypes = {
  hideAction: React.PropTypes.func,
  intl: React.PropTypes.object,
  publishing: React.PropTypes.bool,
  saveChanges: React.PropTypes.func,
  versionName: React.PropTypes.string
}

module.exports = injectIntl(ConfigurationPublishVersion)
