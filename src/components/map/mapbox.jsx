import React from 'react'
import ReactMapboxGl, { Popup, ZoomControl } from 'react-mapbox-gl'
// import Typeahead from 'react-bootstrap-typeahead'

import {MAPBOX_LIGHT_THEME, MAPBOX_DARK_THEME} from '../../constants/mapbox'

// import IconExpand from '../icons/icon-expand';
// import IconMinimap from '../icons/icon-minimap';
// import IconGlobe from '../icons/icon-globe';

import { formatBitsPerSecond } from '../../util/helpers.js'

const heatMapColors = [
  '#7b0663',
  '#8f2254',
  '#a54242',
  '#ba5f32',
  '#d4851d',
  '#f9ba01'
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

class Mapbox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      zoom: 1,
      popupCoords: [0, 0],
      popupContent: null,
      layers: [],
      hoveredLayer: null,
      map: null
    }

    this.countryGeoJson = {
      type: 'FeatureCollection',
      features: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cityData !== this.props.cityData) {
      const newLayers = nextProps.cityData.map((city) => {
        const cityName = 'city-' + city.name.split(' ').join('-').toLowerCase()

        if (this.state.map.getLayer(cityName)) {
          this.state.map.removeLayer(cityName)
        }

        return cityName
      }).concat(this.state.layers.filter(layer => layer.includes('country-')))

      this.updateLayers(newLayers)
      this.addCityLayers(this.state.map, nextProps.cityData)
    }
  }

  onStyleLoaded(map) {
    this.addCountryLayers(map)

    if (this.state.zoom > 6.9) {
      this.addCityLayers(map, this.props.cityData)
    }
  }

  onZoom(e) {
    this.setState({ scale: e.transform.scale, zoom: e.transform._zoom })
  }

  openPopup(content, coords) {
    this.setState({ popupContent: content, popupCoords: coords })
  }

  closePopup() {
    this.setState({ popupContent: null })
  }

  onMouseMove(map, feature) {
    if (map.style._loaded) {
      if (this.state.hoveredLayer) {
        this.setHoverStyle(map)('opacity', 0.5)('default')
        this.setState({ hoveredLayer: null })
        this.closePopup()
      }

      const features = map.queryRenderedFeatures(feature.point, { layers: this.state.layers })

      if (features.length) {
        const hoveredLayer = { id: features[0].layer.id, type: features[0].layer.type }

        this.setState({ hoveredLayer })
        this.setHoverStyle(map)('opacity', 0.9)('pointer')
        this.openPopup(
          {
            title: features[0].properties.name,
            total: features[0].properties.total
          },
          [feature.lngLat.lng, feature.lngLat.lat])
      }
    }
  }

  /**
   * Set hover style for a hovered layer. Style param should match one of the
   * paint property names defined in Mapbox Style Spec
   * https://www.mapbox.com/mapbox-gl-style-spec/#layer-paint
   * The type prefix (e.g. 'fill') is not needed as it's already being gotten
   * from this.state.hoveredLayer.
   * @param map
   * @param style, value
   * @param cursor
   * @returns {function}
   */
  setHoverStyle(map) {
    return (style, value) => (cursor) => {
      map.setPaintProperty(this.state.hoveredLayer.id, this.state.hoveredLayer.type + '-' + style, value)
      map.getCanvas().style.cursor = cursor
    }
  }

  addCountryLayers(map) {
    const layers = this.state.layers
    this.countryGeoJson.features = this.props.geoData.features.filter((data) => {
      const countryExists = this.props.countryData.some(country => country.code === data.properties.iso_a3)
      const trafficCountry = this.props.countryData.find(c => c.code === data.properties.iso_a3)
      const layerExists = layers.some(layer => layer === 'country-fill-' + data.properties.iso_a3)

      if (countryExists) {
        if (!map.getSource('geo-' + data.properties.iso_a3)) {
          map.addSource('geo-' + data.properties.iso_a3, {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [{
                type: data.type,
                properties: {
                  name: data.properties.name,
                  total: trafficCountry.bits_per_second
                },
                geometry: data.geometry
              }]
            }
          })

          if (!layerExists) {
            layers.push('country-fill-' + data.properties.iso_a3)
          }

        }
        return data
      }
    })

    this.renderCountryHighlight(map)
    this.updateLayers(layers)

  }

  addCityLayers(map, cityData) {
    cityData.forEach((city) => {
      const cityName = 'city-' + city.name.split(' ').join('-').toLowerCase()

      if (!map.getSource('geo-' + cityName)) {
        map.addSource('geo-' + cityName, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {
                name: city.name,
                total: city.bits_per_second
              },
              geometry: {
                type: 'Point',
                coordinates: [city.lon, city.lat]
              }
            }]
          }
        })
      }

      this.renderCityCircle(map, city, cityData)
    })

    this.setState({ map })
  }

  renderCountryHighlight(map) {
    const countries = this.props.countryData
    const countryMedian = calculateMedian(countries.map((country => country.total)))

    this.countryGeoJson.features.forEach((country) => {
      const trafficCountry = countries.find(c => c.code === country.properties.iso_a3)
      const trafficHeat = trafficCountry && getScore(countryMedian, trafficCountry.total)
      const countryColor = trafficCountry && trafficHeat < heatMapColors.length ? heatMapColors[trafficHeat - 1] : '#f9ba01'

      map.addLayer({
        id: `country-fill-${country.properties.iso_a3}`,
        source: `geo-${country.properties.iso_a3}`,
        maxzoom: 7,
        paint: {
          'fill-color': countryColor,
          'fill-opacity': 0.5
        },
        type: 'fill'
      })

      map.addLayer({
        id: `country-stroke-${country.properties.iso_a3}`,
        source: `geo-${country.properties.iso_a3}`,
        maxzoom: 7,
        paint: {
          'line-color': countryColor,
          'line-width': 2
        },
        type: 'line'
      })
    })
  }

  renderCityCircle(map, city, cityData) {
    const cities = cityData
    const cityMedian = calculateMedian(cities.map((city => city.bits_per_second)))

    const highestValue = cities.map(city => getScore(cityMedian, city.bits_per_second)).sort((a, b) => b - a)[0]
    const cityHeat = getScore(cityMedian, city.bits_per_second)
    const percentage = cityHeat / highestValue * 100

    const cityId = 'city-' + city.name.split(' ').join('-').toLowerCase()
    const cityRadius = percentage >= 95 ?
                       32 + percentage / 10 :
                       percentage >= 80 && percentage < 95 ?
                       30 + percentage / 10 :
                       percentage >= 60 && percentage < 80 ?
                       24 + percentage / 10 :
                       percentage >= 40 && percentage < 60 ?
                       16 + percentage / 10 :
                       percentage >= 20 && percentage < 40 ?
                       14 + percentage / 10 :
                       percentage >= 10 && percentage < 20 ?
                       10 + percentage / 10 :
                       percentage > 0 && percentage < 10 ?
                       7 + percentage : 7

    map.addLayer({
      id: cityId,
      source: 'geo-' + cityId,
      type: 'circle',
      minzoom: 6.9,
      paint: {
        'circle-radius': (cityRadius / 10) * this.state.zoom,
        'circle-color': '#f9ba01',
        'circle-opacity': 0.5
      }
    })
  }

  onZoomClick(map, value) {
    return value < 0 ? map.zoomOut() : map.zoomIn()
  }

  getCitiesOnZoomDrag(map) {
    if (this.state.zoom > 6.9) {
      const south = map.getBounds().getSouth()
      const west = map.getBounds().getWest()
      const north = map.getBounds().getNorth()
      const east = map.getBounds().getEast()

      this.props.getCitiesWithinBounds(south, west, north, east)
      this.setState({ map })
    }
  }

  updateLayers(layers) {
    this.setState({ layers })
  }

  render() {
    const mapboxUrl = (this.props.theme === 'light') ? MAPBOX_LIGHT_THEME : MAPBOX_DARK_THEME

    return (
      <ReactMapboxGl
        accessToken={MAPBOX_ACCESS_TOKEN}
        style={mapboxUrl}
        containerStyle={{
          height: '600px'
        }}
        zoom={[this.state.zoom]}
        minZoom={1}
        maxZoom={13}
        onZoom={this.onZoom.bind(this)}
        onZoomEnd={this.getCitiesOnZoomDrag.bind(this)}
        onStyleLoad={this.onStyleLoaded.bind(this)}
        onMouseMove={this.onMouseMove.bind(this)}
        onDragEnd={this.getCitiesOnZoomDrag.bind(this)}>

        {/*
        <div className="map-search">
          <Typeahead
            minLength={1}
            onChange={() => null}
            options={[
              {id: 'BY', label: 'Belarus'},
              {id: 'CA', label: 'Canada'},
              {id: 'FI', label: 'Finland'},
              {id: 'DE', label: 'Germany'},
              {id: 'SE', label: 'Sweden'},
              {id: 'UA', label: 'Ukraine'},
              {id: 'US', label: 'United States'}
            ]}/>
        </div>
        */}

        {!!this.state.popupContent &&
          <Popup anchor="bottom-left" coordinates={this.state.popupCoords}>
            <div>
              <span className="popup-title bold">{this.state.popupContent.title}</span>
              <table>
                <tbody>
                  <tr>
                    <td className="bold">Total</td>
                    <td>{formatBitsPerSecond(this.state.popupContent.total, 2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Popup>
        }

        <div className="map-controls">
          {/*
          <div className="control map-fullscreen">
            <IconExpand width={32} height={32} />
          </div>
          */}
          <div className="control map-zoom">
            <ZoomControl
              style={{
                height: 'calc(100% - 32px)',
                display: 'flex',
                justifyContent: 'space-between',
                boxShadow: 'none',
                border: 0,
                position: 'relative',
                top: 'auto',
                right: 'auto',
                zIndex: 1
              }}
              onControlClick={this.onZoomClick.bind(this)} />
            {/*
            <div className="map-zoom-reset">
              <IconGlobe width={32} height={32} />
            </div>
            */}
          </div>
          {/*
          <div className="control map-minimap">
            <IconMinimap width={32} height={32} />
          </div>
           */}
        </div>

        {this.state.zoom < 7 &&
          <div className="map-heat-legend">
            <span>Low</span>
            <div className="heat-gradient" />
            <span>High</span>
          </div>
        }

      </ReactMapboxGl>
    )
  }
}

Mapbox.propTypes = {
  cityData: React.PropTypes.array,
  countryData: React.PropTypes.array,
  geoData: React.PropTypes.object,
  getCitiesWithinBounds: React.PropTypes.func,
  theme: React.PropTypes.string
}

Mapbox.defaultProps = {
  getCitiesWithinBounds: () => {}
}

export default Mapbox;
