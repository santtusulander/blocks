import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import SidePanel from '../../../components/side-panel'
import LocationForm from '../../../components/network/forms/location-form'

class LocationFormContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {};

    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount() {
    // editMode for testing
    this.setState({ editMode: true });
  }

  onSubmit(values) {
    const { brandId, accountId, groupId } = this.props.initialValues;

    return {values, ...{ brandId, accountId, groupId }};
  }

  render() {
    const {
      intl,
      cloudProvidersOptions,
      cloudProvidersIdOptions,
      fetching,
      addressFetching,
      onCancel,
      invalid,
      initialValues
    } = this.props;

    const title = this.state.editMode
      ? <FormattedMessage id="portal.network.locationForm.editLocation.title"/>
      : <FormattedMessage id="portal.network.locationForm.newLocation.title"/>;

    return (
      <div>
        <SidePanel
          show={true}
          title={title}
          cancel={() => onCancel()}
        >
          <LocationForm
            editMode={this.state.editMode}
            initialValues={this.state.editMode ? initialValues: ({})}
            cloudProvidersOptions={cloudProvidersOptions}
            cloudProvidersIdOptions={cloudProvidersIdOptions}
            fetching={fetching}
            addressFetching={addressFetching}
            intl={intl}
            invalid={invalid}
            onCancel={onCancel}
            onSubmit={this.onSubmit}
          />
        </SidePanel>
      </div>
    );
  }
}

LocationFormContainer.displayName = 'LocationFormContainer';
LocationFormContainer.propTypes = {
  addressFetching: PropTypes.bool,
  cloudProvidersIdOptions: PropTypes.arrayOf(PropTypes.object),
  cloudProvidersOptions: PropTypes.arrayOf(PropTypes.object),
  fetching: PropTypes.bool,
  invalid: PropTypes.bool,
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func
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

  "account_id": 40032,
  "postalcode": "Unknown",
  "brand_id": "udn",
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
  "group_id": 40038,
  "cloud_region": "AP"
};

const mapStateToProps = () => ({
  cloudProvidersOptions: cloudProvidersOptions.get(),
  cloudProvidersIdOptions: cloudProvidersIdOptions.get(),

  initialValues: {
    groupId: reduxStoreMock.get('group_id'),
    accountId: reduxStoreMock.get('account_id'),
    brandId: reduxStoreMock.get('brand_id'),
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

export default connect(mapStateToProps)(injectIntl((LocationFormContainer)))
