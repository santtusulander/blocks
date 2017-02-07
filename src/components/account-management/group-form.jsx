import React, { PropTypes } from 'react'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import FieldFormGroup from '../form/field-form-group'
import FormFooterButtons from '../form/form-footer-buttons'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { List } from 'immutable'
import { ButtonToolbar, Button, Table } from 'react-bootstrap'

import IconAdd from '../icons/icon-add'
import UDNButton from '../button'
import LoadingSpinner from '../loading-spinner/loading-spinner'
import ActionButtons from '../../components/action-buttons'
import TruncatedTitle from '../../components/truncated-title'
import MultilineTextFieldError from '../shared/forms/multiline-text-field-error'
import ServiceOptionSelector from './service-option-selector'

import {
  checkForErrors
} from '../../util/helpers'
import { isValidTextField } from '../../util/validators'

import './group-form.scss'

const validate = ({ name }) => {
  const conditions = {
    name: {
      condition: !isValidTextField(name),
      errorText: <MultilineTextFieldError fieldLabel="portal.account.groupForm.name.label" />
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
  accountIsContentProviderType,
  canSeeLocations,
  groupId,
  handleSubmit,
  hosts,
  intl,
  invalid,
  isFetchingHosts,
  isFetchingLocations,
  locations,
  onCancel,
  onDelete,
  onDeleteHost,
  onShowLocation,
  onSubmit,
  serviceOptions,
  showServiceItemForm,
  submitting
}) => {
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

        <hr/>

        {(accountIsContentProviderType) &&
          <div>
            <Field
              name="services"
              component={ServiceOptionSelector}
              showServiceItemForm={showServiceItemForm}
              options={serviceOptions}
              label={<FormattedMessage id="portal.account.groupForm.services_options.title" />}
            />
            <hr/>
          </div>
        }

        {(canSeeLocations && groupId) &&
          <div>
            <label><FormattedMessage id="portal.accountManagement.locations.text"/></label>
            <UDNButton className="pull-right" bsStyle="success" icon={true} addNew={true} onClick={() => onShowLocation(null)}>
              <IconAdd/>
            </UDNButton>
            {isFetchingLocations ? <LoadingSpinner/> :
              !locations.isEmpty() ?
                <Table striped={true} className="fixed-layout">
                  <tbody>
                  {locations.map((location, index) => {
                    return (
                      <tr key={index}>
                        <td>
                            <h5><strong>{location.get('cityName')}</strong></h5>
                            <div className="text-sm">{location.get('iataCode')}</div>
                        </td>
                        <td className="one-button-cell">
                          <ActionButtons
                            onEdit={() => onShowLocation(location.get('reduxId'))}/>
                        </td>
                      </tr>
                    )
                  })}
                  </tbody>
                </Table>
              : <p><FormattedMessage id="portal.accountManagement.noLocations.text"/></p>
            }
          </div>
        }

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
        <FormFooterButtons autoAlign={false}>
          { (groupId && onDelete) &&
            <ButtonToolbar className="pull-left">
              <Button
                className="btn-danger"
                disabled={submitting}
                onClick={onDelete}
              >
                <FormattedMessage id="portal.button.delete"/>
              </Button>
            </ButtonToolbar>
          }
          <ButtonToolbar className="pull-right">
            <Button
              id="cancel-btn"
              className="btn-secondary"
              onClick={onCancel}>
              <FormattedMessage id="portal.button.cancel"/>
            </Button>

            <Button
              type="submit"
              bsStyle="primary"
              disabled={invalid || submitting}>
              {groupId ? <FormattedMessage id='portal.button.save' /> : <FormattedMessage id='portal.button.add' />}
            </Button>
          </ButtonToolbar>
        </FormFooterButtons>
    </form>
  )
}

GroupForm.displayName = "GroupForm"

GroupForm.propTypes = {
  accountIsContentProviderType: PropTypes.bool.isRequired,
  accountIsServiceProviderType: PropTypes.bool.isRequired,
  canSeeLocations: PropTypes.bool,
  groupId: PropTypes.number,
  handleSubmit: PropTypes.func,
  hosts: PropTypes.instanceOf(List),
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  isFetchingHosts: PropTypes.bool,
  isFetchingLocations: PropTypes.bool,
  locations: PropTypes.instanceOf(List),
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onDeleteHost: PropTypes.func,
  onShowLocation: PropTypes.func,
  onSubmit: PropTypes.func,
  serviceOptions: PropTypes.array,
  showServiceItemForm: PropTypes.func,
  ...reduxFormPropTypes
}

export default reduxForm({
  form: 'groupEdit',
  validate
})(injectIntl(GroupForm))
