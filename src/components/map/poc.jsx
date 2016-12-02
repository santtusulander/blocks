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
      popupCoords: [0, 0],
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

  onStyleLoaded(e) {
    const layers = this.countryGeoJson.features.map(country => 'country-fill-' + country.id )
    cities.forEach((city) => {
      layers.push(city.name.split(' ').join('-').toLowerCase())
    });
    this.setState({ layers })

    this.countryGeoJson.features.forEach((country) => {
      e.addSource('geo-' + country.id, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [country] }
      })
    })
  }

  onZoomEnd(e){
    this.setState({zoom: e.transform.scale})
  }

  openPopup(content, coords) {
    this.setState({ popupContent: content, popupCoords: coords })
  }

  closePopup() {
    this.setState({ popupContent: null })
  }

  onCountryHover(map, feature) {
    if (map.style._loaded) {
      if (this.state.hoveredLayer) {
        map.setPaintProperty(this.state.hoveredLayer.id, this.state.hoveredLayer.type + '-opacity', 0.5)
        map.getCanvas().style.cursor = 'default'
        this.setState({ hoveredLayer: null })
        this.closePopup();
      }

      const features = map.queryRenderedFeatures(feature.point, { layers: this.state.layers })

      if (features.length) {
        const hoveredLayer = { id: features[0].layer.id, type: features[0].layer.type }

        if (this.state.hoveredLayer !== hoveredLayer) {
          map.setPaintProperty(hoveredLayer.id, hoveredLayer.type + '-opacity', 0.8)
          map.getCanvas().style.cursor = 'pointer'
          this.setState({ hoveredLayer })
        }
        this.openPopup(features[0].properties.name, [feature.lngLat.lng, feature.lngLat.lat])
      }
    }
  }

  onCountryHoverEnd(e) {
    e.map.setFilter(this.state.hoveredLayer, ['==', 'name', ''])
    e.map.getCanvas().style.cursor = 'default'
    this.setState({ hoveredLayer: null })
    this.closePopup()
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
                }}>
                  <Feature
                    properties={{
                      name: country.properties.name
                    }}
                    coordinates={country.geometry.coordinates}/>
              </Layer>

              <Layer
                id={`country-stroke-${country.id}`}
                type="line"
                sourceId={`geo-${country.id}`}
                paint={{
                  'line-color': countryColor,
                  'line-width': 2
                }}/>
            </div>
      )
    })

    return highlights
  }

  renderCityCircles() {
    const cityMedian = calculateMedian( cities.map( (city => city.bytes) ) )

    return cities.map((city, i) => {
      const cityHeat = getScore(cityMedian, city.bytes)
      const cityColor = cityHeat ? heatMapColors[ cityHeat - 1 ] : '#000000'
      const cityId = city.name.split(' ').join('-').toLowerCase()

      return (
        <Layer
          id={cityId}
          key={i}
          type="circle"
          paint={{
            'circle-radius': cityHeat * (this.state.zoom / 5),
            'circle-color': cityColor,
            'circle-opacity': 0.5
          }}>
          <Feature
            coordinates={city.position}
            properties={{
              name: city.name
            }} />
        </Layer>
      )
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
        onZoom={this.onZoomEnd.bind(this)}
        onStyleLoad={this.onStyleLoaded.bind(this)}
        onMouseMove={this.onCountryHover.bind(this)}>

          {this.renderCountryHighlight()}
          {this.renderCityCircles()}

        {!!this.state.popupContent &&
          <Popup coordinates={this.state.popupCoords}>
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
