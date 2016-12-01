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
    this.state = {
      zoom: 2,
      countryGeoJson: null,
      popupCoords: [],
      popupContent: null
    }

    this.countryGeoJson = {
      type: 'FeatureCollection',
      features: []
    }

  }
  componentDidMount() {
    this.countryGeoJson.features = this.props.geoData.features.filter((data) => {
      const countryExists = countries.some(country => country.id === data.id)

      if (countryExists) {
        return data
      }
    })
  }

  zoomEnd(e){
    // debugger;
    this.setState({zoom: e.transform.scale})
  }

  cityPopup(city) {
    this.setState({ popupContent: city.name, popupCoords: city.position })
  }

  cityCircles() {
    const cityMedian = calculateMedian( cities.map( (city => city.bytes) ) )
    const countryMedian = calculateMedian( countries.map( (country => country.total_traffic) ) )

    return cities.map((city, i) => {
      const cityHeat = getScore(cityMedian, city.bytes)
      const cityColor = cityHeat ? heatMapColors[ cityHeat - 1 ] : '#000000'

      return (
        <Layer
          key={i}
          type="circle"
          paint={{
            'circle-radius': cityHeat * (this.state.zoom / 5),
            'circle-color': cityColor,
            'circle-opacity': 0.5
          }}>
          <Feature
            coordinates={city.position}
            onClick={this.cityPopup.bind(this, city)}
            />
        </Layer>
      )
    })
  }

  mouseMove(e, t) {
    let test = e.queryRenderedFeatures(t.point, { layers: ['country-fill'] })
    if (test.length) {
      e.setFilter('country-fill-hover', ['==', 'name', test[0].properties.name])
      document.body.style.cursor = 'pointer';
    } else {
      e.setFilter('country-fill-hover', ['==', 'name', ''])
      document.body.style.cursor = 'default';
    }

  }

  mapLoaded(e) {
    e.addSource('geo', {
      type: 'geojson',
      data: this.countryGeoJson
    })
  }

  render() {
    const mapboxUrl = (this.props.theme === 'light') ? MAPBOX_LIGHT_THEME : MAPBOX_DARK_THEME

    return (
      <ReactMapboxGl
        accessToken="pk.eyJ1IjoiZXJpY3Nzb251ZG4iLCJhIjoiY2lyNWJsZGVmMDAxYmcxbm5oNjRxY2VnZCJ9.r1KILF4ik_gkwZ4BCyy1CA"
        style={mapboxUrl}
        containerStyle={{
          height: '600px'
        }}
        minZoom={1}
        center={cities[0].position}
        onZoom={this.zoomEnd.bind(this)}
        onMouseMove={this.mouseMove.bind(this)}
        onStyleLoad={this.mapLoaded.bind(this)}>

        <Layer
          id="country-fill"
          type="fill"
          sourceId="geo"
          paint={{
            'fill-color': '#00abd6',
            'fill-opacity': 0.3
          }}/>

        <Layer
          id="country-fill-hover"
          type="line"
          sourceId="geo"
          paint={{
            'line-color': '#00abd6',
            'line-width': 3
          }}
          layerOptions={{
            filter: ['==', 'name', '']
          }}/>

          {this.cityCircles()}

        {!!this.state.popupContent &&
          <Popup closeButton={true} coordinates={this.state.popupCoords}>
            <span>{this.state.popupContent}</span>
          </Popup>
        }
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
