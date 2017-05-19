import React, { PropTypes } from 'react'
import {Map, Iterable} from 'immutable'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Accordion, Panel, Button, Table } from 'react-bootstrap'

import { checkForErrors } from '../../../util/helpers'

import SidePanel from '../../../components/shared/side-panel'
import FieldFormGroup from '../../../components/shared/form-fields/field-form-group'
import FormFooterButtons from '../../../components/shared/form-elements/form-footer-buttons'

import { getById as getRoleById } from '../../../redux/modules/entities/roles/selectors'
import { getById as getRoleNameById } from '../../../redux/modules/entities/role-names/selectors'

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
      handleSubmit,
      intl,
      onCancel,
      initialValues: {
        roleName
      }
    } = this.props

    return (
      <SidePanel
        show={true}
        title={intl.formatMessage({ id: 'portal.account.roleEdit.title' })}
        subTitle={roleName}
        cancel={onCancel}
        className='role-edit-form'
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

            {this.props.role.map((resources, service) => {
              return (
                <Accordion>
                  <Panel header={service}>
                    <Table className="table-striped">
                      <tbody>
                        <tr className="resource-header">
                          <th colSpan="2"><FormattedMessage id='portal.accountManagement.resource.text' /></th>
                        </tr>

                        {resources.map((perms, resource) => {
                          return (
                              perms && <tr>
                                <td>
                                  {resource}
                                </td>

                                {
                                  Iterable.isIterable(perms)
                                    && <td>
                                      {
                                        perms.filter(perm => perm.get('allowed')).map((name,key) => {
                                          return key
                                        }).join(', ')
                                      }
                                      </td>
                                }
                              </tr>
                          )
                        }).toArray()
                        }
                      </tbody>
                  </Table>
              </Panel>
            </Accordion>

              )
            }).toArray()
            }

          <FormFooterButtons>
              {/*
                 Needs to be put inside [] as FormFooterButtons is expecting array of components
              */}
              {[<Button
                key='cancel-btn'
                id="cancel-btn"
                className="btn-secondary"
                onClick={onCancel}
              >
                <FormattedMessage id="portal.button.cancel"/>
              </Button>]}
          </FormFooterButtons>
        </form>
      </SidePanel>
    )
  }
}

RoleEditForm.displayName = 'RoleEditForm'
RoleEditForm.propTypes = {
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  intl: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  role: PropTypes.instanceOf(Map)
}

RoleEditForm.defaultProps = {
  role: Map()
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {

  const role = getRoleById(state, ownProps.roleId)
  const roleNameEntity = getRoleNameById(state, ownProps.roleId)

  const roleName = roleNameEntity && roleNameEntity.get('name')

  return {
    role,
    initialValues: {
      roleName
    }
  }
}

const form = reduxForm({
  form: 'role-edit',
  validate
})(RoleEditForm)

export default connect(mapStateToProps)(injectIntl(form))
