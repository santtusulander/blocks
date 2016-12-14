import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import classNames from 'classnames'
import LoadingSpinner from '../loading-spinner/loading-spinner'

import Mapbox from '../map/mapbox';

import * as countriesGeoJSON from '../../assets/topo/custom.geo.json';

class AnalysisByLocation extends React.Component {
  render() {
    if(!this.props.countryData.size) {
      return <LoadingSpinner />
    }

    return (
      <div className={classNames(
        'analysis-by-location',
        { 'no-bg': this.props.noBg })}>
        <Mapbox
          getCitiesWithinBounds={this.props.getCityData ? this.props.getCityData : () => {}}
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
  cityData: React.PropTypes.instanceOf(Immutable.List),
  countryData: React.PropTypes.instanceOf(Immutable.List),
  getCityData: React.PropTypes.func,
  noBg: React.PropTypes.bool,
  theme: React.PropTypes.string
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

module.exports = connect(mapStateToProps)(AnalysisByLocation);
