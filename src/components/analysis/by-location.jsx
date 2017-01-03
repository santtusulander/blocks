import React from 'react'
import Immutable from 'immutable'

import LoadingSpinner from '../loading-spinner/loading-spinner'
import Mapbox from '../map/mapbox';

import * as countriesGeoJSON from '../../assets/topo/custom.geo.json';

const AnalysisByLocation = (props) => {
  const {
    countryData,
    cityData,
    theme,
    getCityData,
    height,
    mapBounds,
    mapboxActions
  } = props

  if (!countryData.size) {
    return <LoadingSpinner />
  }

  return (
    <div className="analysis-by-location">
      <Mapbox
        getCitiesWithinBounds={getCityData}
        geoData={countriesGeoJSON}
        countryData={countryData.toJS()}
        cityData={cityData.toJS()}
        theme={theme}
        height={height}
        mapBounds={mapBounds}
        mapboxActions={mapboxActions} />
    </div>
  )

}

AnalysisByLocation.displayName = 'AnalysisByLocation'

AnalysisByLocation.defaultProps = {
  cityData: Immutable.List(),
  countryData: Immutable.List()
}

AnalysisByLocation.propTypes = {
  cityData: React.PropTypes.instanceOf(Immutable.List),
  countryData: React.PropTypes.instanceOf(Immutable.List),
  getCityData: React.PropTypes.func,
  height: React.PropTypes.number,
  mapBounds: React.PropTypes.object,
  mapboxActions: React.PropTypes.object,
  theme: React.PropTypes.string
}

export default AnalysisByLocation
