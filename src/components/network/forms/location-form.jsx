import React, { PropTypes } from 'react'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { ButtonToolbar, Button, Col, Row } from 'react-bootstrap'

import { checkForErrors } from '../../../util/helpers'
import MultilineTextFieldError from '../../shared/forms/multiline-text-field-error'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'
import LoadingSpinnerSmall from '../../loading-spinner/loading-spinner-sm'

import { isValidLatitude, isValidLongtitude , isValidTextField} from '../../../util/validators.js'

import {LOCATION_NAME_MIN_LENGTH,
        LOCATION_NAME_MAX_LENGTH,
        IATA_FIXED_LENGTH,
        CLOUD_PROVIDER_REGION_MIN_LENGTH,
        CLOUD_PROVIDER_REGION_MAX_LENGTH,
        CLOUD_PROVIDER_LOCATION_ID_MIN_LENGTH,
        CLOUD_PROVIDER_LOCATION_ID_MAX_LENGTH
      } from '../../../constants/network.js'

import './styles/location-form.scss'

const validate = fields => {
  const customConditions = {
    name: [
      {
        condition: !isValidTextField(fields.name, LOCATION_NAME_MIN_LENGTH, LOCATION_NAME_MAX_LENGTH),
        errorText: (
          <MultilineTextFieldError
            fieldLabel={'portal.network.locationForm.name.label'}
            minValue={LOCATION_NAME_MIN_LENGTH}
            maxValue={LOCATION_NAME_MAX_LENGTH}/>
        )
      }
    ],
    iataCode: [
      {
        condition: fields.iataCode.length !== IATA_FIXED_LENGTH,
        errorText: (
          <div>
            <FormattedMessage id='portal.network.locationForm.iataCode.invalid.error' />
          </div>
        )
      }
    ],
    latitude: [
      {
        condition: ! isValidLatitude(fields.latitude),
        errorText: (
          <div>
            <FormattedMessage id='portal.network.locationForm.latitude.invalid.error' />
          </div>
        )
      }
    ],
    longtitude: [
      {
        condition: ! isValidLongtitude(fields.longtitude),
        errorText: (
          <div>
            <FormattedMessage id='portal.network.locationForm.longtitude.invalid.error' />
          </div>
        )
      }
    ],
    cloudProviderRegion: [
      {
        condition: !isValidTextField(fields.cloudProviderRegion, CLOUD_PROVIDER_REGION_MIN_LENGTH, CLOUD_PROVIDER_REGION_MAX_LENGTH),
        errorText: (
          <MultilineTextFieldError
            fieldLabel={'portal.network.locationForm.name.label'}
            minValue={CLOUD_PROVIDER_REGION_MIN_LENGTH}
            maxValue={CLOUD_PROVIDER_REGION_MAX_LENGTH}/>
        )
      }
    ],
    cloudProviderLocationId: [
      {
        condition: !isValidTextField(fields.cloudProviderLocationId, CLOUD_PROVIDER_LOCATION_ID_MIN_LENGTH, CLOUD_PROVIDER_LOCATION_ID_MAX_LENGTH),
        errorText: (
          <MultilineTextFieldError
            fieldLabel={'portal.network.locationForm.name.label'}
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

  return checkForErrors(fields, customConditions, requiredTexts);
}

const NetworkLocationForm = (props) => {
  const {
    addressFetching,
    cloudProvidersOptions,
    cloudProvidersIdOptions,
    edit,
    fetching,
    intl,
    invalid,
    onCancel,
    onDelete,
    handleSubmit
  } = props;

  return (
    <form
      className="location-form"
      onSubmit={handleSubmit}
    >
      <Row>
        <Col md={7}>
          <Field
            name="name"
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
            type="text"
            placeholder={intl.formatMessage({id: 'portal.network.locationForm.iataCode.placeholder'})}
            component={FieldFormGroup}
            label={<FormattedMessage id="portal.network.locationForm.iataCode.label" />}
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
          />
        </Col>
        <Col md={5}>
          <Field
            name="longitude"
            type="text"
            component={FieldFormGroup}
            placeholder={intl.formatMessage({id: 'portal.network.locationForm.longitude.placeholder'})}
            label={<FormattedMessage id="portal.network.locationForm.longitude.label" />}
          />
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <div>
            <FormattedMessage id="portal.network.locationForm.latLongFields.helperText.address" />
          </div>
          <div>
            <FormattedMessage id="portal.network.locationForm.latLongFields.helperTextHint.address" />
          </div>
          { addressFetching && <LoadingSpinnerSmall /> }
        </Col>
      </Row>
      <Row>
        <Col md={7}>
          <Field
            name="cloudName"
            type="select"
            options={cloudProvidersOptions}
            component={FieldFormGroupSelect}
            label={intl.formatMessage({id: 'portal.network.locationForm.cloudProvider.label'})}
          />
        </Col>
      </Row>
      <Row>
        <Col md={7}>
          <Field
            name="cloudProvider"
            type="select"
            options={cloudProvidersIdOptions}
            required={false}
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
          />
        </Col>
      </Row>

      <FormFooterButtons autoAlign={false}>
        { edit &&
          <ButtonToolbar className="pull-left">
            <Button
              className="btn-danger"
              disabled={fetching}
              onClick={onDelete}
            >
              <FormattedMessage id="portal.button.delete"/>
            </Button>
          </ButtonToolbar>
        }
        <ButtonToolbar className="pull-right">
          <Button
            className="btn-secondary"
            onClick={onCancel}
          >
            <FormattedMessage id="portal.button.cancel"/>
          </Button>
          <Button
            type="submit"
            bsStyle="primary"
            disabled={invalid || fetching}
          >
            {edit
              ? <FormattedMessage id='portal.button.save' />
              : <FormattedMessage id='portal.button.add' />
            }
          </Button>
        </ButtonToolbar>
      </FormFooterButtons>
    </form>
  )};

NetworkLocationForm.displayName = 'NetworkLocationEditForm';
NetworkLocationForm.propTypes = {
  cloudProvidersIdOptions: PropTypes.arrayOf(PropTypes.object),
  cloudProvidersOptions: PropTypes.arrayOf(PropTypes.object),
  edit: PropTypes.bool,
  fetching: PropTypes.bool,
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  ...reduxFormPropTypes
};

export default reduxForm({
  form: 'networkLocationForm',
  validate
})(injectIntl(NetworkLocationForm))
