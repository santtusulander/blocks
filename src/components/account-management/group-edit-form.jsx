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
  {value: 1, label: 'foo@example.com'},
  {value: 2, label: 'bar@example.com'},
  {value: 3, label: 'baz@example.com'}
]
const values = List()

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
    this.users = this.props.users || users;
    this.initialMembers = this.props.members || [2,3]
    this.save = this.save.bind(this)
  }

  componentWillMount() {
    this.setState({
      usersToAdd: List(),
      members: this.initialMembers,
      usersToDelete: List()
    })
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

  deleteMember(userId) {
    // New members will be just removed from the new members list
    if (this.state.usersToAdd.includes(userId)) {
      this.setState({
        usersToAdd: this.state.usersToAdd.take(this.state.usersToAdd.keyOf(userId)) // keyOf
      })
    }
    // Existing members will be added to the to be deleted list
    else {
      this.setState({
        usersToDelete: this.state.usersToDelete.push(userId)
      })
    }
  }

  undoDelete(userId) {
    this.setState({
      usersToDelete: this.state.usersToDelete.take(this.state.usersToDelete.keyOf(userId))
    })
  }

  render() {
    const { fields: {name}, show, onCancel } = this.props

    // TODO: Check me after more brands have been added
    const currentBrand = 'udn'
    const currentMembers = this.users.reduce((members, user) => {
      if (this.state.usersToAdd.includes(user.value)) {
        return [{...user, toAdd: true}, ...members]
      }
      if (this.state.usersToDelete.includes(user.value)) {
        return [...members, {...user, toDelete: true}]
      }
      if (this.state.members.includes(user.value)) {
        return [...members, user]
      }
      return members
    }, [])

    const addMembersOptions = fromJS(this.users.reduce((arr, user) => {
      if(this.initialMembers.indexOf(user.value) === -1) {
        return [...arr, user]
      }
      return arr;
    }, []))

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
                options={addMembersOptions}
                values={fromJS(this.state.usersToAdd) || List()}
                handleCheck={val => {
                  this.setState({usersToAdd: val})
                }}
              />
            </div>

            <div className="form-group">
              <label className="control-label">{`Current Members (${currentMembers.length - this.state.usersToDelete.size})`}</label>
              <ul className="members-list">
                {currentMembers.map((val) => {
                  let className = 'members-list__member '
                  className += val.toAdd ? 'members-list__member--new ' : ''
                  className += val.toDelete ? 'members-list__member--delete ' : ''
                  return(
                    <li key={val.value} className={className}>
                      <span className="members-list__member__label">NEEDS_API {val.label}</span>
                      <span className="members-list__member__actions">
                      {val.toAdd && <span className="members-list__member__actions__new">NEW</span>}
                      {val.toDelete ? <Button bsStyle="link" className="undo-label" onClick={() => this.undoDelete(val.value)}>UNDO</Button> : <Button bsStyle="link" className="delete-button" onClick={() => this.deleteMember(val.value)}><IconClose width="20" height="20"/></Button>}
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
