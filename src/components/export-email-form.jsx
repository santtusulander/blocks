import React from 'react'
import {
  Input,
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

  constructor(props){
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

    this.props.onSend( this.props.formValues )
  }
  onCancel() {
    this.props.onCancel()
  }

  render(){

    const { subject } = this.props

    return (
      <form className='ExportEmailForm' onSubmit={this.onSubmit}>

        <Input
          type="text"
          label={this.props.intl.formatMessage({id: 'portal.exportEmail.recipients.text'})}
          placeholder={this.props.intl.formatMessage({id: 'portal.exportEmail.recipients.placeholder'})}
          addonBefore="To"
          onChange={this.changeValue(['to'])}
        />

        <Input
          type="text"
          addonBefore={this.props.intl.formatMessage({id: 'portal.exportEmail.cc.text'})}
          placeholder={this.props.intl.formatMessage({id: 'portal.exportEmail.cc.placeholder'})}
          onChange={this.changeValue(['cc'])}
        />

        <Input
          type='text'
          label={this.props.intl.formatMessage({id: 'portal.exportEmail.subject.text'})}
          placeholder={subject}
          onChange={this.changeValue(['subject'])}
        />

        <Input
          type='textarea'
          label={this.props.intl.formatMessage({id: 'portal.exportEmail.message.text'})}
          placeholder=''
          onChange={this.changeValue(['message'])}
        />

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
