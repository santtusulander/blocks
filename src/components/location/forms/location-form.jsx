import React, { PropTypes } from 'react'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'
import LoadingSpinnerSmall from '../../loading-spinner/loading-spinner-sm'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Button, Col, Row } from 'react-bootstrap'

import './location-form.scss'

import { checkForErrors } from '../../../util/helpers'

const validate = ({ name, description }) => {};

const LocationForm = ({
  locationId,
  cloudName,
  cloudProvider,
  cloudRegion,
  cloudLocationId,
  countryCode,
  state,
  cityName,
  iataCode,
  street,
  postalCode,
  lat,
  lon,

  intl,
  invalid,
  onCancel,
  onSubmit,
  handleSubmit

}) => (
  <form
    className="location-form"
    onSubmit={handleSubmit(onSubmit)}
  >
    <Row>
      <Col md={7}>
        <Field
          name="name"
          type="text"
          placeholder={intl.formatMessage({id: 'portal.location.locationForm.name.placeholder'})}
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
          placeholder={intl.formatMessage({id: 'portal.location.locationForm.iataCode.placeholder'})}
          component={FieldFormGroup}
          label={<FormattedMessage id="portal.location.locationForm.iataCode.label" />}
        />
      </Col>
    </Row>
    <Row>
      <Col md={5}>
        <Field
          name="latitude"
          type="text"
          component={FieldFormGroup}
          placeholder={intl.formatMessage({id: 'portal.location.locationForm.latitude.placeholder'})}
          label={<FormattedMessage id="portal.location.locationForm.latitude.label" />}
        />
      </Col>
      <Col md={5}>
        <Field
          name="longitude"
          type="text"
          component={FieldFormGroup}
          placeholder={intl.formatMessage({id: 'portal.location.locationForm.longitude.placeholder'})}
          label={<FormattedMessage id="portal.location.locationForm.longitude.label" />}
        />
      </Col>
    </Row>
    <Row>
      <Col md={4}>
        <div>
          <FormattedMessage id="portal.location.locationForm.latLongFields.helperText.address" />
        </div>
        <div>
          <FormattedMessage id="portal.location.locationForm.latLongFields.helperTextHint.address" />
        </div>
        <LoadingSpinnerSmall />
      </Col>
    </Row>
    <Row>
      <Col md={7}>
        <Field
          style={{ minWidth: '100%'}}
          name="cloudProvider"
          type="select"
          component={FieldFormGroupSelect}
          label={intl.formatMessage({id: 'portal.location.locationForm.cloudProvider.label'})}
        />
      </Col>
    </Row>
    <Row>
      <Col md={7}>
        <Field
          name="cloudProviderId"
          type="select"
          component={FieldFormGroupSelect}
          label={intl.formatMessage({id: 'portal.location.locationForm.cloudProviderId.label'})}
        />
      </Col>
    </Row>
    <Row>
      <Col md={7}>
        <Field
          name="cloudProviderRegion"
          type="text"
          component={FieldFormGroup}
          placeholder={intl.formatMessage({id: 'portal.location.locationForm.cloudProviderRegion.placeholder'})}
          label={<FormattedMessage id="portal.location.locationForm.cloudProviderRegion.label" />}
        />
      </Col>
    </Row>
    <Row>
      <Col md={7}>
        <Field
          name="cloudProviderLocationId"
          type="text"
          component={FieldFormGroup}
          placeholder={intl.formatMessage({id: 'portal.location.locationForm.cloudProviderLocationId.placeholder'})}
          label={<FormattedMessage id="portal.location.locationForm.cloudProviderLocationId.label" />}
        />
      </Col>
    </Row>

    <FormFooterButtons>
      <Button
        className="btn-secondary"
        onClick={onCancel}>
        <FormattedMessage id="portal.button.cancel"/>
      </Button>
      <Button
        type="submit"
        bsStyle="primary"
        disabled={invalid}>
        {false ? <FormattedMessage id='portal.button.save' /> : <FormattedMessage id='portal.button.add' />}
      </Button>
    </FormFooterButtons>
  </form>
);

LocationForm.displayName = 'LocationForm';
LocationForm.propTypes = {

  ...reduxFormPropTypes
};

export default reduxForm({
  form: 'locationForm',
  validate
})(injectIntl(LocationForm))
