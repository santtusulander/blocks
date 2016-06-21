import React from 'react'
import {
  Input,
  ButtonToolbar,
  Button,
  FormGroup,
  FormControl,
  ControlLabel

  } from 'react-bootstrap'

import Immutable from 'immutable'

const frequencyOptions = [
    {label: 'One-time, send now', value: 'one-time'},
    {label: 'Weekly', value: 'weekly'},
].map( (e) => {
    return <option value={e.value}>{e.label}</option>;
});

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
  onCancel(e) {
    this.props.onCancel()
  }

  render(){

    const { subject } = this.props

    return (
      <form className='ExportEmailForm' onSubmit={this.onSubmit}>

        <Input
          type="text"
          label="Recipients"
          placeholder="Enter recipients"
          addonBefore="To"
          onChange={this.changeValue(['to'])}
        />

        <Input
          type="text"
          addonBefore="Cc"
          placeholder="Enter text"
          onChange={this.changeValue(['cc'])}
        />

        <Input
          type='text'
          label='Subject'
          placeholder={subject}
          onChange={this.changeValue(['subject'])}
        />

        <Input
          type='textarea'
          label='Message'
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
          <Button className="btn-outline" onClick={this.onCancel}>Cancel</Button>
          <Button type="submit" bsStyle="primary">Send</Button>
        </ButtonToolbar>

      </form>
    )
  }
}
ExportEmailForm.displayName = 'ExportEmailForm'
ExportEmailForm.propTypes = {
  formValues: React.PropTypes.instanceOf(Immutable.Map),
  onSend: React.PropTypes.func,
  onCancel: React.PropTypes.func
}

ExportEmailForm.defaultProps = {
  formValues: Immutable.Map()
}

module.exports = ExportEmailForm
