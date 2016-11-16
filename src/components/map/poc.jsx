import React from 'react';
import axios from 'axios'
import {topoBase} from '../../redux/util'
import { Map, Popup, GeoJson, TileLayer, Circle } from 'react-leaflet'

import {MAPBOX_LIGHT_THEME, MAPBOX_DARK_THEME} from '../../constants/mapbox'

import './poc.scss'

const heatMapColors = [
  '#e32119', //red dark
  '#e32119', //red light
  '#00a9d4', //cyan
  '#009f80', //green
  '#89ba17'  //lime
]

const cities = [
  { id: 'LDN', countryId: 'GBR', name: 'London', bytes: 500000, requests: 10000, position: [51.505, -0.09] },
  { id: 'MCR', countryId: 'GBR', name: 'Manchester', bytes: 300000, requests: 10000, position: [53.4807593, -2.2426305000000184] },
  { id: 'NYC', countryId: 'USA', name: 'New York', bytes: 400000, requests: 20000, position: [40.785091, -73.968285] },
  { id: 'BTN', countryId: 'USA', name: 'Boston', bytes: 300000, requests: 20000, position: [42.3600825, -71.05888010000001] },
  { id: 'WCR', countryId: 'USA', name: 'Worchester', bytes: 200000, requests: 20000, position: [42.261573789394745, -71.79908395742189] },
  { id: 'HEL', countryId: 'FIN', name: 'Helsinki', bytes: 300000, requests: 30000, position: [60.17083, 24.93750] },
  { id: 'TKU', countryId: 'FIN', name: 'Turku', bytes: 200000, requests: 40000, position: [60.454510, 22.264824] },
  { id: 'BJN', countryId: 'CHN', name: 'Beijing', bytes: 100000, requests: 50000, position: [39.9042, 116.4074] }
]

const countries = [
  {id: 'GBR', total_traffic: 100000},
  {id: 'USA', total_traffic: 1000000},
  {id: 'FIN', total_traffic: 700000},
  {id: 'CHN', total_traffic: 300000}
]

const getCountryStyle = ( median, feature ) => {

  const trafficCountry = countries.find( c => c.id === feature.id )
  const trafficHeat = trafficCountry && getScore(median, trafficCountry.total_traffic)
  const countryColor = trafficCountry ? heatMapColors[ trafficHeat - 1] : '#00a9d4'

  const fillOpacity =  trafficCountry ? 0.5 : 0

  return {
    color: countryColor,
    fillOpacity: fillOpacity,
    opacity: 0,
    weight: 2
  }
}

/**
 * Calculate Median -value
 * @param values
 * @returns {value}
 */
const calculateMedian = (values) => {

  values.sort( function(a,b) {return a - b;} );

  var half = Math.floor(values.length/2);

  if(values.length % 2)
    return values[half];
  else
    return (values[half-1] + values[half]) / 2.0;
}
/**
 * Get Score for value compared to 'median' range (0 - steps)
 * @param median
 * @param value
 * @param steps
 * @returns {number}
 */
const getScore = (median, value, steps = 5) => {

  const diff = (value / median)
  const score = Math.ceil(diff * (steps / 2)) ;

  return score;
}

const handleFeature = ( feature, layer) => {
  layer.bindPopup(feature.properties.name);
  layer.on({
    mouseover: () => {
      layer.setStyle({
        weight:2.5,
        opacity: 0.5
      });
    },
    mouseout: () => {
      layer.setStyle({
        weight:0
      });
    }
  })
}

class MapPoc extends React.Component {
  constructor(props) {
    super(props)
    this.state = {zoom: 2, countryGeoJson: null}

  }
  componentDidMount() {
    //this fixes a bug of map not being drawn correctly on reload
    window.dispatchEvent(new Event('resize'));
  }

  zoomEnd(e){
    this.setState({zoom: e.target._zoom})
  }
  render() {
    const cityMedian = calculateMedian( cities.map( (city => city.bytes) ) )
    const countryMedian = calculateMedian( countries.map( (country => country.total_traffic) ) )

    const cityCircles = cities.map( city => {
      const cityHeat = getScore(cityMedian, city.bytes)
      const cityColor = cityHeat ? heatMapColors[ cityHeat - 1 ] : '#000000'

      return (
        <Circle key={city.id} center={city.position} radius={cityHeat * 10000} color={cityColor} >
          <Popup>
            <span>{city.name}</span>
          </Popup>
        </Circle>
      )
    })

    const mapboxUrl = (this.props.theme === 'light') ? MAPBOX_LIGHT_THEME : MAPBOX_DARK_THEME

    return (
      <Map
        center={cities[0].position}
        zoom={this.state.zoom}
        onZoomEnd={(e)=>this.zoomEnd(e)}
      >
        <TileLayer
          url={mapboxUrl}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          accessToken='pk.eyJ1IjoiZXJpY3Nzb251ZG4iLCJhIjoiY2lyNWJsZGVmMDAxYmcxbm5oNjRxY2VnZCJ9.r1KILF4ik_gkwZ4BCyy1CA'
        />

        {cityCircles}

        {this.state.zoom < 6 && this.props.geoData.features &&
        <GeoJson
          data={this.props.geoData}
          style={(feature) => getCountryStyle(countryMedian, feature)}
          onEachFeature={handleFeature}
        />}

      </Map>
    )
  }
}

MapPoc.propTypes = {
  geoData: React.PropTypes.object,
  theme: React.PropTypes.string
}

export default MapPoc;
