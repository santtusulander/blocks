import React from 'react'
import { Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import FormFooterButtons from '../shared/form-elements/form-footer-buttons'
import Radio from '../shared/form-elements/radio'

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
        <FormGroup>
          <ControlLabel>
            <FormattedMessage id="portal.policy.edit.publishVersion.versionName.text" />
          </ControlLabel>
          <FormControl.Static>{this.props.versionName}</FormControl.Static>
        </FormGroup>

        <hr/>

        {/* Publish To */}
        <FormGroup>
          <ControlLabel><FormattedMessage id="portal.policy.edit.publishVersion.publishTo.text"/></ControlLabel>
          {/* Sandbox publishing is disabled for 1.0 */}
          <Radio
            disabled={true}
            onChange={this.setPublishTarget(2)}
            checked={this.state.publishTarget === 2}
          >
            <FormattedMessage id="portal.policy.edit.publishVersion.sandboxPlatform.text" />
          </Radio>

          <Radio
            onChange={this.setPublishTarget(3)}
            checked={this.state.publishTarget === 3}
          >
            <FormattedMessage id="portal.policy.edit.publishVersion.productionPlatform.text" />
          </Radio>
        </FormGroup>

        {/* Action buttons */}
        <FormFooterButtons>
          <Button className="btn-secondary" onClick={this.props.hideAction}>
            <FormattedMessage id="portal.button.cancel"/>
          </Button>
          <Button bsStyle="primary"
            className="save-btn"
            onClick={this.handleSave}
            disabled={this.props.publishing || !this.state.publishTarget}>
            {this.props.publishing ? <FormattedMessage id="portal.button.PUBLISHING"/> : <FormattedMessage id="portal.button.PUBLISH"/>}
          </Button>
        </FormFooterButtons>
      </form>
    )
  }
}

ConfigurationPublishVersion.displayName = 'ConfigurationPublishVersion'
ConfigurationPublishVersion.propTypes = {
  hideAction: React.PropTypes.func,
  publishing: React.PropTypes.bool,
  saveChanges: React.PropTypes.func,
  versionName: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ])
}

module.exports = ConfigurationPublishVersion
