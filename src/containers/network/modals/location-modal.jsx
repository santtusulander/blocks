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

  onSubmit(edit, values) {
    const { brand, account, group } = this.props.params

    const data = {
      brand_id: brand,
      account_id: Number(account),
      group_id: Number(group),
      cloud_name: values.cloudName,
      cloud_provider: values.cloudProvider || '',
      cloud_region: values.cloudRegion || '',
      cloud_location_id: values.cloudProviderLocationId,
      country_code: values.countryCode || '',
      state: values.state || '',
      city_name: values.cityName || '',
      iata_code: values.iataCode,
      street: values.street || '',
      postalcode: values.postalCode || '',
      lat: parseFloat(values.latitude),
      lon: parseFloat(values.longitude)
    }

    const params = {
      brand: brand,
      group: group,
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
    const { brand, account, group } = this.props.params

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
      addressFetching,
      onCancel,
      invalid,
      initialValues,
      show
    } = this.props;

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
            initialValues={initialValues}
            cloudProvidersOptions={cloudProvidersOptions}
            cloudProvidersIdOptions={cloudProvidersIdOptions}
            addressFetching={addressFetching}
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
  addressFetching: PropTypes.bool,
  cloudProvidersIdOptions: PropTypes.arrayOf(PropTypes.object),
  cloudProvidersOptions: PropTypes.arrayOf(PropTypes.object),
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  locationId: PropTypes.string,
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

const reduxStoreMock = {
  get(field) { return this[field] },

  "postalcode": "Unknown",
  "street": "Unknown",
  "cloud_location_id": "bkk",
  "country_code": "th",
  "city_name": "Bangkok",
  "id": "first",
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

const mapStateToProps = (state, ownProps) => {
  let initialValues = {}
  if (ownProps.locationId !== null) {
    initialValues = getLocationById(state, ownProps.locationId).toJS()
  }
  console.log(initialValues)
  return {
    cloudProvidersOptions: cloudProvidersOptions.get(),
    cloudProvidersIdOptions: cloudProvidersIdOptions.get(),
    initialValues
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCreate: (params, data) => dispatch( locationActions.create( {...params, data } ) ),
    onDelete: (params) => dispatch( locationActions.remove( {...params } ) ),
    onUpdate: (params, data) => dispatch( locationActions.update( {...params, data } ) )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl((NetworkLocationFormContainer)))
