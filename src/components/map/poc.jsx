import React from 'react';
import ReactMapboxGl, { Layer, Feature, Popup } from 'react-mapbox-gl';

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

class MapPoc extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      zoom: 2,
      countryGeoJson: null,
      popupCoords: [],
      popupContent: null,
      layers: [],
      hoveredLayer: null
    }

    this.countryGeoJson = {
      type: 'FeatureCollection',
      features: []
    }

  }
  componentDidMount() {
    // TODO: Move this to be handled either a on parent level or in a reducer / API
    // GeoJSON should just passed in as a prop.
    this.countryGeoJson.features = this.props.geoData.features.filter((data) => {
      const countryExists = countries.some(country => country.id === data.id)

      if (countryExists) {
        return data
      }
    })
  }

  zoomEnd(e){
    this.setState({zoom: e.transform.scale})
  }

  cityPopup(city) {
    this.setState({ popupContent: city.name, popupCoords: city.position })
  }

  cityCircles() {
    const cityMedian = calculateMedian( cities.map( (city => city.bytes) ) )

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

  mouseMove(map, feature) {
    if (map.style._loaded) {
      const features = map.queryRenderedFeatures(feature.point, { layers: this.state.layers })

      if (features.length) {
        const hoveredLayer = features[0].layer.id + '-hover'

        map.setFilter(hoveredLayer, ['==', 'name', features[0].properties.name])
        document.body.style.cursor = 'pointer';

        if (this.state.hoveredLayer !== hoveredLayer) {
          this.setState({ hoveredLayer })
        }

      } else if (this.state.hoveredLayer) {
        map.setFilter(this.state.hoveredLayer, ['==', 'name', ''])
        document.body.style.cursor = 'default'
      }
    }
  }

  mapLoaded(e) {
    const layers = this.countryGeoJson.features.map(country => 'country-fill-' + country.id )
    this.setState({ layers })

    this.countryGeoJson.features.forEach((country) => {
      e.addSource('geo-' + country.id, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [country] }
      })
    })
  }

  renderCountryHighlight() {
    const countryMedian = calculateMedian(countries.map((country => country.total_traffic)))

    const highlights = this.countryGeoJson.features.map((country, i) => {
      const trafficCountry = countries.find(c => c.id === country.id)
      const trafficHeat = trafficCountry && getScore(countryMedian, trafficCountry.total_traffic)
      const countryColor = trafficCountry ? heatMapColors[trafficHeat - 1] : '#00a9d4'

      return (
            <div key={i}>
              <Layer
                id={`country-fill-${country.id}`}
                type="fill"
                sourceId={`geo-${country.id}`}
                paint={{
                  'fill-color': countryColor,
                  'fill-opacity': 0.5
                }}/>

              <Layer
                id={`country-fill-${country.id}-hover`}
                type="line"
                sourceId={`geo-${country.id}`}
                paint={{
                  'line-color': countryColor,
                  'line-width': 3
                }}
                layerOptions={{
                  filter: ['==', 'name', '']
                }}/>
            </div>
      )
    })

    return highlights
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

          {this.renderCountryHighlight()}
          {this.cityCircles()}

        {!!this.state.popupContent &&
          <Popup closeButton={true} coordinates={this.state.popupCoords}>
            <span>{this.state.popupContent}</span>
          </Popup>
        }
      </ReactMapboxGl>
    )
  }
}

MapPoc.propTypes = {
  geoData: React.PropTypes.object,
  theme: React.PropTypes.string
}

export default MapPoc;
