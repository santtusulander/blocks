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

    this.save = this.save.bind(this)
  }

  componentWillMount() {
    this.setState({
      usersToAdd: List(),
      usersToDelete: List()
    })
  }

  save() {
    if(!Object.keys(errors).length) {
      const {
        fields: { name }
      } = this.props
      // TODO: enable this when API is ready
      //const members = this.getMembers()
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

  getMembers() {
    return this.state.usersToAdd.concat(this.props.members).reduce((arr, user) => {
      if (!this.state.usersToDelete.includes(user)) {
        return arr.push(user)
      }
      return arr
    }, List())
  }

  isEdited() {
    const {fields: {name}} = this.props
    return name.value !== name.initialValue || !this.getMembers().equals(this.props.members)
  }

  render() {
    const { fields: {name}, show, onCancel } = this.props

    // TODO: Check me after more brands have been added
    const currentBrand = 'udn'

    const currentMembers = this.props.users.reduce((members, user) => {
      if (this.state.usersToAdd.includes(user.value)) {
        return [{...user, toAdd: true}, ...members]
      }
      if (this.state.usersToDelete.includes(user.value)) {
        return [...members, {...user, toDelete: true}]
      }
      if (this.props.members.includes(user.value)) {
        return [...members, user]
      }
      return members
    }, [])

    const addMembersOptions = fromJS(this.props.users.reduce((arr, user) => {
      if(!this.props.members.includes(user.value)) {
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
                values={this.state.usersToAdd || List()}
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
                      <span className="members-list__member__label">{val.label}</span>
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
              <Button disabled={!!Object.keys(errors).length || !this.isEdited()} bsStyle="primary"
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
  members: PropTypes.instanceOf(List),
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool,
  users: PropTypes.array
}

GroupEditForm.defaultProps = {
  // TODO: FOR TESTING ONLY - REMOVE ME
  users: [
    {value: 1, label: 'NEEDS API foo@example.com'},
    {value: 2, label: 'NEEDS API bar@example.com'},
    {value: 3, label: 'NEEDS API baz@example.com'},
    {value: 4, label: 'NEEDS API foz@example.com'}
  ],
  // TODO: FOR TESTING ONLY - REMOVE ME
  members: List([2,3])
}

export default reduxForm({
  fields: ['name', 'members', 'users'],
  form: 'group-edit',
  validate
})(GroupEditForm)
