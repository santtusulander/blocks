import React from 'react'
import {Button, Input, ButtonToolbar, FormControls} from 'react-bootstrap'

import {FormattedMessage, formatMessage, injectIntl} from 'react-intl'

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
    this.props.saveChanges(this.state.publishTarget)
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
        <Input type="radio"
          label={this.props.intl.formatMessage({id: 'portal.policy.edit.publishVersion.stagingPlatform.text'})}
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
  publishing: React.PropTypes.bool,
  saveChanges: React.PropTypes.func,
  versionName: React.PropTypes.string
}

module.exports = injectIntl(ConfigurationPublishVersion)
