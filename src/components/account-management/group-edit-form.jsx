import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import {
  Modal,
  Input,
  ButtonToolbar,
  Button
} from 'react-bootstrap'
import {List, fromJS} from 'immutable'

import FilterChecklistDropdown from '../filter-checklist-dropdown/filter-checklist-dropdown.jsx'
import IconClose from '../icons/icon-close.jsx'


import './group-edit-form.scss'

let errors = {}

// TODO: For testing purposes. Remove these.
const users = [
  {value: 1, label: 'foo@example.com', toAdd: true},
  {value: 2, label: 'bar@example.com'},
  {value: 3, label: 'baz@example.com'}
]
const values = List([1])

const validate = (values) => {
  const {name} = values
  errors = {}
  if(!name || name.length === 0) {
    errors.name = 'Group name is required'
  }

  return errors;
}

class GroupEditForm extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.save = this.save.bind(this)
  }

  componentWillMount() {
    this.setState({
      currentMembers: [2,3],
      users: users,
      usersToAdd: values
    })
  }

  componentWillReceiveProps(nextProps) {
    /*if(nextProps.fields.accountType.value !== this.props.fields.accountType.value) {
      const { fields: { services, accountType } } = nextProps
      const activeServiceTypes  = SERVICE_TYPES.filter(item => item.accountType === Number(accountType.value))
      const activeServiceValues = activeServiceTypes.map(item => item.value)
      const checkedServiceTypes = services.value.filter(item => activeServiceValues.includes(item))
      services.onChange(checkedServiceTypes)
    }*/
  }

  save() {
    if(!Object.keys(errors).length) {
      const {
        fields: { name/*, members*/ }
      } = this.props
      this.props.onSave({
        name: name.value
      })
    }
  }

  render() {
    const { fields: {name}, show, onCancel } = this.props

    // TODO: Check me after more brands have been added
    const currentBrand = 'udn'
    const membersOptions = [
      {value: 1, label: 'foo@example.com', toAdd: true},
      {value: 2, label: 'bar@example.com'},
      {value: 3, label: 'baz@example.com', toDelete: true}
    ]


    return (
      <Modal dialogClassName="group-edit-form-sidebar" show={show}>
        <Modal.Header>
          <h1>Edit group</h1>
          <p>{currentBrand}</p>
        </Modal.Header>

        <Modal.Body>
          <form>

            <Input
              {...name}
              type="text"
              label="Group Name"
              placeholder='Enter Group Name'/>
            {name.touched && name.error &&
            <div className='error-msg'>{name.error}</div>}

            <hr/>
            <div className="form-group add-members">
              <label className="control-label">Add Members</label>
              <FilterChecklistDropdown
                options={fromJS(users.reduce((arr, user) => {
                  if(this.state.currentMembers.indexOf(user.value) === -1) {
                    return [...arr, user]
                  }
                  return arr;
                }, []))}
                values={this.state.usersToAdd || List()}
                handleCheck={val => {
                  this.setState({usersToAdd: val})
                }}
              />
            </div>

            <div className="form-group">
              <label className="control-label">{`Current Members ${this.state.currentMembers.length}`}</label>
              <ul className="members-list">
                {membersOptions.map((val, key) => {
                  let className = 'members-list__member '
                  className += val.toAdd ? 'members-list__member--new ' : ''
                  className += val.toDelete ? 'members-list__member--delete ' : ''
                  return(
                    <li key={key} className={className}>
                      <span className="members-list__member__label">NEEDS_API {val.label}</span>
                      <span className="members-list__member__actions">
                      {val.toAdd && <span className="members-list__member__actions__new">NEW</span>}
                      {val.toDelete ? <Button bsStyle="link" className="undo-label">UNDO</Button> : <Button bsStyle="link" className="delete-button"><IconClose width="20" height="20"/></Button>}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <ButtonToolbar className="text-right extra-margin-top">
              <Button className="btn-outline" onClick={onCancel}>Cancel</Button>
              <Button disabled={!!Object.keys(errors).length} bsStyle="primary"
                      onClick={this.save}>Save</Button>
            </ButtonToolbar>
          </form>
        </Modal.Body>
      </Modal>
    )
  }
}

GroupEditForm.propTypes = {
  fields: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool
}

export default reduxForm({
  fields: ['name', 'members', 'users'],
  form: 'group-edit',
  validate
})(GroupEditForm)
