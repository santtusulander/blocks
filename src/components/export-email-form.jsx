import React from 'react'
import {
  Input,
  ButtonToolbar,
  Button,
  FormGroup,
  FormControl,
  ControlLabel

  } from 'react-bootstrap'


const frequencyOptions = [
    {label: 'One-time, send now', value: 'one-time'},
    {label: 'Weekly', value: 'weekly'},
].map( (e) => {
    return <option value={e.value}>{e.label}</option>;
});

class ExportEmailForm extends React.Component {

  constructor(props){
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e){
    e.preventD
    this.props.onSend();
  }

  render(){
    return (
      <form className='ExportEmailForm' onSubmit={this.onSubmit}>

        <Input
          type="email"
          label="Recipients"
          placeholder="Enter recipients"
          addonBefore="To"
        />

        <Input
          type="email"
          addonBefore="Cc"
          placeholder="Enter text"
        />

        <Input
          type='text'
          label='Subject'
          placeholder='Trafic overview report'
        />

        <Input
          type='textarea'
          label='Message'
          placeholder=''
        />

        <FormGroup controlId="frequencySelect">
          <ControlLabel>Email frequency</ControlLabel>
          <FormControl componentClass="select" placeholder="select">
            { frequencyOptions }
          </FormControl>
        </FormGroup>

        <ButtonToolbar className="text-right extra-margin-top">
          <Button bsStyle="primary" className="btn-outline" onClick={this.props.onCancel}>Cancel</Button>
          <Button type="submit" bsStyle="primary">Send</Button>
        </ButtonToolbar>

      </form>
    )
  }
}
ExportEmailForm.displayName = 'ExportEmailForm'
ExportEmailForm.propTypes = {
  onSend: React.PropTypes.func,
  onCancel: React.PropTypes.func,
}

module.exports = ExportEmailForm
