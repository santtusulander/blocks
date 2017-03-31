import React, { PropTypes } from 'react'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Button, Col, Row } from 'react-bootstrap'

import { checkForErrors } from '../../../util/helpers'
import MultilineTextFieldError from '../../shared/forms/multiline-text-field-error'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupTypeahead from '../../form/field-form-group-typeahead'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'
import LoadingSpinnerSmall from '../../loading-spinner/loading-spinner-sm'
import IsAllowed from '../../is-allowed'

import { DELETE_LOCATION, MODIFY_LOCATION } from '../../../constants/permissions'
import { isValidLatitude, isValidLongitude, isValidTextField } from '../../../util/validators.js'

import {
  LOCATION_NAME_MIN_LENGTH,
  LOCATION_NAME_MAX_LENGTH,
  CLOUD_PROVIDER_REGION_MIN_LENGTH,
  CLOUD_PROVIDER_REGION_MAX_LENGTH,
  CLOUD_PROVIDER_LOCATION_ID_MIN_LENGTH,
  CLOUD_PROVIDER_LOCATION_ID_MAX_LENGTH
} from '../../../constants/network.js'


const validate = ({
  name = '',
  iataCode,
  latitude = '',
  longitude = '',
  cloudProviderRegion,
  cloudProviderLocationId = '' }) => {
  const customConditions = {
    name: [
      {
        condition: !isValidTextField(name, LOCATION_NAME_MIN_LENGTH, LOCATION_NAME_MAX_LENGTH),
        errorText: (
          <MultilineTextFieldError
            fieldLabel={'portal.network.locationForm.name.label'}
            minValue={LOCATION_NAME_MIN_LENGTH}
            maxValue={LOCATION_NAME_MAX_LENGTH}/>
        )
      }
    ],
    latitude: [
      {
        condition: ! isValidLatitude(latitude),
        errorText: (
          <div>
            <FormattedMessage id='portal.network.locationForm.latitude.invalid.error' />
          </div>
        )
      }
    ],
    longitude: [
      {
        condition: ! isValidLongitude(longitude),
        errorText: (
          <div>
            <FormattedMessage id='portal.network.locationForm.longitude.invalid.error' />
          </div>
        )
      }
    ],
    cloudProviderLocationId: [
      {
        condition: !isValidTextField(cloudProviderLocationId, CLOUD_PROVIDER_LOCATION_ID_MIN_LENGTH, CLOUD_PROVIDER_LOCATION_ID_MAX_LENGTH),
        errorText: (
          <MultilineTextFieldError
            fieldLabel={'portal.network.locationForm.cloudProviderLocationId.label'}
            minValue={CLOUD_PROVIDER_LOCATION_ID_MIN_LENGTH}
            maxValue={CLOUD_PROVIDER_LOCATION_ID_MAX_LENGTH}/>
        )
      }
    ]
  }

  const requiredTexts = {
    name: <FormattedMessage id='portal.network.locationForm.name.required.error'/>,
    iataCode: <FormattedMessage id='portal.network.locationForm.iataCode.required.error'/>,
    latitude: <FormattedMessage id='portal.network.locationForm.latitude.required.error'/>,
    longitude: <FormattedMessage id='portal.network.locationForm.longitude.required.error'/>,
    cloudName: <FormattedMessage id='portal.network.locationForm.cloudProvider.required.error'/>,
    cloudProviderLocationId: <FormattedMessage id='portal.network.locationForm.cloudProviderLocationId.required.error'/>
  };

  const errors = checkForErrors(
    { name, iataCode, latitude, longitude, cloudProviderLocationId },
    customConditions,
    requiredTexts
  );

  if (cloudProviderRegion && !isValidTextField(cloudProviderRegion, CLOUD_PROVIDER_REGION_MIN_LENGTH, CLOUD_PROVIDER_REGION_MAX_LENGTH)) {
    errors.cloudProviderRegion = (
      <MultilineTextFieldError
        fieldLabel={'portal.network.locationForm.cloudProviderRegion.text'}
        minValue={CLOUD_PROVIDER_REGION_MIN_LENGTH}
        maxValue={CLOUD_PROVIDER_REGION_MAX_LENGTH}/>
    )
  }

  return errors

}

const NetworkLocationForm = (props) => {
  const {
    addressLine,
    askForFetchLocation,
    cloudProvidersIdOptions,
    cloudProvidersOptions,
    edit,
    error,
    handleSubmit,
    iataCodes,
    intl,
    invalid,
    isFetchingLocation,
    onCancel,
    onDelete,
    submitting,
    readOnly
  } = props;

  const actionButtonTitle = submitting ? <FormattedMessage id="portal.button.saving"/> :
    edit ? <FormattedMessage id="portal.button.save"/> :
      <FormattedMessage id="portal.button.add"/>

  return (
    <form className="sp-location-form" onSubmit={handleSubmit}>

      {
        error &&
        <p className='has-error'>
          <span className='help-block'>{error}</span>
        </p>
      }

      <Row>
        <Col md={7}>
          <Field
            name="name"
            disabled={edit || readOnly}
            type="text"
            placeholder={intl.formatMessage({id: 'portal.network.locationForm.name.placeholder'})}
            component={FieldFormGroup}
            label={<FormattedMessage id="portal.common.name" />}
          />
        </Col>
      </Row>
      <Row>
        <Col md={7}>
          <Field
            name="iataCode"
            options={iataCodes}
            emptyLabel={intl.formatMessage({id: 'portal.analytics.dropdownMenu.noResults'})}
            filterBy={['iata', 'city', 'country']}
            labelKey={'iata'}
            placeholder={intl.formatMessage({id: 'portal.network.locationForm.iataCode.placeholder'})}
            component={FieldFormGroupTypeahead}
            label={<FormattedMessage id="portal.network.locationForm.iataCode.label" />}
            disabled={readOnly}
          />
        </Col>
      </Row>
      <Row>
        <Col md={5}>
          <Field
            name="latitude"
            type="text"
            component={FieldFormGroup}
            placeholder={intl.formatMessage({id: 'portal.network.locationForm.latitude.placeholder'})}
            label={<FormattedMessage id="portal.network.locationForm.latitude.label" />}
            onBlur={askForFetchLocation}
            disabled={readOnly}
          />
        </Col>
        <Col md={5}>
          <Field
            name="longitude"
            type="text"
            component={FieldFormGroup}
            placeholder={intl.formatMessage({id: 'portal.network.locationForm.longitude.placeholder'})}
            label={<FormattedMessage id="portal.network.locationForm.longitude.label" />}
            onBlur={askForFetchLocation}
            disabled={readOnly}
          />
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <div>
            <FormattedMessage id="portal.network.locationForm.latLongFields.helperText.address" />
          </div>
          {isFetchingLocation ?
            <div>
              <LoadingSpinnerSmall/>
              <FormattedMessage id="portal.network.locationForm.latLongFields.helperTextLoading.address"/>
            </div> :
            <p>{addressLine}</p>
          }
        </Col>
      </Row>
      <Row>
        <Col md={7}>
          <Field
            name="cloudName"
            className="input-select"
            type="select"
            options={cloudProvidersOptions}
            component={FieldFormGroupSelect}
            label={intl.formatMessage({id: 'portal.network.locationForm.cloudProvider.label'})}
            disabled={readOnly}
          />
        </Col>
      </Row>
      <Row>
        <Col md={7}>
          <Field
            name="cloudProvider"
            className="input-select"
            type="select"
            options={cloudProvidersIdOptions}
            disabled={edit || readOnly}
            required={false}
            unselectedValue={null}
            component={FieldFormGroupSelect}
            label={intl.formatMessage({id: 'portal.network.locationForm.cloudProviderId.label'})}
          />
        </Col>
      </Row>
      <Row>
        <Col md={7}>
          <Field
            name="cloudProviderRegion"
            required={false}
            type="text"
            component={FieldFormGroup}
            placeholder={intl.formatMessage({id: 'portal.network.locationForm.cloudProviderRegion.placeholder'})}
            label={<FormattedMessage id="portal.network.locationForm.cloudProviderRegion.label" />}
            disabled={readOnly}
          />
        </Col>
      </Row>
      <Row>
        <Col md={7}>
          <Field
            name="cloudProviderLocationId"
            type="text"
            component={FieldFormGroup}
            placeholder={intl.formatMessage({id: 'portal.network.locationForm.cloudProviderLocationId.placeholder'})}
            label={<FormattedMessage id="portal.network.locationForm.cloudProviderLocationId.label" />}
            disabled={readOnly}
          />
        </Col>
      </Row>

      <FormFooterButtons>
        { edit &&
          <IsAllowed to={DELETE_LOCATION}>
            <Button
              className="btn-danger pull-left"
              disabled={submitting}
              onClick={handleSubmit(onDelete)}
            >
              <FormattedMessage id="portal.button.delete"/>
            </Button>
          </IsAllowed>
        }
        <Button
          className="btn-secondary"
          onClick={onCancel}
        >
          <FormattedMessage id="portal.button.cancel"/>
        </Button>
        <IsAllowed to={MODIFY_LOCATION}>
          <Button
            type="submit"
            bsStyle="primary"
            disabled={invalid || submitting || isFetchingLocation}
          >
            {actionButtonTitle}
          </Button>
        </IsAllowed>
      </FormFooterButtons>
    </form>
  )};

NetworkLocationForm.displayName = 'NetworkLocationEditForm';
NetworkLocationForm.propTypes = {
  cloudProvidersIdOptions: PropTypes.arrayOf(PropTypes.object),
  cloudProvidersOptions: PropTypes.arrayOf(PropTypes.object),
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  readOnly: PropTypes.bool,
  ...reduxFormPropTypes
};

export default reduxForm({
  form: 'networkLocationForm',
  validate
})(injectIntl(NetworkLocationForm))
