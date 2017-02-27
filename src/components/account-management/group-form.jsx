import React, { PropTypes } from 'react'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import FieldFormGroup from '../form/field-form-group'
import FormFooterButtons from '../form/form-footer-buttons'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { List } from 'immutable'
import { Button, Table } from 'react-bootstrap'

import IconAdd from '../icons/icon-add'
import IconEdit from '../icons/icon-edit'
import LoadingSpinner from '../loading-spinner/loading-spinner'
import ActionButtons from '../../components/action-buttons'
import TruncatedTitle from '../../components/truncated-title'
import ButtonDisableTooltip from '../../components/button-disable-tooltip'
import MultilineTextFieldError from '../shared/forms/multiline-text-field-error'
import ServiceOptionSelector from './service-option-selector'
import SectionContainer from '../layout/section-container'
import SectionHeader from '../layout/section-header'
import HelpTooltip from '../../components/help-tooltip'
import IsAllowed from '../../components/is-allowed'
import { CREATE_LOCATION, VIEW_LOCATION, DELETE_GROUP, MODIFY_GROUP } from '../../constants/permissions'

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
  isFetchingEntities,
  locations,
  hasNetworks,
  onCancel,
  onDelete,
  onDeleteHost,
  onShowLocation,
  onSubmit,
  serviceOptions,
  showServiceItemForm,
  submitting
}) => {

  const tooltipHintId = hasNetworks ? "portal.network.groupForm.delete.tooltip.network.message"
                                    : ((canSeeLocations && (!locations.isEmpty()))
                                    ? "portal.network.groupForm.delete.tooltip.location.message" : null)

  let actionButtonTitle = groupId ? <FormattedMessage id='portal.button.save' /> : <FormattedMessage id='portal.button.add' />
  if (submitting) {
    actionButtonTitle = <FormattedMessage id="portal.button.saving"/>
  }

  return (
    <form className="group-form" onSubmit={handleSubmit(onSubmit)}>
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
                <IsAllowed to={CREATE_LOCATION}>
                  <Button
                    className="btn-icon btn-success pull-right"
                    bsStyle="success"
                    icon={true}
                    addNew={true}
                    onClick={() => onShowLocation(null)}>
                    <IconAdd />
                  </Button>
                </IsAllowed>
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
                          <td className="one-button-cell action-buttons primary">
                            <IsAllowed to={VIEW_LOCATION}>
                              <Button
                                className="btn btn-icon edit-button action-buttons primary"
                                onClick={() => onShowLocation(location.get('reduxId'))}>
                                <IconEdit />
                              </Button>
                            </IsAllowed>
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
            <IsAllowed to={DELETE_GROUP}>
              <ButtonDisableTooltip
                id="delete-btn"
                className="btn-danger pull-left"
                disabled={submitting || isFetchingEntities || hasNetworks}
                onClick={onDelete}
                tooltipId="tooltip-help"
                tooltipMessage={tooltipHintId && {text: intl.formatMessage({id: tooltipHintId})}}>
                <FormattedMessage id="portal.button.delete"/>
              </ButtonDisableTooltip>
            </IsAllowed>
          }

          <Button
            id="cancel-btn"
            className="btn-secondary"
            onClick={onCancel}>
            <FormattedMessage id="portal.button.cancel"/>
          </Button>

          <IsAllowed to={MODIFY_GROUP}>
            <Button
              type="submit"
              bsStyle="primary"
              disabled={invalid || submitting || isFetchingEntities}>
              {actionButtonTitle}
            </Button>
          </IsAllowed>
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
  hasNetworks: PropTypes.bool,
  hosts: PropTypes.instanceOf(List),
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  isFetchingEntities: PropTypes.bool,
  isFetchingHosts: PropTypes.bool,
  locationPermissions: PropTypes.object,
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
