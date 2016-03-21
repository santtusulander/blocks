import React from 'react'
import {Button, Input, ButtonToolbar, FormControls} from 'react-bootstrap'

class ConfigurationPublishVersion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      publishTarget: 'staging'
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
    this.props.hideAction()
  }
  render() {
    return (
      <form className="configuration-publish-version"
        onSubmit={this.handleSave}>

        {/* Version Name */}
        <FormControls.Static label="Version Name"
          value={this.props.versionName}/>

        <hr/>

        {/* Publish To */}
        <label>Publish to</label>
        <Input type="radio"
          label="Staging Platform"
          onChange={this.setPublishTarget('staging')}
          checked={this.state.publishTarget === 'staging'}/>
        <Input type="radio"
          label="Production Platform"
          onChange={this.setPublishTarget('production')}
          checked={this.state.publishTarget === 'production'}/>

        {/* Action buttons */}
        <ButtonToolbar className="text-right extra-margin-top">
          <Button bsStyle="primary" onClick={this.props.hideAction}>
            Cancel
          </Button>
          <Button type="submit" bsStyle="primary">
            Publish
          </Button>
        </ButtonToolbar>
      </form>
    )
  }
}

ConfigurationPublishVersion.displayName = 'ConfigurationPublishVersion'
ConfigurationPublishVersion.propTypes = {
  hideAction: React.PropTypes.func,
  saveChanges: React.PropTypes.func,
  versionName: React.PropTypes.string
}

module.exports = ConfigurationPublishVersion
