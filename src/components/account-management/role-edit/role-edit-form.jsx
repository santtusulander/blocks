import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button, Table } from 'react-bootstrap'

import { checkForErrors } from '../../../util/helpers'

import SidePanel from '../../shared/side-panel'
import FieldFormGroup from '../../shared/form-fields/field-form-group'
import FieldFormGroupToggle from '../../shared/form-fields/field-form-group-toggle'
import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'

const validate = ({ roleName }) => {
  const conditions = {}

  return checkForErrors({ roleName }, conditions)

}

class RoleEditForm extends React.Component {

  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(values) {
    const { onSave } = this.props
    // Add needed arguments when onSave actually does something...
    return onSave(values)
  }

  render() {
    const {
      dirty,
      handleSubmit,
      intl,
      invalid,
      onCancel,
      permissions,
      show,
      submitting,
      editPermsUI,
      initialValues: {
        roleName
      }
    } = this.props

    // TODO: Enable in the future when roles are editable, after 0.8
    // const rolesArray = roles.map((role) => {
    //   return {
    //     value: role.get('id'),
    //     label: role.get('name')
    //   }
    // }).toArray()

    const getPermissionName = (permissionKey, section) => {
      return permissions.get(section).find(value => value.get('name') === permissionKey).get('title')
    }

    return (
      <SidePanel
        show={show}
        title={intl.formatMessage({ id: 'portal.account.roleEdit.title' })}
        subTitle={roleName}
        cancel={onCancel}
      >
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <Field
            type="text"
            name="roleName"
            placeholder={intl.formatMessage({ id: 'portal.account.roleEdit.enterRoleName.text' })}
            component={FieldFormGroup}
            disabled={true}
          >
            <FormattedMessage id="portal.account.roleEdit.name.text"/>
          </Field>

          {/* TODO: Enable in the future when roles are editable, after 0.8 */}
          {/*<label><FormattedMessage id="portal.account.roleEdit.roleAvailableTo.title"/></label>*/}

          {/*<CheckboxArray*/}
          {/*iterable={rolesArray}*/}
          {/*field={null}*/}
          {/*inline={true}*/}
          {/*disabled={true}/>*/}

          {/*<hr/>*/}

          <label><FormattedMessage id="portal.account.roleEdit.permissions.label"/></label>

          <Table className="table-striped">
            <thead>
            <tr>
              <th colSpan="3"><FormattedMessage id="portal.account.roleEdit.permission.title"/></th>
            </tr>
            </thead>
            <tbody>
            {editPermsUI.map((permission, key) => {
              return (
                <tr key={key}>
                  <td className="no-border">
                    {getPermissionName(key, 'ui')}
                  </td>
                  <td>
                    {/*TODO: Remove readonly prop in the future when roles are editable*/}
                    <Field
                      readonly={true}
                      name={key}
                      className="pull-right"
                      component={FieldFormGroupToggle}/>
                  </td>
                </tr>
              )
            }).toList()}
            </tbody>
          </Table>

          <FormFooterButtons>
            <Button
              id="cancel-btn"
              className="btn-secondary"
              onClick={onCancel}>
              <FormattedMessage id="portal.button.cancel"/>
            </Button>

            <Button
              type="submit"
              bsStyle="primary"
              disabled={invalid || submitting || !dirty}>
              <FormattedMessage id="portal.button.save"/>
            </Button>
          </FormFooterButtons>
        </form>
      </SidePanel>
    )
  }
}

RoleEditForm.displayName = 'RoleEditForm'
RoleEditForm.propTypes = {
  // roles: PropTypes.object,
  dirty: PropTypes.bool,
  editPermsUI: PropTypes.instanceOf(Immutable.Map),
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  permissions: PropTypes.instanceOf(Immutable.Map),
  show: PropTypes.bool,
  submitting: PropTypes.bool
}

const mapStateToProps = (state, ownProps) => {

  const editPermsUI = Immutable.Map([
    ...ownProps.editRole.getIn(['permissions', 'ui'], Immutable.List())
  ])

  const initialPermissions = ownProps.editRole.getIn(['permissions', 'ui'], Immutable.List()).toJS()

  return {
    editPermsUI,
    initialValues: Object.assign({}, initialPermissions, {
      roleName: ownProps.editRole.get('name') || null,
      roles: null,
      roleTypes: null
    })
  }
}

const mapDispatchToProps = () => {
  return {}
}

const form = reduxForm({
  form: 'role-edit',
  validate
})(RoleEditForm)

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(form))
