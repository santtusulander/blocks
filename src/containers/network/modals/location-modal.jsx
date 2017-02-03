import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { SubmissionError } from 'redux-form'

import locationActions from '../../../redux/modules/entities/locations/actions'
import { getById as getLocationById } from '../../../redux/modules/entities/locations/selectors'

import SidePanel from '../../../components/side-panel'
import LocationForm from '../../../components/network/forms/location-form'

class NetworkLocationFormContainer extends Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  //TODO: Implement onSubmit
  onSubmit(values) {
    const { brand, account, group } = this.props.params

    const data = {
      id: values.name,
      brand_id: brand,
      account_id: Number(account),
      group_id: Number(group),
      cloud_name: values.cloudName,
      cloud_provider: values.cloudProvider,
      cloud_region: values.cloudRegion,
      cloud_location_id: values.cloudProviderLocationId,
      country_code: values.countryCode,
      state: values.state,
      city_name: values.cityName,
      iata_code: values.iataCode,
      street: values.street,
      postalcode: values.postalCode,
      lat: parseFloat(values.latitude),
      lon: parseFloat(values.longitude)
    }

    const params = {
      brand: brand,
      group: group,
      account: account,
      payload: data
    }
    return this.props.onCreate(params)
      .then( (resp) => {
        if (resp.error) {
          throw new SubmissionError({'_error': resp.error.data.message})
        }

        this.props.onCancel()
      })
  }

  //TODO: Implement onDelete
  onDelete(id) {
    return id;
  }

  render() {
    const {
      edit,
      intl,
      cloudProvidersOptions,
      cloudProvidersIdOptions,
      addressFetching,
      onCancel,
      invalid,
      initialValues,
      show
    } = this.props;

    const title = edit
      ? <FormattedMessage id="portal.network.locationForm.editLocation.title"/>
      : <FormattedMessage id="portal.network.locationForm.newLocation.title"/>;

    return (
      <div>
        <SidePanel
          show={show}
          title={title}
          cancel={() => onCancel()}
        >
          <LocationForm
            initialValues={initialValues}
            cloudProvidersOptions={cloudProvidersOptions}
            cloudProvidersIdOptions={cloudProvidersIdOptions}
            addressFetching={addressFetching}
            intl={intl}
            invalid={invalid}
            onCancel={onCancel}
            onDelete={this.onDelete}
            onSubmit={this.onSubmit}
          />
        </SidePanel>
      </div>
    );
  }
}

NetworkLocationFormContainer.displayName = 'NetworkLocationEditForm';
NetworkLocationFormContainer.propTypes = {
  addressFetching: PropTypes.bool,
  cloudProvidersIdOptions: PropTypes.arrayOf(PropTypes.object),
  cloudProvidersOptions: PropTypes.arrayOf(PropTypes.object),
  edit: PropTypes.bool,
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
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

const reduxStoreMock = {
  get(field) { return this[field] },

  "postalcode": "Unknown",
  "street": "Unknown",
  "cloud_location_id": "bkk",
  "country_code": "th",
  "city_name": "Bangkok",
  "id": "bkk",
  "cloud_provider": "sl",
  "lat": 13.75,
  "cloud_name": "Bare Metal",
  "lon": 100.5167,
  "iata_code": "bkk",
  "state": "Unknown",
  "boundingbox": [
    13.75,
    13.7501,
    100.5167,
    100.5167
  ],
  "cloud_region": "AP"
};

const mapStateToProps = (state) => ({
  cloudProvidersOptions: cloudProvidersOptions.get(),
  cloudProvidersIdOptions: cloudProvidersIdOptions.get(),

  initialValues: {
    name: reduxStoreMock.get('id'),
    iataCode: reduxStoreMock.get('iata_code'),
    latitude: reduxStoreMock.get('lat'),
    longitude: reduxStoreMock.get('lon'),
    cloudName: reduxStoreMock.get('cloud_name'),
    cloudProvider: reduxStoreMock.get('cloud_provider'),
    cloudRegion: reduxStoreMock.get('cloud_region'),
    cloudProviderLocationId: reduxStoreMock.get('cloud_location_id'),
    countryCode: reduxStoreMock.get('country_code'),
    state: reduxStoreMock.get('state'),
    cityName: reduxStoreMock.get('city_name'),
    street: reduxStoreMock.get('street'),
    postalCode: reduxStoreMock.get('postalcode')
  }
});

const mapDispatchToProps = (dispatch) => {
  return {
    onCreate: (params, data) => dispatch( locationActions.create( {...params, data } ) )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl((NetworkLocationFormContainer)))
