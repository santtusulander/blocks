import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import { Input } from 'react-bootstrap'
import { Map, List } from 'immutable'
// import { Map, List, fromJS } from 'immutable'
import { FormattedMessage, injectIntl } from 'react-intl'

import SidePanel from '../side-panel'
// import FilterChecklistDropdown from '../filter-checklist-dropdown/filter-checklist-dropdown.jsx'
// import IconClose from '../icons/icon-close.jsx'

import { isValidAccountName } from '../../util/validators'

import './group-form.scss'

let errors = {}

const validate = (values) => {
  const {name} = values
  errors = {}
  if(!name || name.length === 0) {
    errors.name = <FormattedMessage id="portal.account.groups.name.error.required"/>
  }

  if( name && !isValidAccountName(name) ) {
    errors.name = <FormattedMessage id="portal.account.groups.name.error.invalid" />
  }

  return errors;
}

class GroupForm extends React.Component {
  constructor(props) {
    super(props)

    this.save = this.save.bind(this)
    this.state = {
      usersToAdd: List(),
      usersToDelete: List()
    }
  }

  componentWillMount() {
    if (!this.props.group.isEmpty()) {
      const {
        group,
        fields: {
          name
        }
      } = this.props

      name.onChange(group.get('name'))
    }
  }

  save() {
    if(!Object.keys(errors).length) {
      const {
        fields: { name }
      } = this.props
      // TODO: enable this when API is ready
      //const members = this.getMembers()

      if (!this.props.group.isEmpty()) {
        this.props.onSave(
          this.props.group.get('id'),
          { name: name.value },
          this.state.usersToAdd,
          this.state.usersToDelete
        )
      } else {
        this.props.onSave({ name: name.value }, this.state.usersToAdd)
      }
    }
  }

  deleteMember(userEmail) {
    // New members will be just removed from the new members list
    if (this.state.usersToAdd.includes(userEmail)) {
      this.setState({
        usersToAdd: this.state.usersToAdd.delete(this.state.usersToAdd.keyOf(userEmail))
      })
    }
    // Existing members will be added to the to be deleted list
    else {
      this.setState({
        usersToDelete: this.state.usersToDelete.push(userEmail)
      })
    }
  }

  undoDelete(userEmail) {
    this.setState({
      usersToDelete: this.state.usersToDelete.delete(this.state.usersToDelete.keyOf(userEmail))
    })
  }

  isEdited() {
    const {fields: {name}} = this.props
    return name.value !== name.initialValue || this.state.usersToAdd.size || this.state.usersToDelete.size
  }

  render() {
    const { fields: {name}, show, onCancel } = this.props
    /*
    const currentMembers = this.props.users.reduce((members, user) => {
      if (this.state.usersToAdd.includes(user.get('email'))) {
        return [user.set('toAdd', true), ...members]
      }
      if (this.state.usersToDelete.includes(user.get('email'))) {
        return [...members, user.set('toDelete', true)]
      }
      if (user.get('group_id').includes(this.props.group.get('id'))) {
        return [...members, user]
      }
      return members
    }, [])


    const addMembersOptions = fromJS(this.props.users.reduce((arr, user) => {
      const userEmail = user.get('email')
      if(!user.get('group_id').includes(this.props.group.get('id'))) {
        return [...arr, {label: userEmail, value: userEmail}]
      }
      return arr;
    }, []))
    */

    const title = !this.props.group.isEmpty() ? <FormattedMessage id="portal.group.edit.editGroup.title"/> : <FormattedMessage id="portal.group.edit.newGroup.title"/>
    const subTitle = !this.props.group.isEmpty() ? `${this.props.account.get('name')} / ${this.props.group.get('name')}` : this.props.account.get('name')

    return (
      <SidePanel
        show={show}
        title={title}
        subTitle={subTitle}
        group={this.props.group}
        cancelButton={true}
        submitButton={true}
        cancel={onCancel}
        submit={this.save}
        invalid={!!Object.keys(errors).length || !this.isEdited()}>
        <form>
          <Input
            {...name}
            type="text"
            label={this.props.intl.formatMessage({id: 'portal.group.edit.name.label'})}
            placeholder={this.props.intl.formatMessage({id: 'portal.group.edit.name.enter.text'})}/>
          {name.touched && name.error &&
          <div className='error-msg'>{name.error}</div>}

          {/*
            Disable until API support allows listing groups for user with some assigned
          <hr/>
          <div className="form-group add-members">
            <label className="control-label">Add Members</label>
            <FilterChecklistDropdown
              noClear={true}
              options={addMembersOptions}
              value={this.state.usersToAdd || List()}
              handleCheck={val => {
                this.setState({usersToAdd: val})
              }}
            />
          </div>

          <div className="form-group">
            <label className="control-label">
              {`Current Members (${currentMembers.length - this.state.usersToDelete.size})`}
            </label>
            <ul className="members-list">
              {currentMembers.map((val) => {
                let className = 'members-list__member '
                className += val.get('toAdd') ? 'members-list__member--new ' : ''
                className += val.get('toDelete') ? 'members-list__member--delete ' : ''
                return(
                  <li key={val.get('email')} className={className}>
                    <span className="members-list__member__label">{val.get('email')}</span>
                    <span className="members-list__member__actions">
                      {val.get('toAdd') && <span className="members-list__member__actions__new">
                        NEW
                      </span>}
                      {val.get('toDelete') ? <Button bsStyle="link" className="undo-label"
                        onClick={() => this.undoDelete(val.get('email'))}>
                        UNDO
                      </Button> :
                      <Button bsStyle="link" className="delete-button"
                        onClick={() => this.deleteMember(val.get('email'))}>
                        <IconClose width="20" height="20"/>
                      </Button>}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
          */}
        </form>
      </SidePanel>
    )
  }
}

GroupForm.propTypes = {
  account: PropTypes.instanceOf(Map).isRequired,
  fields: PropTypes.object,
  group: PropTypes.instanceOf(Map),
  intl: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool,
  users: PropTypes.instanceOf(List)
}

GroupForm.defaultProps = {
  users: List(),
  group: Map()
}

export default reduxForm({
  fields: ['name'],
  form: 'group-edit',
  validate
})(injectIntl(GroupForm))
