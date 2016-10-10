import React, { PropTypes } from 'react'
import { reduxForm, getValues } from 'redux-form'
import {FormattedMessage, injectIntl} from 'react-intl'
import { Map, List } from 'immutable'
import {
  Modal,
  Input,
  ButtonToolbar,
  Button
} from 'react-bootstrap'

import SelectWrapper from '../select-wrapper'
// import FilterChecklistDropdown from '../filter-checklist-dropdown/filter-checklist-dropdown.jsx'
// import IconClose from '../icons/icon-close.jsx'

import { checkForErrors } from '../../util/helpers'
import { isValidAccountName } from '../../util/validators'

import './group-form.scss'

const validate = ({ name }) => {
  const conditions = {
    name: {
      condition: !isValidAccountName(name),
      errorText:
        <div>
          <FormattedMessage id="portal.account.groupForm.name.validation.error"/>,
          <div key={1}>
            <div style={{marginTop: '0.5em'}}>
              <FormattedMessage id="portal.account.manage.nameValidationRequirements.line1.text" />
              <ul>
                <li><FormattedMessage id="portal.account.manage.nameValidationRequirements.line2.text" /></li>
                <li><FormattedMessage id="portal.account.manage.nameValidationRequirements.line3.text" /></li>
              </ul>
            </div>
          </div>
        </div>
    }
  }
  return checkForErrors(
    { name },
    conditions,
    { name: <FormattedMessage id="portal.account.groupForm.name.validation.error"/> }
  )
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

  save() {
    const { formValues, groupId, invalid, onSave } = this.props
    if(!invalid) {
      // TODO: enable this when API is ready
      //const members = this.getMembers()
      formValues.charge_model === null && delete formValues.charge_model
      if (groupId) {
        onSave(
          groupId,
          formValues,
          this.state.usersToAdd,
          this.state.usersToDelete
        )
      } else {
        onSave(this.props.formValues, this.state.usersToAdd)
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
    return this.state.usersToAdd.size || this.state.usersToDelete.size
  }

  render() {
    const {
      fields: {
        name,
        charge_id,
        charge_model
      },
      invalid,
      show,
      onCancel,
      groupId,
      account,
      intl } = this.props
    // const currentMembers = this.props.users.reduce((members, user) => {
    //   if (this.state.usersToAdd.includes(user.get('email'))) {
    //     return [user.set('toAdd', true), ...members]
    //   }
    //   if (this.state.usersToDelete.includes(user.get('email'))) {
    //     return [...members, user.set('toDelete', true)]
    //   }
    //   if (user.get('group_id').includes(this.props.group.get('id'))) {
    //     return [...members, user]
    //   }
    //   return members
    // }, [])


    // const addMembersOptions = fromJS(this.props.users.reduce((arr, user) => {
    //   const userEmail = user.get('email')
    //   if(!user.get('group_id').includes(this.props.group.get('id'))) {
    //     return [...arr, {label: userEmail, value: userEmail}]
    //   }
    //   return arr;
    // }, []))

    const title = groupId ? <FormattedMessage id="portal.account.groupForm.editGroup.title"/> : <FormattedMessage id="portal.account.groupForm.newGroup.title"/>
    const subTitle = groupId ? `${account.get('name')} / ${name.value}` : account.get('name')

    return (
      <Modal dialogClassName="group-form-sidebar configuration-sidebar" show={show}>
        <Modal.Header>
          <h1>{title}</h1>
          <p>{subTitle}</p>
        </Modal.Header>

        <Modal.Body>
          <form>

              <Input
                {...name}
                type="text"
                label={intl.formatMessage({id: 'portal.account.groupForm.name.label'})}
                placeholder={intl.formatMessage({id: 'portal.account.groupForm.name.text'})}/>
              {name.touched && name.error &&
              <div className='error-msg'>{name.error}</div>}

              {charge_id &&
                <div>
                  <Input
                    {...charge_id}
                    type="text"
                    label={intl.formatMessage({id: 'portal.account.groupForm.charge_id.label'})}
                    placeholder={intl.formatMessage({id: 'portal.account.groupForm.charge_id.text'})}/>
                  {charge_id.touched && charge_id.error &&
                  <div className='error-msg'>{charge_id.error}</div>}
                </div>
              }

              {charge_model &&
                <div>
                  <SelectWrapper
                    {...charge_model}
                    numericValues={true}
                    options={[[1, '95/5'], [2, 'Bytes Delivered']]}
                    value={charge_model.value}
                    label={intl.formatMessage({id: 'portal.account.groupForm.charge_model.label'})}/>
                  {charge_model.touched && charge_model.error &&
                  <div className='error-msg'>{charge_model.error}</div>}
                </div>
              }
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
              <ButtonToolbar className="text-right extra-margin-top">
                <Button className="btn-outline" onClick={onCancel}>Cancel</Button>
                <Button disabled={invalid} bsStyle="primary"
                        onClick={this.save}>{groupId ? <FormattedMessage id="portal.button.save"/> : <FormattedMessage id="portal.button.add"/>}</Button>
              </ButtonToolbar>
          </form>
        </Modal.Body>
      </Modal>
    )
  }
}

GroupForm.propTypes = {
  account: PropTypes.instanceOf(Map).isRequired,
  fields: PropTypes.object,
  formValues: PropTypes.object,
  groupId: PropTypes.number,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool,
  users: PropTypes.instanceOf(List)
}

GroupForm.defaultProps = {
  users: List()
}

function mapStateToProps({ user, group, account, form }, { groupId }) {
  const isContentProviderAdmin = user.get('currentUser').get('roles').includes(2)
  return {
    formValues: getValues(form.groupEdit),
    users: user.get('allUsers'),
    account: account.get('activeAccount'),
    fields: isContentProviderAdmin ? [ 'name', 'charge_model', 'charge_id' ] : ['name'],
    initialValues: groupId ? group.get('activeGroup').toJS() : {}
  }
}

export default reduxForm({
  fields: ['name', 'charge_id', 'charge_model'],
  form: 'groupEdit',
  validate
}, mapStateToProps)(injectIntl(GroupForm))
