import React from 'react'
import ReactMapboxGl, { Layer, Feature, Popup, ZoomControl } from 'react-mapbox-gl'
import Typeahead from 'react-bootstrap-typeahead'

import {MAPBOX_LIGHT_THEME, MAPBOX_DARK_THEME} from '../../constants/mapbox'

import IconExpand from '../icons/icon-expand';
import IconMinimap from '../icons/icon-minimap';
import IconGlobe from '../icons/icon-globe';

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
      hoveredLayer: null
    }

    this.countryGeoJson = {
      type: 'FeatureCollection',
      features: []
    }
  }

  onStyleLoaded(map) {
    this.addCountryLayers(map, this.state.layers)
    this.addCityLayers(map, this.state.layers)
  }

  onZoom(e) {
    this.setState({ scale: e.transform.scale, zoom: e.transform._zoom })
  }

  onZoomEnd(e) {
    if (this.state.zoom > 5) {
      this.state.layers.forEach((layer) => {
        if (!layer.includes('country')) {
          e.setPaintProperty(layer, 'circle-radius',
            e.getLayer(layer).metadata.radius * (this.state.scale / 10)
          )
        }
      })
    }

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

  addCountryLayers(map, layers) {
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
            this.setState({ layers });
          }

        }
        return data
      }
    })

    this.renderCountryHighlight(map)

  }

  addCityLayers(map, layers) {
    this.props.cityData.forEach((city) => {
      const cityName = city.city.split(' ').join('-').toLowerCase()
      const layerExists = layers.some(layer => layer === cityName)

      if (!map.getSource('geo-' + cityName)) {
        map.addSource('geo-' + cityName, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {
                name: city.city,
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

      if (!layerExists) {
        layers.push(cityName)
        this.setState({ layers })
      }
    })

    this.renderCityCircles(map)
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
        maxzoom: 5,
        paint: {
          'fill-color': countryColor,
          'fill-opacity': 0.5
        },
        type: 'fill'
      })

      map.addLayer({
        id: `country-stroke-${country.properties.iso_a3}`,
        source: `geo-${country.properties.iso_a3}`,
        maxzoom: 5,
        paint: {
          'line-color': countryColor,
          'line-width': 2
        },
        type: 'line'
      })
    })

    this.setState({ map })

  }

  renderCityCircles(map) {
    const cities = this.props.cityData
    const cityMedian = calculateMedian(cities.map((city => city.bits_per_second)))

    cities.forEach((city) => {
      const cityHeat = getScore(cityMedian, city.bits_per_second)
      const cityColor = cityHeat && cityHeat < heatMapColors.length ? heatMapColors[ cityHeat - 1 ] : '#000000'
      const cityId = city.city.split(' ').join('-').toLowerCase()

      map.addLayer({
        id: cityId,
        source: 'geo-' + cityId,
        type: 'circle',
        minzoom: 5,
        paint: {
          'circle-radius': cityHeat,
          'circle-color': cityColor,
          'circle-opacity': 0.5
        },
        metadata: {
          radius: cityHeat
        }
      })
    })
  }

  onZoomClick(map, value) {
    return value < 0 ? map.zoomOut() : map.zoomIn()
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
        zoom={[this.state.zoom]}
        minZoom={1}
        maxZoom={13}
        onZoom={this.onZoom.bind(this)}
        onZoomEnd={this.onZoomEnd.bind(this)}
        onStyleLoad={this.onStyleLoaded.bind(this)}
        onMouseMove={this.onMouseMove.bind(this)}>

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
          <div className="control map-fullscreen">
            <IconExpand width={32} height={32} />
          </div>
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
            <div className="map-zoom-reset">
              <IconGlobe width={32} height={32} />
            </div>
          </div>
          <div className="control map-minimap">
            <IconMinimap width={32} height={32} />
          </div>
        </div>

        <div className="map-heat-legend">
          <span>Low</span>
          <div className="heat-gradient" />
          <span>High</span>
        </div>

      </ReactMapboxGl>
    )
  }
}

Mapbox.propTypes = {
  cityData: React.PropTypes.array,
  countryData: React.PropTypes.array,
  geoData: React.PropTypes.object,
  theme: React.PropTypes.string
}

export default Mapbox;
