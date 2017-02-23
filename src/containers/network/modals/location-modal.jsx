import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { SubmissionError, formValueSelector } from 'redux-form'

import locationActions from '../../../redux/modules/entities/locations/actions'
import { getById as getLocationById } from '../../../redux/modules/entities/locations/selectors'

import { isValidLatitude, isValidLongtitude } from '../../../util/validators'
import { locationReverseGeoCodingLookup } from '../../../util/network-helpers'

import iataCodeActions from '../../../redux/modules/entities/iata-codes/actions'
import { getIataCodes } from '../../../redux/modules/entities/iata-codes/selectors'

import SidePanel from '../../../components/side-panel'
import LocationForm from '../../../components/network/forms/location-form'

class NetworkLocationFormContainer extends Component {
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

    this.fetchLocation = this.fetchLocation.bind(this)
    this.askForFetchLocation = this.askForFetchLocation.bind(this)
    this.shouldFetchLocation = this.shouldFetchLocation.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  componentWillMount() {
    this.props.fetchIataCodes()
  }

  componentWillReceiveProps(nextProps) {
    const { initialValues } = nextProps
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
      isValidLongtitude(latLngProps.longitude) &&
      (
        parseFloat(latLngProps.latitude) !== parseFloat(latLngState.latitude) ||
        parseFloat(latLngProps.longitude) !== parseFloat(latLngState.longitude)
      )
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

  onSubmit(edit, values) {
    const { brand, account } = this.props.params
    const group = this.props.groupId
    const data = {
      brand_id: brand,
      account_id: Number(account),
      group_id: Number(group),
      cloud_name: values.cloudName,
      cloud_provider: values.cloudProvider || undefined,
      cloud_region: values.cloudProviderRegion || '',
      cloud_location_id: values.cloudProviderLocationId,
      country_code: values.countryCode || '',
      state: values.state || '',
      city_name: values.iataCode[0].city || '',
      iata_code: values.iataCode[0].iata,
      street: values.street || '',
      postalcode: values.postalCode || '',
      lat: parseFloat(values.latitude),
      lon: parseFloat(values.longitude)
    }

    const params = {
      brand: brand,
      group: String(group),
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
      .then( (resp) => {
        if (resp.error) {
          throw new SubmissionError({'_error': resp.error.data.message})
        }

        this.props.onCancel()
      })
  }

  onDelete(locationId) {
    const { brand, account } = this.props.params
    const group = this.props.groupId

    const params = {
      brand: brand,
      group: group,
      account: account,
      id: locationId
    }
    return this.props.onDelete(params)
      .then( (resp) => {
        if (resp.error) {
          throw new SubmissionError({_error: resp.error.data.message})
        }

        this.props.onCancel()
      })
  }

  render() {
    const {
      intl,
      cloudProvidersOptions,
      cloudProvidersIdOptions,
      onCancel,
      iataCodes,
      invalid,
      initialValues,
      show
    } = this.props;

    const { isFetchingLocation } = this.state
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
            addressLine={this.state.addressLine}
            edit={edit}
            iataCodes={iataCodes}
            initialValues={initialValues}
            cloudProvidersOptions={cloudProvidersOptions}
            cloudProvidersIdOptions={cloudProvidersIdOptions}
            isFetchingLocation={isFetchingLocation}
            intl={intl}
            invalid={invalid}
            onCancel={onCancel}
            onDelete={this.onDelete}
            onSubmit={(values) => this.onSubmit(edit, values)}
          />
        </SidePanel>
      </div>
    );
  }
}

NetworkLocationFormContainer.displayName = 'NetworkLocationEditForm';
NetworkLocationFormContainer.propTypes = {
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
  show: PropTypes.bool
};

const cloudProvidersOptions = {
  get() {
    return [
      {
        value: 'Bare Metal',
        label: 'Bare Metal'
      }
    ]
  }
};
const cloudProvidersIdOptions = {
  get() {
    return [
      {
        value: 'sl',
        label: 'IBM SoftLayer'
      },{
        value: 'do',
        label: 'Digital Ocean'
      },{
        value: 'ec2',
        label: 'Amazon EC2'
      }
    ]
  }
};

const mapStateToProps = (state, ownProps) => {

  const selector = formValueSelector('networkLocationForm')
  let values = {}

  if (ownProps.locationId !== null) {

    //locationId is already a composed reduxId
    const locationInfo = getLocationById(state, ownProps.locationId)

    values = locationInfo ? locationInfo.toJS() : []
  }

  return {
    latLng: selector(state, 'latitude', 'longitude'),
    cloudProvidersOptions: cloudProvidersOptions.get(),
    cloudProvidersIdOptions: cloudProvidersIdOptions.get(),
    iataCodes: getIataCodes(state),
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

const mapDispatchToProps = dispatch => ({
  fetchIataCodes: () => dispatch(iataCodeActions.fetchOne({})),
  onCreate: (params) => dispatch( locationActions.create( {...params } ) ),
  onDelete: (params) => dispatch( locationActions.remove( {...params } ) ),
  onUpdate: (params) => dispatch( locationActions.update( {...params } ) )
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl((NetworkLocationFormContainer)))
