import React, { PropTypes } from 'react'
import { reduxForm, Field } from 'redux-form'
import FieldFormGroup from '../form/field-form-group'
import FieldFormGroupSelect from '../form/field-form-group-select'
import FormFooterButtons from '../form/form-footer-buttons'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { List } from 'immutable'
import {
  Button,
  Table
} from 'react-bootstrap'

import LoadingSpinner from '../loading-spinner/loading-spinner'
import ActionButtons from '../../components/action-buttons'
import TruncatedTitle from '../../components/truncated-title'

import {
  checkForErrors
} from '../../util/helpers'
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
    { name: <FormattedMessage id="portal.account.groupForm.name.required.error"/> }
  )
}

const GroupForm = ({
  accountIsServiceProviderType,
  canEditBilling,
  canSeeBilling,
  groupId,
  handleSubmit,
  hosts,
  intl,
  invalid,
  isFetchingHosts,
  onCancel,
  onDeleteHost,
  onSubmit}) => {

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}>
      <Field
        type="text"
        name="name"
        id="name-field"
        placeholder={intl.formatMessage({id: 'portal.account.groupForm.name.text'})}
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.account.groupForm.name.label" />}/>

        {canSeeBilling &&
          <Field
            name="charge_id"
            disabled={!canEditBilling}
            placeholder={intl.formatMessage({id: 'portal.account.groupForm.charge_id.text'})}
            component={FieldFormGroup}
            label={intl.formatMessage({id:"portal.account.groupForm.charge_number.label"})}
            required={false}/>
        }

        {canSeeBilling &&
          <Field
            name="charge_model"
            disabled={!canEditBilling}
            numericValues={true}
            placeholder={intl.formatMessage({id: 'portal.account.groupForm.name.text'})}
            component={FieldFormGroupSelect}
            options={[
              [1, intl.formatMessage({ id: "portal.account.groupForm.charge_model.option.percentile" })],
              [2, intl.formatMessage({ id: "portal.account.groupForm.charge_model.option.bytesDelivered" })]
            ]}
            label={intl.formatMessage({id: "portal.account.groupForm.charge_model.label"})}
            required={false}/>
          }

          <hr/>

          {(!accountIsServiceProviderType && groupId) &&
            <div>
              <label><FormattedMessage id="portal.accountManagement.groupProperties.text"/></label>
              {isFetchingHosts ? <LoadingSpinner/> :
                !hosts.isEmpty() ?
                      <Table striped={true} className="fixed-layout">
                    <thead>
                    <tr>
                      <th>
                        <FormattedMessage id="portal.accountManagement.groupPropertiesName.text"/>
                      </th>
                          <th className="one-button-cell" />
                    </tr>
                    </thead>
                    <tbody>
                    {hosts.map((host, i) => {
                      return (
                        <tr key={i}>
                              <td><TruncatedTitle content={host} /></td>
                          <td>
                            <ActionButtons
                              onDelete={() => onDeleteHost(host)}/>
                          </td>
                        </tr>
                      )
                    })}
                    </tbody>
                  </Table>
                : <p><FormattedMessage id="portal.accountManagement.noGroupProperties.text"/></p>
              }
            </div>
          }
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
            disabled={invalid}>
            {groupId ? <FormattedMessage id='portal.button.save' /> : <FormattedMessage id='portal.button.add' />}
          </Button>
        </FormFooterButtons>
    </form>
  )
}

GroupForm.displayName = "GroupForm"

GroupForm.propTypes = {
  accountIsServiceProviderType: PropTypes.bool.isRequired,
  canEditBilling: PropTypes.bool,
  canSeeBilling: PropTypes.bool,
  groupId: PropTypes.number,
  handleSubmit: PropTypes.func,
  hosts: PropTypes.instanceOf(List),
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  isFetchingHosts: PropTypes.bool,
  onCancel: PropTypes.func,
  onDeleteHost: PropTypes.func,
  onSubmit: PropTypes.func
}

export default reduxForm({
  form: 'groupEdit',
  validate
})(injectIntl(GroupForm))
