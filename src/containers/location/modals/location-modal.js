import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import SidePanel from '../../../components/side-panel'
import LocationForm from '../../../components/location/forms/location-form'

class LocationFormContainer extends Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(values) {
    const { brandId, accountId, groupId, onSave } = this.props;

    console.info('values to submit ', values);
    this.props.onSave(values, ...{brandId, accountId, groupId});
  }

  render() {
    const {
      intl,
      locationId,
      locationName,
      iataCode,
      latitude,
      longitude,
      addressFetching,
      cloudProvider,
      cloudProviderId,
      cloudProviderRegion,
      cloudProviderLocationId,
      onCancel = () => {},
      invalid,
      internalValues
    } = this.props;

    const title = locationId
      ? <FormattedMessage id="portal.location.locationForm.editLocation.title"/>
      : <FormattedMessage id="portal.location.locationForm.newLocation.title"/>;


    return (
      <div>
        <SidePanel
          show={true}
          title={title}
          cancel={onCancel}
        >
          <LocationForm
            locationId={locationId}
            internalValues={internalValues}
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
  intl: intlShape.isRequired,
  locationName: PropTypes.string,
  iataCode: PropTypes.string,
  latitude: PropTypes.string,
  longitude: PropTypes.string,
  addressFetching: PropTypes.bool,
  cloudProvider: PropTypes.array,
  cloudProviderId: PropTypes.string,
  cloudProviderRegion: PropTypes.string,
  cloudProviderLocationId: PropTypes.string,
  onCancel: PropTypes.func,
  invalid: PropTypes.bool,
  internalValues: PropTypes.object
};

const reduxStoreMock = {
  get(field) { return this[field] },
  internal: {
    brand_id: 'udn',
    account_id: 1,
    group_id: 1,
  },
  id: 'mil01',
  cloud_name: [
    {
      value: 'bm',
      label: 'IBM SoftLayer'
    }
  ],
  cloud_provider: [
    {
      value: 'sl',
      label: 'SL'
    },{
      value: 'do',
      label: 'DO'
    },{
      value: 'ec2',
      label: 'EC2'
    }
  ],
  cloud_region: '',
  cloud_location_id: '',
  country_code: 'it',
  state: 'Lombardia',
  city_name: 'Milan',
  iata_code: '',
  street: 'some street address',
  postalcode: '',
  lat: '',
  lon: ''
};

const mapStateToProps = (state) => ({
  locationId: reduxStoreMock.get('id'),
  cloudName: reduxStoreMock.get('cloud_name'),
  cloudProvider: reduxStoreMock.get('cloud_provider'),
  cloudRegion: reduxStoreMock.get('cloud_region'),
  cloudLocationId: reduxStoreMock.get('cloud_location_id'),
  countryCode: reduxStoreMock.get('country_code'),
  state: reduxStoreMock.get('state'),
  cityName: reduxStoreMock.get('city_name'),
  iataCode: reduxStoreMock.get('iata_code'),
  street: reduxStoreMock.get('street'),
  postalCode: reduxStoreMock.get('postalcode'),
  lat: reduxStoreMock.get('lat'),
  lon: reduxStoreMock.get('lon')
});

export default connect(mapStateToProps)(injectIntl((LocationFormContainer)))
