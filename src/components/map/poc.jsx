import React from 'react';
// import { Map, Popup, GeoJson, TileLayer, Circle } from 'react-leaflet'
import ReactMapboxGl, { Layer, Feature, Popup, GeoJSONLayer } from 'react-mapbox-gl';
import * as topojson from 'topojson-client'

import {MAPBOX_LIGHT_THEME, MAPBOX_DARK_THEME} from '../../constants/mapbox'

const heatMapColors = [
  '#e32119', //red dark
  '#e32119', //red light
  '#00a9d4', //cyan
  '#009f80', //green
  '#89ba17'  //lime
]

const cities = [
  { id: 'LDN', countryId: 'GBR', name: 'London', bytes: 500000, requests: 10000, position: [-0.1278, 51.5074] },
  { id: 'MCR', countryId: 'GBR', name: 'Manchester', bytes: 300000, requests: 10000, position: [-2.2426, 53.4808] },
  { id: 'NYC', countryId: 'USA', name: 'New York', bytes: 400000, requests: 20000, position: [-74.0059, 40.7128] },
  { id: 'BTN', countryId: 'USA', name: 'Boston', bytes: 300000, requests: 20000, position: [-71.0589, 42.3601] },
  { id: 'WCR', countryId: 'USA', name: 'Worchester', bytes: 200000, requests: 20000, position: [-71.8023, 42.2626] },
  { id: 'HEL', countryId: 'FIN', name: 'Helsinki', bytes: 300000, requests: 30000, position: [24.9384, 60.1699] },
  { id: 'TKU', countryId: 'FIN', name: 'Turku', bytes: 200000, requests: 40000, position: [22.2666, 60.4518] },
  { id: 'BJN', countryId: 'CHN', name: 'Beijing', bytes: 100000, requests: 50000, position: [116.4074, 39.9042] }
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
  layer.bindPopup(feature.id);
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

    const cityCircles = cities.map( (city, i) => {
      const cityHeat = getScore(cityMedian, city.bytes)
      const cityColor = cityHeat ? heatMapColors[ cityHeat - 1 ] : '#000000'

      return (
          <Layer
            key={i}
            type="circle"
            paint={{
              'circle-radius': cityHeat * 10,
              'circle-color': cityColor
            }}>
            <Feature
              coordinates={city.position}
              />
          </Layer>
        )})
    //     <Circle key={city.id} center={city.position} radius={cityHeat * 10000} color={cityColor} >
    //       <Popup>
    //         <span>{city.name}</span>
    //       </Popup>
    //     </Circle>
    //   )
    // })

    const mapboxUrl = (this.props.theme === 'light') ? MAPBOX_LIGHT_THEME : MAPBOX_DARK_THEME

    const geoJSON = this.props.geoData
                    && this.props.geoData.objects
                    && topojson.feature(this.props.geoData, this.props.geoData.objects.countries)

    return (
      <ReactMapboxGl
        accessToken="pk.eyJ1IjoiZXJpY3Nzb251ZG4iLCJhIjoiY2lyNWJsZGVmMDAxYmcxbm5oNjRxY2VnZCJ9.r1KILF4ik_gkwZ4BCyy1CA"
        style={mapboxUrl}
        containerStyle={{
          height: '600px'
        }}
        minZoom={1}
        center={cities[0].position}
        >
        {cityCircles}
      </ReactMapboxGl>
      /*
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

        {this.state.zoom < 6 && geoJSON &&
        <GeoJson
          data={geoJSON}
          style={(feature) => getCountryStyle(countryMedian, feature)}
          onEachFeature={handleFeature}
        />}

      </Map>
      */

    )
  }
}

MapPoc.propTypes = {
  geoData: React.PropTypes.object,
  theme: React.PropTypes.string
}

export default MapPoc;
