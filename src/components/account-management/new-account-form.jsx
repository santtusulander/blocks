import React from 'react'
import {
  Input,
  ButtonToolbar,
  Button
} from 'react-bootstrap'
import Select from '../../components/select'

export class NewAccountForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}

    this.onCancel = this.onCancel.bind(this)
    this.onAdd    = this.onAdd.bind(this)
  }

  onCancel() {
    this.props.onCancel();
  }

  onAdd(e) {
    e.preventDefault()
    console.log('adding new...')
  }

  render() {
    return (
      <form onSubmit={ this.onAdd } className='new-account-form'>

        <div className="form-group">
          <Input type="text" label="Account name"/>
        </div>

        <div className="form-group">
          <Input type="text" label="Brand"/>
        </div>


        <div className="form-group">
          <label>Account type</label>
          <Select label="Account type" className="btn-block"
                  onSelect={() => {}}
                  value=""
                  options={[
                  ['', 'Account type'],
                  ['content_provide', 'Content provider']
                ]}
          />
        </div>

        <ButtonToolbar className="text-right extra-margin-top">
          <Button bsStyle="primary" className="btn-outline" onClick={ this.onCancel }>Cancel</Button>
          <Button type="submit" bsStyle="primary">Add</Button>
        </ButtonToolbar>

      </form>
    )
  }
}

export default NewAccountForm
