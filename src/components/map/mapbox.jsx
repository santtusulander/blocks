import React from 'react'
import ReactMapboxGl, { Popup, ZoomControl } from 'react-mapbox-gl'
import Immutable from 'immutable'

// import Typeahead from '../typeahead'

import {
  MAPBOX_LIGHT_THEME,
  MAPBOX_DARK_THEME,
  MAPBOX_ZOOM_MIN,
  MAPBOX_ZOOM_MAX,
  MAPBOX_SCROLL_TIMEOUT,
  MAPBOX_CITY_LEVEL_ZOOM,
  MAPBOX_CITY_RADIUS_DIVIDER,
  MAPBOX_HEAT_MAP_COLORS,
  MAPBOX_HEAT_MAP_DEFAULT_COLOR
} from '../../constants/mapbox'
import {
  calculateMedian,
  checkChangeInBounds,
  getScore
} from '../../util/mapbox-helpers.js'
// import IconExpand from '../icons/icon-expand';
// import IconMinimap from '../icons/icon-minimap';
import IconGlobe from '../icons/icon-globe';
import LoadingSpinnerSmall from '../loading-spinner/loading-spinner-sm'
class Mapbox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      zoom: MAPBOX_ZOOM_MIN,
      popupCoords: [0, 0],
      popupContent: null,
      layers: [],
      hoveredLayer: null,
      map: null
    }

    this.timeout = null

    this.onPageScroll = this.onPageScroll.bind(this)
  }

  componentDidMount() {
    // We need to add an event listener in order to prevent unwanted interaction
    // with the map when the user is scrolling on the page.
    window.addEventListener('scroll', this.onPageScroll, false)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.countryData.equals(this.props.countryData) && this.state.map || nextProps.dataKey !== this.props.dataKey) {
      // Current country layers need to be removed to avoid duplicates
      // and errors that Mapbox throws if it tries to look for a layer
      // that isn't there.
      const newLayers = this.state.layers.filter(layer => !layer.includes('country-'))

      this.updateLayers(newLayers)
      this.addCountryLayers(this.state.map, nextProps.countryData.toJS(), nextProps.dataKey)
    }

    // Current city layers need to be removed to avoid duplicates
    // and errors that Mapbox throws if it tries to look for a layer
    // that isn't there.
    if (!nextProps.cityData.equals(this.props.cityData) ||
        (nextProps.dataKey !== this.props.dataKey && this.state.zoom >= MAPBOX_CITY_LEVEL_ZOOM)) {
      const newLayers = this.state.layers.filter(layer => layer.includes('country-'))

      this.updateLayers(newLayers)
      this.addCityLayers(this.state.map, nextProps.cityData.toJS(), nextProps.dataKey)
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      window.clearTimeout(this.timeout)
      this.timeout = null
    }

    window.removeEventListener('scroll', this.onPageScroll, false)
    this.props.mapboxActions.setMapBounds({})
  }

  /**
   * A method that is called on page scroll. Does a deep check for Mapbox map
   * instance and then calls for disabling and enabling zoom handlers in the map
   * accordingly.
   *
   * @method onPageScroll
   */
  onPageScroll() {
    // We might not have the map instance saved in this.state yet, so we need to
    // get it from the the ReactMapboxGl components state instead.
    if (this.mapbox && this.mapbox.state && this.mapbox.state.map) {
      this.disableAndEnableZoom(this.mapbox.state.map)
    }
  }

  /**
   * Disables and enables zoom handlers on the map with a slight delay.
   *
   * @method disableAndEnableZoom
   * @param  {object}             map Instance of Mapbox map
   */
  disableAndEnableZoom(map) {
    map.scrollZoom.disable()

    if (this.timeout) {
      window.clearTimeout(this.timeout)
      this.timeout = null
    }

    this.timeout = window.setTimeout(() => map.scrollZoom.enable(), MAPBOX_SCROLL_TIMEOUT)
  }

  /**
   * A method that is called whenever a style has loaded in Mapbox,
   * e.g. when the user switches themes. All the layers need to be
   * reset and redrawn whenever we change styles –– otherwise they won't
   * appear on the map since style change will change the map instance.
   *
   * @method onStyleLoaded
   * @param  {object}      map Instance of Mapbox map
   */
  onStyleLoaded(map) {
    // Fix to draw map correctly on reload
    map.resize()
    this.addCountryLayers(map, this.props.countryData.toJS())

    // If we don't reset hoveredLayer, Mapbox gives an error: Cannot read property 'getPaintProperty' of undefined
    // Look at onMouseMove else clause –– if we still have this.state.hoveredLayer, it tries and fails to
    // change the paint properties of a layer when user has changed themes and moves mouse
    // over the map area.
    if (this.state.hoveredLayer) {
      this.setState({ hoveredLayer: null })
    }

    // Only add city layers if we're within a specific zoom level.
    if (this.state.zoom >= MAPBOX_CITY_LEVEL_ZOOM) {
      this.addCityLayers(map, this.props.cityData.toJS())
    }
  }

  /**
   * Sets the zoom level and scale (needed for city circle radius) in Mapbox.
   *
   * @method onZoom
   * @param  {object} map Instance of Mapbox map
   */
  onZoom(map) {
    this.setState({ scale: map.transform.scale, zoom: map.transform._zoom })
  }

  /**
   * Sets content to the Popup and allows it to be displayed.
   * Displaying the Popup is based on if the Popup has content –– popupContent
   * –– or not.
   *
   * @method openPopup
   * @param  {object}  content Content displayed, should have "title" and "total" properties
   * @param  {array}   coords  Should have one longitude and one latitude value, in this order
   */
  openPopup(content, coords) {
    this.setState({ popupContent: content, popupCoords: coords })
  }

  /**
   * Closes the popup by nulling the content.
   *
   * @method closePopup
   */
  closePopup() {
    this.setState({ popupContent: null })
  }

  /**
   * A method that is called whenever mouse is moved on the map.
   * The main purpose of this method is to set and show hover styles and
   * elements for city and country layers.
   *
   * @method onMouseMove
   * @param  {object}    map     Instance of Mapbox map
   * @param  {object}    feature Object containing mouse position information
   */
  onMouseMove(map, feature) {
    if (map.style._loaded) {
      // Gets all the features under the mouse pointer thats ID (e.g. 'country-fill-HKG')
      // is found in the layer list –– this.state.layers
      const features = map.queryRenderedFeatures(feature.point, { layers: this.state.layers })

      if (features.length) {
        // Check if hovered feature is a cluster since we need to apply different hover style methods on clusters
        const isCluster = features[0].properties.cluster || ~features[0].layer.id.indexOf('clustered')
        // Sets the hovered layer so we can easily reference it in setHoverStyle method
        const hoveredLayer = {
          id: isCluster ? 'cluster-hover' : features[0].layer.id,
          type: features[0].layer.type,
          coordinates: features[0].geometry.coordinates
        }

        if (isCluster) {
          // We need to compare current and previous coordinates in order apply the hover effect
          // on clusters that are overlapping each other.
          const previousCoordinates = this.state.hoveredLayer ? this.state.hoveredLayer.coordinates : [0, 0]
          const currentCoordinates = hoveredLayer.coordinates

          if (currentCoordinates[0] !== previousCoordinates[0] ||
              currentCoordinates[1] !== previousCoordinates[1]) {
            this.removeClusterHoverStyles(map)
          }

          this.addClusterHoverStyles(map, features[0])
        }

        this.setState({ hoveredLayer })
        this.setHoverStyle(map)('opacity', isCluster ? 0.7 : 0.9)('pointer')

        // Sets hover style for the hovered layer and opens the Popup
        this.openPopup(
          {
            title: features[0].properties.cluster ?
                    'Cluster of ' + features[0].properties.point_count + ' cities' :
                    <span className="city-name">{features[0].properties.name}</span>,
            total: features[0].properties[this.props.dataKey]
          },
          [feature.lngLat.lng, feature.lngLat.lat])

      } else {
        // Hides tooltip and resets hover style for the specific layer
        // if we had hovered an interactive layer and the moved mouse
        // out of the layer boundaries.
        if (this.state.hoveredLayer) {
          this.setHoverStyle(map)('opacity', 0.5)('default')
          this.setState({ hoveredLayer: null })
          this.closePopup()

          // Since cluster hovers are separate from the general hover styles,
          // they necessary layers and sources should be removed once hovered
          // outside of the cluster.
          this.removeClusterHoverStyles(map)
        }
      }
    }
  }

  /**
   * [addClusterHoverStyles description]
   * @method addClusterHoverStyles
   * @param  {object}              map     Instance of Mapbox map
   * @param  {object}              feature Object of hovered Mapbox feature,
   *                                       e.g. a layer
   */
  addClusterHoverStyles(map, feature) {
    // Check if there already is a source available before creating it and
    // the hover layer in order to avoid duplicates.
    if (!map.getSource('cluster-hover-source')) {
      map.addSource('cluster-hover-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: feature.geometry,
          properties: feature.properties
        }
      })

      map.addLayer({
        id: 'cluster-hover',
        source: 'cluster-hover-source',
        type: 'circle',
        paint: {
          // Clusters and single cities can be different sizes, so we have to get
          // the correct styles from the hovered feature.
          'circle-color': feature.layer.paint['circle-color'],
          'circle-radius': feature.layer.paint['circle-radius']
        }
      })
    }
  }

  /**
   * [removeClusterHoverStyles description]
   * @method removeClusterHoverStyles
   * @param  {object}              map Instance of Mapbox map
   */
  removeClusterHoverStyles(map) {
    // We can assume that if there is a 'cluster-hover-source' available,
    // we also have the 'cluster-hover' layer created.
    if (map.getSource('cluster-hover-source')) {
      map.removeSource('cluster-hover-source')
      map.removeLayer('cluster-hover')
    }
  }

  /**
   * Set hover style for a hovered layer. Style param should match one of the
   * paint property names defined in Mapbox Style Spec
   * https://www.mapbox.com/mapbox-gl-style-spec/#layer-paint
   * The type prefix (e.g. 'fill') is not needed as it's already being gotten
   * from this.state.hoveredLayer.
   *
   * @method setHoverStyle
   * @param  {object}     map     Instance of Mapbox map
   * @param  {string}     style   Name of the paint property to be modified
   * @param  {multiple}   value   Value of the paint property –– can be string,
   *                              number, boolean, array
   * @param  {string}     cursor  Cursor style value, e.g. 'pointer'
   * @returns {function}
   */
  setHoverStyle(map) {
    return (style, value) => (cursor) => {
      map.setPaintProperty(this.state.hoveredLayer.id, this.state.hoveredLayer.type + '-' + style, value)
      map.getCanvas().style.cursor = cursor
    }
  }

  /**
   * Adds geojson sources for country layers that we have data for. Also calls
   * for rendering the actual styled country layers after creating sources.
   * NOTE: This should be refactored to be same fashion as what addCityLayers and
   * renderCityCircles are.
   *
   * @method addCountryLayers
   * @param  {object}         map         Instance of Mapbox map
   * @param  {array}          countryData List of countries with traffic
   * @param  {string}         dataKey     Name of the key which to show data for
   */
  addCountryLayers(map, countryData, dataKey = this.props.dataKey) {
    if (map && map.style._loaded) {
      let layers = this.state.layers

      // Country layers should be removed from the map to prevent old highlighted countries
      // appearing on the map when changing to a different account
      map.getStyle().layers.filter(layer => layer.id.includes('country-fill') || layer.id.includes('country-stroke'))
                           .forEach(layer => {
                             layers = layers.filter(l => l !== layer.id)
                             map.removeLayer(layer.id)
                           })

      // Filters through the country GeoJSON and creates sources/layers for countries that have data
      this.props.geoData.features.forEach((data) => {
        const countryExists = countryData.some(country => country.code === data.properties.iso_a3)
        const trafficCountry = countryData.find(c => c.code === data.properties.iso_a3)
        const layerExists = layers.some(layer => layer === 'country-fill-' + data.properties.iso_a3)
        const sourceName = 'geo-' + data.properties.iso_a3
        const layerName = 'country-fill-' + data.properties.iso_a3

        // If the country has data and we don't already have a source for it,
        // we create a source layer and add the layer ID to a list.
        if (countryExists) {
          const geoData = {
            type: 'FeatureCollection',
            features: [{
              type: data.type,
              properties: {
                name: data.properties.name,
                [dataKey]: trafficCountry[dataKey]
              },
              geometry: data.geometry
            }]
          }

          // If the country already has a source, we should just update the data.
          if (map.getSource(sourceName)) {
            map.getSource(sourceName).setData(geoData)

          } else {
            map.addSource(sourceName, {
              type: 'geojson',
              data: geoData
            })
          }

          // Adds a layer ID to a list so we can reference it in onMouseMove
          // and set a hover style for it.
          if (!layerExists) {
            layers.push(layerName)
          }

          // Render the actual colored country layers on the map
          this.renderCountryHighlight(map, countryData, trafficCountry, dataKey)
        }
      })


      // Update this.state.layers
      this.updateLayers(layers)

      // Sets updated instance of the map to state so that we can access
      // in componentWillReceiveProps when adding cities. Otherwise Mapbox gives
      // errors for not found layers since we might not have the map in state
      // with all the countries and previous cities.
      this.setState({ map })
    }
  }

  /**
   * Renderes styled –– highlighted –– country layers on the map.
   * NOTE: This should be refactored to be same fashion as what addCityLayers and
   * renderCityCircles are.
   *
   * @method renderCountryHighlight
   * @param  {object}               map            Instance of Mapbox map
   * @param  {array}                countryData    List of countries with traffic
   * @param  {object}               trafficCountry Object a single country with traffic
   * @param  {string}               dataKey        Name of the key which to show data for
   */
  renderCountryHighlight(map, countryData, trafficCountry, dataKey) {
    // Calculate median total for all the countries
    const countryMedian = calculateMedian(countryData.map((country => country[dataKey])))

    // Gets a score for the country based on its total
    const trafficHeat = trafficCountry && getScore(countryMedian, trafficCountry[dataKey], MAPBOX_HEAT_MAP_COLORS.length)

    // Choose a color for the country based on its score
    // See if it's possible to use Mapbox's data-driven styling here.
    // https://www.mapbox.com/blog/data-driven-styling/
    const colorIndex = trafficCountry && trafficHeat < MAPBOX_HEAT_MAP_COLORS.length ? trafficHeat - 1 : null
    const countryColor = colorIndex !== null ? MAPBOX_HEAT_MAP_COLORS[colorIndex] : MAPBOX_HEAT_MAP_DEFAULT_COLOR

    map.addLayer({
      id: `country-fill-${trafficCountry.code}`,
      source: `geo-${trafficCountry.code}`,
      maxzoom: MAPBOX_CITY_LEVEL_ZOOM,
      paint: {
        'fill-color': countryColor,
        'fill-opacity': 0.5
      },
      type: 'fill'
    })

    map.addLayer({
      id: `country-stroke-${trafficCountry.code}`,
      source: `geo-${trafficCountry.code}`,
      maxzoom: MAPBOX_CITY_LEVEL_ZOOM,
      paint: {
        'line-color': countryColor,
        'line-width': 2
      },
      type: 'line'
    })
  }

  /**
   * Adds geojson sources for city layers that we have data for. Also calls
   * for rendering the actual styled city layer after creating a source for it.
   * After cities are rendered, it saves the map instance to state in order
   * to access it later on in the componentWillReceiveProps method.
   *
   * @method addCityLayers
   * @param  {object}         map      Instance of Mapbox map
   * @param  {array}          cityData List of cities with traffic
   * @param  {string}         dataKey  Name of the key which to show data for
   */
  addCityLayers(map, cityData, dataKey = this.props.dataKey) {
    // We might not have map available yet, so check if it exists before doing anything
    if (map && map.style._loaded) {
      // Calculate median total for all the countries
      // NOTE: All these city medians and scores should be rethought as currently
      // for example the score (cityHeat) can be anything between 1-9999, with one
      // being 9999 and the next one 200. This is too big of a gap between the two
      // and sizing can be way off. Maybe city.total instead of city.bits_per_second?
      const cityMedian = calculateMedian(cityData.map((city => city[dataKey])))

      // Get the highest value to base the sizing percentage against
      const highestValue = cityData.map(city => getScore(cityMedian, city[dataKey])).sort((a, b) => b - a)[0]

      // Go through the city data and create a Feature of each city.
      const cityFeatures = cityData.map((city) => {
        // Get score for the city based on bits_per_second
        const cityHeat = getScore(cityMedian, city[dataKey])
        // This city's percentage of the highest score of all cities
        const percentage = cityHeat / highestValue * 100

        return {
          type: 'Feature',
          properties: {
            name: city.name,
            [dataKey]: city[dataKey],
            radiusPercentage: percentage
          },
          geometry: {
            type: 'Point',
            coordinates: [city.lon, city.lat]
          }
        }

      })

      // If the map already has source for the cities, we should remove it and create it again
      // since data has changed.
      if (map.getSource('geo-cities')) {
        map.removeSource('geo-cities')
      }

      map.addSource('geo-cities', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: cityFeatures
        },
        cluster: true,
        clusterMaxZoom: MAPBOX_ZOOM_MAX - 1,
        clusterRadius: 32
      })

      // Render all necessary clustered layers
      this.renderCityCircles(map)

      const layers = this.state.layers
      layers.push('clustered-cities', 'unclustered-cities')

      // Update map instance since we have added new layers and sources.
      this.updateLayers(layers)

    }
  }

  /**
   * Renderes styled city cluster layers –– circles –– on the map.
   *
   * @method renderCityCircles
   */
  renderCityCircles(map) {
    // Sets radius for the city circle based on the percentage.
    // There is no need to set all the steps because Mapbox's data-driven styling
    // is clever enough to proportionally interpolate between the values.
    // https://www.mapbox.com/blog/data-driven-styling/
    const cityRadiuses = [
      [0, (7 / MAPBOX_CITY_RADIUS_DIVIDER) * this.state.zoom],
      [100, (36 / MAPBOX_CITY_RADIUS_DIVIDER) * this.state.zoom]
    ]

    // If the layer exists, we should remove it in order to do a full reset for changed data
    if (map.getLayer('unclustered-cities')) {
      map.removeLayer('unclustered-cities')
    }

    // Adds layer for displaying single cities.
    map.addLayer({
      id: 'unclustered-cities',
      source: 'geo-cities',
      minzoom: MAPBOX_CITY_LEVEL_ZOOM,
      type: 'circle',
      filter: ['!has', 'point_count'],
      paint: {
        'circle-color': MAPBOX_HEAT_MAP_DEFAULT_COLOR,
        'circle-radius': {
          property: 'radiusPercentage',
          stops: cityRadiuses
        },
        'circle-opacity': 0.5
      }
    })

    // If the layer exists, we should remove it in order to do a full reset for changed data
    if (map.getLayer('clustered-cities')) {
      map.removeLayer('clustered-cities')
    }

    // Adds layer for displaying clusters.
    map.addLayer({
      id: 'clustered-cities',
      source: 'geo-cities',
      minzoom: MAPBOX_CITY_LEVEL_ZOOM,
      type: 'circle',
      paint: {
        'circle-color': MAPBOX_HEAT_MAP_DEFAULT_COLOR,
        'circle-radius': 32,
        'circle-opacity': 0.5
      },
      filter: ['all', ['>=', 'point_count', 2]]
    })
  }

  /**
   * Gets current map bounds and the requests to get city data within those bounds.
   *
   * @method getCitiesOnZoomDrag
   * @param  {object}            map Instance of Mapbox map
   */
  getCitiesOnZoomDrag(map) {
    this.props.mapboxActions.setMapZoom(map.getZoom())
    // Only gets the bounds and city data when within a specific zoom level.
    if (this.state.zoom >= MAPBOX_CITY_LEVEL_ZOOM) {
      // Get current bounds saved in redux store
      const currentBounds = this.props.mapBounds

      // We need to wrap map center in order to get actual lat/lon coordinates
      // See: https://github.com/mapbox/mapbox-gl-js/issues/3690
      map.setCenter(map.getCenter().wrap())

      // Do a check when we should fetch more city data
      const shouldFetchCities = checkChangeInBounds(currentBounds, map.getBounds()) || !this.props.cityData.size || !currentBounds.size

      if (shouldFetchCities) {
        // All of these are longitude/latitude values
        const south = map.getBounds().getSouth()
        const west = map.getBounds().getWest()
        const north = map.getBounds().getNorth()
        const east = map.getBounds().getEast()

        // Saves map bounds to Redux so we can do comparison later on and see
        // if use has panned the viewport enough in order to request more cities.
        this.props.mapboxActions.setMapBounds({ south, west, north, east })
        this.setState({ isFetchingCityData: true })
        this.props.getCitiesWithinBounds(south, west, north, east).then(() => {
          this.setState({ isFetchingCityData: false })
        })
      }

    }
  }

  /**
   * Updates layers in state.
   *
   * @method updateLayers
   * @param  {array}     layers Array of strings
   */
  updateLayers(layers) {
    this.setState({ layers })
  }

  /**
   * Resets the zoom level to the initial one.
   *
   * @method resetZoom
   */
  resetZoom() {
    this.setState({ zoom: MAPBOX_ZOOM_MIN })
  }

  render() {
    const { isFetchingCityData } = this.state
    const mapboxUrl = (this.props.theme === 'light') ? MAPBOX_LIGHT_THEME : MAPBOX_DARK_THEME

    return (
      <ReactMapboxGl
        ref={ref => { this.mapbox = ref }}
        accessToken={MAPBOX_ACCESS_TOKEN}
        style={mapboxUrl}
        containerStyle={{
          height: this.props.height
        }}
        zoom={[this.state.zoom]}
        minZoom={MAPBOX_ZOOM_MIN}
        maxZoom={MAPBOX_ZOOM_MAX}
        onZoom={this.onZoom.bind(this)}
        onZoomEnd={this.getCitiesOnZoomDrag.bind(this)}
        onStyleLoad={this.onStyleLoaded.bind(this)}
        onMouseMove={this.onMouseMove.bind(this)}
        onDragEnd={this.getCitiesOnZoomDrag.bind(this)}
        dragRotate={false}>

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
              {this.state.popupContent.total &&
                <table>
                  <tbody>
                    <tr>
                      <td className="bold">Total</td>
                      <td>{this.props.dataKeyFormat(this.state.popupContent.total)}</td>
                    </tr>
                  </tbody>
                </table>
              }
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
                display: 'flex',
                justifyContent: 'space-between',
                boxShadow: 'none',
                border: 0,
                position: 'relative',
                top: 'auto',
                right: 'auto',
                zIndex: 1
              }}/>
            <div
              className="map-zoom-reset"
              onClick={this.resetZoom.bind(this)}>
              <IconGlobe width={32} height={32} />
            </div>
            {isFetchingCityData && <LoadingSpinnerSmall />}
          </div>
          {/*
          <div className="control map-minimap">
            <IconMinimap width={32} height={32} />
          </div>
           */}
        </div>

        {this.state.zoom < MAPBOX_CITY_LEVEL_ZOOM &&
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

Mapbox.displayName = "Mapbox"
Mapbox.propTypes = {
  cityData: React.PropTypes.instanceOf(Immutable.List).isRequired,
  countryData: React.PropTypes.instanceOf(Immutable.List).isRequired,
  dataKey: React.PropTypes.string,
  dataKeyFormat: React.PropTypes.func,
  geoData: React.PropTypes.object.isRequired,
  getCitiesWithinBounds: React.PropTypes.func,
  height: React.PropTypes.number,
  mapBounds: React.PropTypes.object,
  mapboxActions: React.PropTypes.object,
  theme: React.PropTypes.string
}

Mapbox.defaultProps = {
  dataKeyFormat: data => data,
  getCitiesWithinBounds: () => {
    // no-op
  },
  mapboxActions: {
    setMapBounds: () => null,
    setMapZoom: () => null
  },
  mapBounds: Immutable.Map()
}

export default Mapbox
