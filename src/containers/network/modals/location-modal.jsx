import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { SubmissionError, formValueSelector } from 'redux-form'

import locationActions from '../../../redux/modules/entities/locations/actions'
import { getById as getLocationById } from '../../../redux/modules/entities/locations/selectors'

import { isValidLatitude, isValidLongitude } from '../../../util/validators'
import { locationReverseGeoCodingLookup } from '../../../util/network-helpers'
import { parseResponseError } from '../../../redux/util'

import iataCodeActions from '../../../redux/modules/entities/iata-codes/actions'
import { getIataCodes } from '../../../redux/modules/entities/iata-codes/selectors'
import { getAll as getRoles } from '../../../redux/modules/entities/roles/selectors'
import { getCurrentUser } from '../../../redux/modules/user'

import SidePanel from '../../../components/shared/side-panel'
import ModalWindow from '../../../components/shared/modal'
import LocationForm from '../../../components/network/forms/location-form'

import { LOCATION_CLOUD_PROVIDER_OPTIONS, LOCATION_CLOUD_PROVIDER_ID_OPTIONS } from '../../../constants/network'

import checkPermissions from '../../../util/permissions'
import * as PERMISSIONS from '../../../constants/permissions'

const LOCATION_ADDRESS_HELP_TEXT_ID = 'portal.network.locationForm.latLongFields.helperTextHint.address'

/**
 * Set address data values from location data
 * @param addressData Address data object
 * @param value       Location data, either main object or one of its contexts
 */
function setAddressDataValue(addressData, value) {
  const valueType = value.id.split('.')[0]

  if (valueType === 'address') {
    addressData.street = value.text
  } else if (valueType === 'postcode') {
    addressData.postalCode = value.text
  } else if (valueType === 'place') {
    addressData.city = value.text
  } else if (valueType === 'region') {
    addressData.state = value.text
  } else if (valueType === 'country') {
    addressData.countryCode = value.short_code
  }
}

class NetworkLocationFormContainer extends Component {
  constructor(props) {
    super(props)

    const { intl } = this.props

    this.state = {
      isFetchingLocation: false,
      addressLine: intl.formatMessage({ id: LOCATION_ADDRESS_HELP_TEXT_ID }),
      addressData: {},
      latLng: {
        latitude: null,
        longitude: null
      },
      showDeleteModal: false
    }

    this.fetchLocation = this.fetchLocation.bind(this)
    this.askForFetchLocation = this.askForFetchLocation.bind(this)
    this.shouldFetchLocation = this.shouldFetchLocation.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onToggleDeleteModal = this.onToggleDeleteModal.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  componentWillMount() {
    this.props.fetchIataCodes()

    const { initialValues } = this.props

    if (initialValues.latitude && initialValues.longitude) {
      this.setState({
        latLng: {
          latitude: initialValues.latitude,
          longitude: initialValues.longitude
        }
      }, () => this.fetchLocation())
    }
  }

  askForFetchLocation() {
    if (this.shouldFetchLocation()) {
      this.setState({
        isFetchingLocation: true,
        latLng: this.props.latLng
      }, () => this.fetchLocation())
    }
  }

  shouldFetchLocation() {
    const latLngProps = this.props.latLng
    const latLngState = this.state.latLng
    return !!latLngProps.latitude && !!latLngProps.longitude &&
      isValidLatitude(latLngProps.latitude) &&
      isValidLongitude(latLngProps.longitude) &&
      (
        parseFloat(latLngProps.latitude) !== parseFloat(latLngState.latitude) ||
        parseFloat(latLngProps.longitude) !== parseFloat(latLngState.longitude)
      )
  }

  fetchLocation() {
    const { latLng } = this.props
    locationReverseGeoCodingLookup(latLng.longitude, latLng.latitude)
      .then(({ features }) => {
        const addressData = {}

        setAddressDataValue(addressData, features[0])

        features[0].context.forEach(context => setAddressDataValue(addressData, context))

        this.setState({
          addressLine: features[0].place_name,
          isFetchingLocation: false,
          addressData
        })
      })
      .catch(() => {
        this.setState({
          addressLine: <FormattedMessage id="portal.network.locationForm.latLongFields.addressNotFound"/>,
          isFetchingLocation: false,
          addressData: {}
        })
      })
  }

  onSubmit(edit, values) {
    const { brand, account } = this.props.params
    const { groupId } = this.props
    const { addressData } = this.state
    const data = {
      brand_id: brand,
      account_id: Number(account),
      group_id: Number(groupId),
      cloud_name: values.cloudName,
      cloud_region: values.cloudProviderRegion || '',
      cloud_location_id: values.cloudProviderLocationId,
      iata_code: values.iataCode[0].iata,
      city_name: addressData.city || '',
      country_code: addressData.countryCode || '',
      state: addressData.state || '',
      street: addressData.street || '',
      postalcode: addressData.postalCode || '',
      lat: parseFloat(values.latitude),
      lon: parseFloat(values.longitude)
    }
    if (values.cloudProvider) {
      data.cloud_provider = values.cloudProvider
    }

    const params = {
      brand: brand,
      group: String(groupId),
      account: account,
      payload: data
    }

    if (edit) {
      params.id = values.name
    } else {
      data.id = values.name
    }

    const save = edit ? this.props.onUpdate : this.props.onCreate

    return save(params)
      .then(() => {

        this.onCancel()

      }).catch(resp => {

        throw new SubmissionError({'_error': parseResponseError(resp)})

      })
  }

  onToggleDeleteModal(showDeleteModal) {
    this.setState({ showDeleteModal })
  }

  onDelete() {
    const { brand, account } = this.props.params
    const {groupId: group, initialValues: { name: locationId } } = this.props

    const params = {
      brand: brand,
      group: group,
      account: account,
      id: locationId
    }
    return this.props.onDelete(params)
      .then(() => {

        this.onCancel()

      }).catch(resp => {

        throw new SubmissionError({_error: parseResponseError(resp)})

      })
  }

  onCancel() {
    const { intl, onCancel } = this.props

    // Reset to initial state
    this.setState({
      isFetchingLocation: false,
      addressLine: intl.formatMessage({ id: LOCATION_ADDRESS_HELP_TEXT_ID }),
      addressData: {},
      latLng: {
        latitude: null,
        longitude: null
      }
    })

    onCancel && onCancel()
  }

  render() {
    const {
      intl,
      cloudProvidersOptions,
      cloudProvidersIdOptions,
      selectedCloudProvider,
      onCancel,
      iataCodes,
      invalid,
      initialValues,
      show,
      allowModify
    } = this.props;

    const { isFetchingLocation, addressLine, showDeleteModal } = this.state
    const edit = !!initialValues.name

    const title = edit
      ? <FormattedMessage id="portal.network.locationForm.editLocation.title"/>
      : <FormattedMessage id="portal.network.locationForm.newLocation.title"/>;

    return (
      <div>
        <SidePanel
          show={show}
          title={title}
          cancel={() => onCancel()}
          overlapping={true}
        >
          <LocationForm
            askForFetchLocation={this.askForFetchLocation}
            addressLine={addressLine}
            edit={edit}
            iataCodes={iataCodes}
            initialValues={initialValues}
            cloudProvidersOptions={cloudProvidersOptions}
            cloudProvidersIdOptions={cloudProvidersIdOptions}
            isFetchingLocation={isFetchingLocation}
            intl={intl}
            invalid={invalid}
            onCancel={this.onCancel}
            onDelete={() => this.onToggleDeleteModal(true)}
            onSubmit={(values) => this.onSubmit(edit, values)}
            readOnly={!allowModify}
            selectedCloudProvider={selectedCloudProvider}
          />
        </SidePanel>
        {edit && showDeleteModal &&
            <ModalWindow
              className='modal-window-raised'
              title={<FormattedMessage id="portal.network.locationForm.deleteLocation.title"/>}
              verifyDelete={true}
              cancelButton={true}
              deleteButton={true}
              cancel={() => this.onToggleDeleteModal(false)}
              onSubmit={() => this.onDelete()}>
              <p>
               <FormattedMessage id="portal.network.locationForm.deleteLocation.confirmation.text"/>
              </p>
            </ModalWindow>}
      </div>
    );
  }
}

NetworkLocationFormContainer.displayName = 'NetworkLocationEditForm';
NetworkLocationFormContainer.propTypes = {
  allowModify: PropTypes.bool,
  cloudProvidersIdOptions: PropTypes.arrayOf(PropTypes.object),
  cloudProvidersOptions: PropTypes.arrayOf(PropTypes.object),
  fetchIataCodes: PropTypes.func,
  groupId: PropTypes.number,
  iataCodes: PropTypes.array,
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  latLng: PropTypes.object,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  params: PropTypes.object,
  selectedCloudProvider: PropTypes.string,
  show: PropTypes.bool
};

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const roles = getRoles(state)
  const currentUser = getCurrentUser(state)

  const selector = formValueSelector('networkLocationForm')
  let values = {}

  if (ownProps.locationId !== null) {

    //locationId is already a composed reduxId
    const locationInfo = getLocationById(state, ownProps.locationId)

    values = locationInfo ? locationInfo.toJS() : []
  }

  return {
    allowModify: checkPermissions(roles, currentUser, PERMISSIONS.MODIFY_NODE),
    latLng: selector(state, 'latitude', 'longitude'),
    cloudProvidersOptions: LOCATION_CLOUD_PROVIDER_OPTIONS,
    cloudProvidersIdOptions: LOCATION_CLOUD_PROVIDER_ID_OPTIONS,
    iataCodes: getIataCodes(state),
    selectedCloudProvider: selector(state, 'cloudName'),
    initialValues: {
      ...values,
      iataCode: [
        {
          iata: values.iataCode ? values.iataCode.toUpperCase() : '',
          city: values.cityName || '',
          country: ''
        }
      ]
    }
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  fetchIataCodes: () => dispatch(iataCodeActions.fetchOne({})),
  onCreate: (params) => dispatch(locationActions.create({...params })),
  onDelete: (params) => dispatch(locationActions.remove({...params })),
  onUpdate: (params) => dispatch(locationActions.update({...params }))
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl((NetworkLocationFormContainer)))
