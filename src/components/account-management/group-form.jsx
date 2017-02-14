import React, { PropTypes } from 'react'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import FieldFormGroup from '../form/field-form-group'
import FieldFormGroupSelect from '../form/field-form-group-select'
import FormFooterButtons from '../form/form-footer-buttons'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { List } from 'immutable'
import { Button, Table } from 'react-bootstrap'

import IconAdd from '../icons/icon-add'
import UDNButton from '../button'
import LoadingSpinner from '../loading-spinner/loading-spinner'
import ActionButtons from '../../components/action-buttons'
import TruncatedTitle from '../../components/truncated-title'
import ButtonDisableTooltip from '../../components/button-disable-tooltip'
import MultilineTextFieldError from '../shared/forms/multiline-text-field-error'
import SectionContainer from '../layout/section-container'
import SectionHeader from '../layout/section-header'
import HelpTooltip from '../../components/help-tooltip'

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
  canEditBilling,
  canSeeBilling,
  canSeeLocations,
  groupId,
  handleSubmit,
  hosts,
  intl,
  invalid,
  isFetchingHosts,
  isFetchingEntities,
  locations,
  hasNetworks,
  onCancel,
  onDelete,
  onDeleteHost,
  onShowLocation,
  onSubmit,
  submitting}) => {

  return (
    <form className="group-form" onSubmit={handleSubmit(onSubmit)}>
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

          {(canSeeLocations && groupId) &&
            <SectionContainer>
              <SectionHeader
                sectionSubHeaderTitle={<label><FormattedMessage id="portal.accountManagement.locations.text"/> *</label>}
                addonAfter={
                  <HelpTooltip
                    id="tooltip-help"
                    title={<FormattedMessage id="portal.accountManagement.locations.text"/>}>
                    <FormattedMessage id="portal.accountManagement.locations.tooltip.message" />
                  </HelpTooltip>
                }
                >
                <UDNButton className="pull-right" bsStyle="success" icon={true} addNew={true} onClick={() => onShowLocation(null)}>
                  <IconAdd/>
                </UDNButton>
              </SectionHeader>
              {isFetchingEntities ? <LoadingSpinner/> :
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
            </SectionContainer>
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
        <FormFooterButtons>
          {(groupId && onDelete) &&
            <ButtonDisableTooltip
              id="delete-btn"
              className="btn-danger pull-left"
              disabled={submitting || isFetchingEntities || hasNetworks}
              onClick={onDelete}
              tooltipId="tooltip-help"
              tooltipMessage={{text :intl.formatMessage({id: "portal.network.groupForm.delete.tooltip.message"})}}>
              <FormattedMessage id="portal.button.delete"/>
            </ButtonDisableTooltip>
          }

          <Button
            id="cancel-btn"
            className="btn-secondary"
            onClick={onCancel}>
            <FormattedMessage id="portal.button.cancel"/>
          </Button>

          <Button
            type="submit"
            bsStyle="primary"
            disabled={invalid || submitting || isFetchingEntities || (canSeeLocations && locations.isEmpty())}>
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
  canSeeLocations: PropTypes.bool,
  groupId: PropTypes.number,
  handleSubmit: PropTypes.func,
  hasNetworks: PropTypes.bool,
  hosts: PropTypes.instanceOf(List),
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  isFetchingEntities: PropTypes.bool,
  isFetchingHosts: PropTypes.bool,
  locations: PropTypes.instanceOf(List),
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onDeleteHost: PropTypes.func,
  onShowLocation: PropTypes.func,
  onSubmit: PropTypes.func,
  ...reduxFormPropTypes
}

export default reduxForm({
  form: 'groupEdit',
  validate
})(injectIntl(GroupForm))
