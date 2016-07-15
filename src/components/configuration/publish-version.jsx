import React from 'react'
import {Button, Input, ButtonToolbar, FormControls} from 'react-bootstrap'

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
        <FormControls.Static label="Version Name"
          value={this.props.versionName}/>

        <hr/>

        {/* Publish To */}
        <label>Publish to</label>
        <Input type="radio"
          label="Staging Platform"
          onChange={this.setPublishTarget(2)}
          checked={this.state.publishTarget === 2}/>
        <Input type="radio"
          label="Production Platform"
          onChange={this.setPublishTarget(3)}
          checked={this.state.publishTarget === 3}/>

        {/* Action buttons */}
        <ButtonToolbar className="text-right extra-margin-top">
          <Button bsStyle="primary" onClick={this.props.hideAction}>
            Cancel
          </Button>
          <Button bsStyle="primary"
            onClick={this.handleSave}
            disabled={this.props.publishing || !this.state.publishTarget}>
            {this.props.publishing ? 'PUBLISHING...' : 'PUBLISH'}
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

module.exports = ConfigurationPublishVersion
