import React from 'react'
import {
  FormGroup,
  ControlLabel,
  FormControl,
  InputGroup,
  ButtonToolbar,
  Button
} from 'react-bootstrap'

import Immutable from 'immutable'

import { FormattedMessage, injectIntl } from 'react-intl'

// const frequencyOptions = [
//   { label: <FormattedMessage id="portal.exportEmail.oneTime.text"/>, value: 'one-time' },
//   { label: <FormattedMessage id="portal.exportEmail.weekly.text"/>, value: 'weekly' },
// ].map((e) => {
//   return <option value={e.value}>{e.label}</option>;
// });

class ExportEmailForm extends React.Component {

  constructor(props) {
    super(props);

    this.onCancel = this.onCancel.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  changeValue(valPath) {
    return (e) => {
      this.props.changeValue(valPath, e.target.value)
    }
  }
  onSubmit(e) {
    e.preventDefault()

    this.props.onSend(this.props.formValues)
  }
  onCancel() {
    this.props.onCancel()
  }

  render() {

    const { subject } = this.props

    return (
      <form className='ExportEmailForm' onSubmit={this.onSubmit}>

        <FormGroup>
          <ControlLabel><FormattedMessage id="portal.exportEmail.recipients.text" /></ControlLabel>
          <InputGroup>
            <InputGroup.Addon><FormattedMessage id="portal.exportEmail.to.text" /></InputGroup.Addon>
            <FormControl
              placeholder={this.props.intl.formatMessage({id: 'portal.exportEmail.recipients.placeholder'})}
              onChange={this.changeValue(['to'])}
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <InputGroup>
            <InputGroup.Addon><FormattedMessage id="portal.exportEmail.cc.text" /></InputGroup.Addon>
            <FormControl
              placeholder={this.props.intl.formatMessage({id: 'portal.exportEmail.cc.placeholder'})}
              onChange={this.changeValue(['cc'])}
            />
          </InputGroup>
        </FormGroup>

        <FormGroup>
          <ControlLabel><FormattedMessage id="portal.exportEmail.subject.text" /></ControlLabel>
          <FormControl
            placeholder={subject}
            onChange={this.changeValue(['subject'])}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel><FormattedMessage id="portal.exportEmail.message.text" /></ControlLabel>
          <FormControl
            type='textarea'
            placeholder={subject}
            onChange={this.changeValue(['message'])}
          />
        </FormGroup>

      {/* This needs
      <FormGroup controlId="frequencySelect">
          <ControlLabel>Email frequency</ControlLabel>
          <FormControl componentClass="select" placeholder="select">
            { frequencyOptions }
          </FormControl>
        </FormGroup>
      */}

        <ButtonToolbar className="text-right extra-margin-top">
          <Button className="btn-outline" onClick={this.onCancel}><FormattedMessage id="portal.button.cancel"/></Button>
          <Button type="submit" bsStyle="primary"><FormattedMessage id="portal.button.send"/></Button>
        </ButtonToolbar>

      </form>
    )
  }
}
ExportEmailForm.displayName = 'ExportEmailForm'
ExportEmailForm.propTypes = {
  changeValue: React.PropTypes.func,
  formValues: React.PropTypes.instanceOf(Immutable.Map),
  intl: React.PropTypes.object,
  onCancel: React.PropTypes.func,
  onSend: React.PropTypes.func,
  subject: React.PropTypes.string
}

ExportEmailForm.defaultProps = {
  formValues: Immutable.Map()
}

module.exports = injectIntl(ExportEmailForm)
