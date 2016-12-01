import React from 'react'
import { Button, ButtonToolbar, Input } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { reduxForm } from 'redux-form'
import { isValidHostName } from '../../util/validators'

let errors = {}
const validate = (values) => {
  errors = {}

  const {
    hostName
  } = values

  if(!hostName || !isValidHostName(hostName)) {
    errors.hostName = true
  }

  return errors
}

class AddHost extends React.Component {
  constructor(props) {
    super(props)

    this.cancelChanges = this.cancelChanges.bind(this)
    this.createHost = this.createHost.bind(this)
  }

  createHost() {
    const {
      fields: {
        hostName,
        deploymentMode
      }
    } = this.props

    if (!Object.keys(errors).length) {
      this.props.createHost(
        hostName.value,
        deploymentMode.value
      )
    }
  }
  cancelChanges(e) {
    e.preventDefault()
    this.props.cancelChanges()
  }
  render() {
    const {
      fields: {
        hostName,
        deploymentMode
      }
    } = this.props

    return (
      <form>
        <Input type="text" label={this.props.intl.formatMessage({id: 'portal.content.addHost.newHostanme.text'})} {...hostName} id="host_name"/>
        <label><FormattedMessage id="portal.content.addHost.deploymentMode.text"/></label>
        <Input type="radio"
               {...deploymentMode}
               value="trial"
               checked={deploymentMode.value === 'trial'}
               label={this.props.intl.formatMessage({ id: 'portal.content.addHost.trial.text' })}/>
        <Input type="radio"
               {...deploymentMode}
               value="production"
               checked={deploymentMode.value === 'production'}
               label={this.props.intl.formatMessage({ id: 'portal.content.addHost.production.text' })}/>
        <ButtonToolbar className="text-right extra-margin-top">
          <Button bsStyle="primary" onClick={this.cancelChanges}><FormattedMessage id="portal.button.cancel"/></Button>
          <Button
            disabled={this.props.saving || !!Object.keys(errors).length}
            type="submit"
            bsStyle="primary"
            id="save_button"
            onClick={this.createHost}>
            {this.props.saving ?
              <FormattedMessage id="portal.button.saving"/>
            : <FormattedMessage id="portal.button.save"/>}
            </Button>
        </ButtonToolbar>
      </form>
    )
  }
}

AddHost.displayName = 'AddHost'
AddHost.propTypes = {
  cancelChanges: React.PropTypes.func,
  createHost: React.PropTypes.func,
  fields: React.PropTypes.object,
  intl: React.PropTypes.object,
  saving: React.PropTypes.bool
}

export default reduxForm({
  form: 'user-form',
  fields: [
    'hostName',
    'deploymentMode'
  ],
  initialValues: {
    deploymentMode: 'trial'
  },
  validate: validate
})(injectIntl(AddHost))
