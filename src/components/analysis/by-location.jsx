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
    getCityData
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
        theme={theme} />
    </div>
  )

}

AnalysisByLocation.propTypes = {
  cityData: React.PropTypes.instanceOf(Immutable.List),
  countryData: React.PropTypes.instanceOf(Immutable.List),
  getCityData: React.PropTypes.func,
  theme: React.PropTypes.string
}

export default AnalysisByLocation
