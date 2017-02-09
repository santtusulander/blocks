import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field, formValueSelector, touch, change, propTypes as reduxFormPropTypes } from 'redux-form'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Button, Col, Row } from 'react-bootstrap'

import { checkForErrors } from '../../../util/helpers'
import MultilineTextFieldError from '../../shared/forms/multiline-text-field-error'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupTypeahead from '../../form/field-form-group-typeahead'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'
import LoadingSpinnerSmall from '../../loading-spinner/loading-spinner-sm'
import { locationReverseGeoCodingLookup } from '../../../util/network-helpers'
import { isValidLatitude, isValidLongtitude, isValidTextField } from '../../../util/validators.js'

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
  cloudProviderLocationId = ''
}) => {
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
        condition: !isValidLatitude(latitude),
        errorText: (
          <div>
            <FormattedMessage id='portal.network.locationForm.latitude.invalid.error'/>
          </div>
        )
      }
    ],
    longitude: [
      {
        condition: !isValidLongtitude(longitude),
        errorText: (
          <div>
            <FormattedMessage id='portal.network.locationForm.longitude.invalid.error'/>
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

class NetworkLocationForm extends React.Component {
  constructor(props) {
    super(props)

    const { intl } = this.props

    this.state = {
      isFetchingLocation: false,
      addressLine: intl.formatMessage({ id: 'portal.network.locationForm.latLongFields.helperTextHint.address' }),
      latLng: {
        latitude: null,
        longitude: null
      }
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.askForFetchLocation = this.askForFetchLocation.bind(this)
    this.processLatLngFields = this.processLatLngFields.bind(this)
    this.shouldFetchLocation = this.shouldFetchLocation.bind(this)
  }

  componentWillMount() {
    const { initialValues } = this.props;
    const edit = !!initialValues.name

    if (edit && initialValues.latitude && initialValues.longitude) {
      this.setState({
        latLng: {
          latitude: initialValues.latitude,
          longitude: initialValues.longitude
        }
      }, () => this.fetchLocation())
    }
  }

  askForFetchLocation({ target: { value } }, fieldName) {
    this.processLatLngFields(fieldName, value)
      .then(() => {
        if (this.shouldFetchLocation()) {
          this.setState({
            isFetchingLocation: true,
            latLng: this.props.latLng
          })
          this.fetchLocation();
        }
      })
  }

  fetchLocation() {
    const { latLng } = this.state
    locationReverseGeoCodingLookup(latLng.longitude, latLng.latitude)
      .then(({ features }) => {
        this.setState({
          addressLine: features[0].place_name,
          isFetchingLocation: false
        })
      })
      .catch(() => {
        this.setState({
          addressLine: <FormattedMessage id="portal.network.locationForm.latLongFields.addressNotFound"/>,
          isFetchingLocation: false
        })
      })
  }

  shouldFetchLocation() {
    const latLngProps = this.props.latLng
    const latLngState = this.state.latLng
    return !!latLngProps.latitude && !!latLngProps.longitude &&
      isValidLatitude(latLngProps.latitude) &&
      isValidLongtitude(latLngProps.longitude) &&
      (
        parseFloat(latLngProps.latitude) !== parseFloat(latLngState.latitude) ||
        parseFloat(latLngProps.longitude) !== parseFloat(latLngState.longitude)
      )
  }

  // Needed as we're using custom listeners on redux-form Field
  processLatLngFields(fieldName, value) {
    const { changeField, touchField } = this.props
    return new Promise(resolve => {
      changeField(fieldName, value)
      touchField(fieldName)

      return resolve()
    })
  }

  onSubmit(values) {
    this.props.onSubmit(values)
  }

  render() {
    const {
      cloudProvidersOptions,
      cloudProvidersIdOptions,
      error,
      submitting,
      initialValues,
      iataCodes,
      intl,
      invalid,
      onCancel,
      onDelete,
      handleSubmit
    } = this.props;

    const { addressLine, isFetchingLocation } = this.state
    const edit = !!initialValues.name

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
              disabled={edit}
              type="text"
              placeholder={intl.formatMessage({ id: 'portal.network.locationForm.name.placeholder' })}
              component={FieldFormGroup}
              label={<FormattedMessage id="portal.common.name"/>}
            />
          </Col>
        </Row>
        <Row>
          <Col md={7}>
            <Field
              name="iataCode"
              options={iataCodes}
              emptyLabel={intl.formatMessage({ id: 'portal.analytics.dropdownMenu.noResults' })}
              filterBy={['iata', 'city', 'country']}
              labelKey={'iata'}
              placeholder={intl.formatMessage({ id: 'portal.network.locationForm.iataCode.placeholder' })}
              component={FieldFormGroupTypeahead}
              label={<FormattedMessage id="portal.network.locationForm.iataCode.label"/>}
            />
          </Col>
        </Row>
        <Row>
          <Col md={5}>
            <Field
              name="latitude"
              type="text"
              component={FieldFormGroup}
              placeholder={intl.formatMessage({ id: 'portal.network.locationForm.latitude.placeholder' })}
              label={<FormattedMessage id="portal.network.locationForm.latitude.label"/>}
              onBlur={(e) => this.askForFetchLocation(e, 'latitude')}
            />
          </Col>
          <Col md={5}>
            <Field
              name="longitude"
              type="text"
              component={FieldFormGroup}
              placeholder={intl.formatMessage({ id: 'portal.network.locationForm.longitude.placeholder' })}
              label={<FormattedMessage id="portal.network.locationForm.longitude.label"/>}
              onBlur={(e) => this.askForFetchLocation(e, 'longitude')}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4}>
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
              label={intl.formatMessage({ id: 'portal.network.locationForm.cloudProvider.label' })}
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
              required={false}
              component={FieldFormGroupSelect}
              label={intl.formatMessage({ id: 'portal.network.locationForm.cloudProviderId.label' })}
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
              placeholder={intl.formatMessage({ id: 'portal.network.locationForm.cloudProviderRegion.placeholder' })}
              label={<FormattedMessage id="portal.network.locationForm.cloudProviderRegion.label"/>}
            />
          </Col>
        </Row>
        <Row>
          <Col md={7}>
            <Field
              name="cloudProviderLocationId"
              type="text"
              component={FieldFormGroup}
              placeholder={intl.formatMessage({ id: 'portal.network.locationForm.cloudProviderLocationId.placeholder' })}
              label={<FormattedMessage id="portal.network.locationForm.cloudProviderLocationId.label"/>}
            />
          </Col>
        </Row>

        <FormFooterButtons>
          { edit &&
          <Button
            className="btn-danger pull-left"
            disabled={submitting}
            onClick={handleSubmit(() => onDelete(initialValues.name))}
          >
            <FormattedMessage id="portal.button.delete"/>
          </Button>
          }
          <Button
            className="btn-secondary"
            onClick={onCancel}
          >
            <FormattedMessage id="portal.button.cancel"/>
          </Button>
          <Button
            type="submit"
            bsStyle="primary"
            disabled={invalid || submitting}
          >
            {actionButtonTitle}
          </Button>
        </FormFooterButtons>
      </form>
    )
  }
}

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
  ...reduxFormPropTypes
};

const form = reduxForm({
  form: 'networkLocationForm',
  validate
})(NetworkLocationForm)

const mapStateToProps = (state) => {
  const selector = formValueSelector('networkLocationForm')
  return {
    latLng: selector(state, 'latitude', 'longitude')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    touchField: (field) => dispatch(touch('networkLocationForm', field)),
    changeField: (field, val) => dispatch(change('networkLocationForm', field, val))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(form))
