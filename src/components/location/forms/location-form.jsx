import React, { PropTypes } from 'react'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Button, Col, Row } from 'react-bootstrap'

import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'
import LoadingSpinnerSmall from '../../loading-spinner/loading-spinner-sm'

import './location-form.scss'

/** validator
 * Returns common error message for required state if value invalid or undefined if valid;
 * @param id {string} - react-intl message id
 */
const required = (id) => (value) => value
  ? undefined
  : (<FormattedMessage
      id="portal.common.error.field.required.text"
      values={{label: <FormattedMessage {...{id}} />}}
    />);

const LocationForm = (props) => {
  const {
    addressFetching,
    cloudProvidersOptions,
    cloudProvidersIdOptions,
    editMode,
    intl,
    invalid,
    onCancel,
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
            placeholder={intl.formatMessage({id: 'portal.location.locationForm.name.placeholder'})}
            component={FieldFormGroup}
            label={<FormattedMessage id="portal.common.name" />}
            validate={[ required("portal.common.name") ]}
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
            validate={[ required("portal.location.locationForm.iataCode.label") ]}
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
            validate={[ required("portal.location.locationForm.latitude.label") ]}
          />
        </Col>
        <Col md={5}>
          <Field
            name="longitude"
            type="text"
            component={FieldFormGroup}
            placeholder={intl.formatMessage({id: 'portal.location.locationForm.longitude.placeholder'})}
            label={<FormattedMessage id="portal.location.locationForm.longitude.label" />}
            validate={[ required("portal.location.locationForm.longitude.label") ]}
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
            label={intl.formatMessage({id: 'portal.location.locationForm.cloudProvider.label'})}
            validate={[ required("portal.location.locationForm.cloudProvider.label") ]}
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
            label={intl.formatMessage({id: 'portal.location.locationForm.cloudProviderId.label'})}
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
            validate={[ required("portal.location.locationForm.cloudProviderLocationId.label") ]}
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
          {editMode
            ? <FormattedMessage id='portal.button.save' />
            : <FormattedMessage id='portal.button.add' />
          }
        </Button>
      </FormFooterButtons>
    </form>
  )};

LocationForm.displayName = 'LocationEditForm';
LocationForm.propTypes = {
  cloudProvidersIdOptions: PropTypes.arrayOf(PropTypes.object),
  cloudProvidersOptions: PropTypes.arrayOf(PropTypes.object),
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  ...reduxFormPropTypes
};

export default reduxForm({
  form: 'locationEditForm'
})(injectIntl(LocationForm))
