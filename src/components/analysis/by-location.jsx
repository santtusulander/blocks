import React from 'react'
import Immutable from 'immutable'
import { FormattedMessage } from 'react-intl'

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
    mapboxActions,
    dataKey,
    dataKeyFormat,
    fullScreen,
    coreLocations,
    spEdgesLocations
  } = props

  if (!countryData.size) {
    return <h4><FormattedMessage id="portal.common.no-data.text" /></h4>
  }

  return (
    <div className="analysis-by-location">
      <Mapbox
        fullScreen={fullScreen}
        getCitiesWithinBounds={getCityData}
        geoData={countriesGeoJSON}
        countryData={countryData}
        cityData={cityData}
        theme={theme}
        height={height}
        mapBounds={mapBounds}
        mapboxActions={mapboxActions}
        dataKey={dataKey}
        dataKeyFormat={dataKeyFormat}
        coreLocations={coreLocations}
        spEdgesLocations={spEdgesLocations}
      />
    </div>
  )

}

AnalysisByLocation.displayName = 'AnalysisByLocation'

AnalysisByLocation.defaultProps = {
  cityData: Immutable.List(),
  countryData: Immutable.List(),
  fullScreen: false
}

AnalysisByLocation.propTypes = {
  cityData: React.PropTypes.instanceOf(Immutable.List),
  coreLocations: React.PropTypes.object,
  countryData: React.PropTypes.instanceOf(Immutable.List),
  dataKey: React.PropTypes.string,
  dataKeyFormat: React.PropTypes.func,
  fullScreen: React.PropTypes.bool,
  getCityData: React.PropTypes.func,
  height: React.PropTypes.number,
  mapBounds: React.PropTypes.object,
  mapboxActions: React.PropTypes.object,
  spEdgesLocations: React.PropTypes.object,
  theme: React.PropTypes.string
}

export default AnalysisByLocation
