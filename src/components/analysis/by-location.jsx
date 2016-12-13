import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import {FormattedMessage} from 'react-intl'

import * as trafficActionCreators from '../../redux/modules/traffic'

import Mapbox from '../map/mapbox';

import * as countriesGeoJSON from '../../assets/topo/custom.geo.json';

class AnalysisByLocation extends React.Component {
  constructor(props) {
    super(props)

    this.getCitiesWithinBounds = this.getCitiesWithinBounds.bind(this)
  }

  getCitiesWithinBounds(south, west, north, east) {
    if (this.props.trafficActions) {
      const byCityOpts = Object.assign({
        max_cities: 999,
        latitude_south: south,
        longitude_west: west,
        latitude_north: north,
        longitude_east: east
      }, this.props.baseOpts)

      this.props.trafficActions.startFetching()
      this.props.trafficActions.fetchByCity(byCityOpts).then(
        this.props.trafficActions.finishFetching()
      )
    }
  }

  render() {
    if(!this.props.countryData.size) {
      return <div><FormattedMessage id="portal.loading.text"/></div>
    }

    return (
      <div className={classNames(
        'analysis-by-location',
        { 'no-bg': this.props.noBg })}>
        <Mapbox
          getCitiesWithinBounds={this.getCitiesWithinBounds}
          geoData={countriesGeoJSON}
          countryData={this.props.countryData.toJS()}
          cityData={this.props.cityData.toJS()}
          theme={this.props.theme} />
      </div>
    )
  }
}

AnalysisByLocation.displayName = 'AnalysisByLocation'
AnalysisByLocation.propTypes = {
  baseOpts: React.PropTypes.object,
  cityData: React.PropTypes.instanceOf(Immutable.List),
  countryData: React.PropTypes.instanceOf(Immutable.List),
  noBg: React.PropTypes.bool,
  theme: React.PropTypes.string,
  trafficActions: React.PropTypes.object
}

AnalysisByLocation.defaultProps = {
  cityData: Immutable.List(),
  countryData: Immutable.List()
}

function mapStateToProps(state) {
  return {
    theme: state.ui.get('theme')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    trafficActions: bindActionCreators(trafficActionCreators, dispatch)
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(AnalysisByLocation);
