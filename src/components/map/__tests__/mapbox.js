import React from 'react'
import { shallow, mount } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../../../assets/topo/custom.geo.json')
import * as countriesGeoJSON from '../../../assets/topo/custom.geo.json';
jest.unmock('../../../util/mapbox-helpers')
jest.unmock('../mapbox.jsx')
import Mapbox from '../mapbox.jsx'

jest.useFakeTimers()

function mapboxActionsMaker() {
  return {
    setMapBounds: jest.fn()
  }
}

import {
  MAPBOX_LIGHT_THEME,
  MAPBOX_DARK_THEME
} from '../../../constants/mapbox'

describe('Mapbox', () => {
  let defaultProps
  let defaultMapbox
  let defaultMap
  const defaultCountryData = Immutable.fromJS([
    { "name": "Hong Kong", "bits_per_second": -100, "code": "HKG", "total": -100 },
    { "name": "Japan", "bits_per_second": 333, "code": "JPN", "total": 333 },
    { "name": "Korea, Republic Of", "bits_per_second": 666, "code": "KOR", "total": 666 },
    { "name": "Malaysia", "bits_per_second": 100000000000, "code": "MYS", "total": 1000000000000 }
  ])
  const defaultCityData = Immutable.fromJS([
    { average_bits_per_second: 4223145, average_bytes: 1900415286, bits_per_second: 3607277, country: "KR", detail: [], historical_total: 246001104692, lat: 35.8656, lon: 128.6038, name: "daegu", percent_change: -0.0498, percent_total: 0.1592, region: "27", requests: 935, total: 233751080205 }
  ])

  const subject = (props = {}, mapbox = null, map = null) => {
    defaultProps = {
      cityData: Immutable.List(),
      countryData: Immutable.List(),
      geoData: countriesGeoJSON,
      getCitiesWithinBounds: jest.fn(),
      dataKey: 'abc',
      height: 200,
      theme: 'light',
      mapboxActions: mapboxActionsMaker()
    }
    const subjectProps = Object.assign({}, defaultProps, props)
    const component = shallow(<Mapbox {...subjectProps} />)
    component.state().map = map || defaultMap
    component.instance().mapbox = mapbox || defaultMapbox
    return component
  }

  beforeEach(() => {
    setTimeout.mockReset()
    clearTimeout.mockReset()

    defaultMap = {
      addLayer: jest.fn(),
      getLayer: jest.fn(),
      removeLayer: jest.fn(),
      getSource: jest.fn(),
      addSource: jest.fn(),
      removeSource: jest.fn(),
      resize: jest.fn(),
      queryRenderedFeatures: jest.fn(),
      setPaintProperty: jest.fn(),
      getCanvas: jest.fn(() => { return { style: {} } }),
      getStyle: jest.fn(() => { return { layers: [] } }),
      layers: [],
      scrollZoom: {
        disable: jest.fn()
      },
      style: {
        _loaded: false
      }
    }
    defaultMapbox = {
      state: {
        map: defaultMap
      }
    }
  })

  it('should exist', () => {
    expect(subject()).toBeDefined()
  })

  it('should allow custom themes', () => {
    const mapboxWithLightTheme = subject({ theme: 'light' })
    let mapboxStyle = mapboxWithLightTheme.find('ReactMapboxGl').props().style
    expect(mapboxStyle).toBe(MAPBOX_LIGHT_THEME)

    const mapboxWithDarkTheme = subject({ theme: 'dark' })
    mapboxStyle = mapboxWithDarkTheme.find('ReactMapboxGl').props().style
    expect(mapboxStyle).toBe(MAPBOX_DARK_THEME)
  })

  it('should load sources/layers AFTER the style has been loaded', () => {
    const mapbox = subject({ countryData: defaultCountryData })

    expect(mapbox.state().layers.length).toBe(0)
    defaultMap.style._loaded = true
    mapbox.instance().onStyleLoaded(defaultMap)
    expect(mapbox.state().layers.length).toBe(4)
    expect(defaultMap.addSource.mock.calls.length).toBe(4)
    expect(defaultMap.addLayer.mock.calls.length).toBe(8)
  })

  it('should update country source if it exists already', () => {
    const source = { setData: jest.fn() }
    defaultMap.getSource = jest.fn(() => source)

    const mapbox = subject({ countryData: defaultCountryData })
    defaultMap.style._loaded = true
    mapbox.instance().onStyleLoaded(defaultMap)

    expect(defaultMap.addSource.mock.calls).toHaveLength(0)
    expect(source.setData.mock.calls).toHaveLength(4)
  })

  it('should load cities when zoomed in', () => {
    defaultMap.style._loaded = true
    const mapbox = subject({ cityData: defaultCityData })
    mapbox.state().zoom = 7
    mapbox.instance().onStyleLoaded(defaultMap)

    expect(defaultMap.addSource.mock.calls.length).toBe(1)
    expect(defaultMap.addLayer.mock.calls.length).toBe(2)
  })

  it('should NOT load city layers if the map style isn\'t loaded', () => {
    const mapbox = subject({ cityData: defaultCityData })
    mapbox.state().zoom = 7
    mapbox.instance().onStyleLoaded(defaultMap)

    expect(defaultMap.addSource.mock.calls.length).toBe(0)
    expect(defaultMap.addLayer.mock.calls.length).toBe(0)
  })

  it('should remove the old city layer when city data changes', () => {
    defaultMap.getSource = jest.fn(() => true)
    defaultMap.getLayer = jest.fn(() => true)
    defaultMap.style._loaded = true
    const mapbox = subject({ cityData: defaultCityData })
    mapbox.state().zoom = 7
    mapbox.instance().onStyleLoaded(defaultMap)

    expect(defaultMap.removeSource.mock.calls).toHaveLength(1)
    expect(defaultMap.removeLayer.mock.calls).toHaveLength(2)
  })

  it('should remove the hover layer when data changes', () => {
    const mapbox = subject()
    mapbox.setState({ hoveredLayer: 'abc' })
    mapbox.instance().onStyleLoaded(defaultMap)

    expect(mapbox.state().hoveredLayer).toBe(null)
  })

  it('should ignore scroll events if the map hasn\'t mounted yet', () => {
    const mapbox = subject()
    mapbox.state().map = null
    mapbox.instance().mapbox = null
    mapbox.instance().disableAndEnableZoom = jest.fn()
    mapbox.instance().componentDidMount()
    mapbox.instance().onPageScroll()

    expect(mapbox.instance().disableAndEnableZoom.mock.calls).toHaveLength(0)
  })

  it('should prevent zoom events on page scroll', () => {
    expect(defaultMap.scrollZoom.disable.mock.calls).toHaveLength(0)
  })

  it('should perform cleanup on unmount', () => {
    const mapbox = subject()
    mapbox.instance().componentWillUnmount()
    expect(clearTimeout.mock.calls).toHaveLength(0)

    mapbox.instance().timeout = 1
    mapbox.instance().componentWillUnmount()
    expect(clearTimeout.mock.calls).toHaveLength(1)
    expect(mapbox.instance().timeout).toBe(null)
  })

  it('should render a popup when data is available', () => {
    const mapbox = subject()
    mapbox.instance().openPopup({ title: 'test', total: 42 }, [])

    const popup = mapbox.find('Popup')
    expect(popup).toHaveLength(1)
    expect(popup.find('.popup-title').text()).toBe('test')
    expect(popup.find('td').at(1).text()).toBe('42')
  })

  it('should allow the popup to be closed', () => {
    const mapbox = subject()

    mapbox.instance().openPopup({ title: 'test', total: 42 }, [])
    expect(mapbox.find('Popup')).toHaveLength(1)

    mapbox.instance().closePopup()
    expect(mapbox.find('Popup')).toHaveLength(0)
  })

  it('should reset the zoom level of the map', () => {
    const mapbox = subject()
    mapbox.setState({ zoom: 3 })
    mapbox.find('.map-zoom-reset').simulate('click')

    expect(mapbox.state().zoom).not.toBe(3)
  })

  it('should update layers when country data changes', () => {
    const mapbox = subject()
    mapbox.instance().updateLayers = jest.fn()
    mapbox.instance().addCountryLayers = jest.fn()
    mapbox.instance().componentWillReceiveProps(Object.assign({}, mapbox.instance().props, { countryData: defaultCountryData }))

    expect(mapbox.instance().updateLayers.mock.calls).toHaveLength(1)
    expect(mapbox.instance().addCountryLayers.mock.calls).toHaveLength(1)
  })

  it('should update layers when city data changes', () => {
    const mapbox = subject()
    mapbox.instance().updateLayers = jest.fn()
    mapbox.instance().addCityLayers = jest.fn()
    mapbox.instance().componentWillReceiveProps(Object.assign({}, mapbox.instance().props, { cityData: defaultCityData }))

    expect(mapbox.instance().updateLayers.mock.calls).toHaveLength(1)
    expect(mapbox.instance().addCityLayers.mock.calls).toHaveLength(1)
  })

  it('should update layers when the data key changes', () => {
    const mapbox = subject({ countryData: defaultCountryData })
    mapbox.instance().updateLayers = jest.fn()
    mapbox.instance().addCountryLayers = jest.fn()
    mapbox.instance().componentWillReceiveProps(Object.assign({}, mapbox.instance().props, { dataKey: 'loremIpsum' }))

    expect(mapbox.instance().updateLayers.mock.calls).toHaveLength(1)
    expect(mapbox.instance().addCountryLayers.mock.calls).toHaveLength(1)
  })

  it('should update layers when the zoom level changes', () => {
    const mapbox = subject({ countryData: defaultCountryData })
    mapbox.instance().updateLayers = jest.fn()
    mapbox.instance().addCountryLayers = jest.fn()
    mapbox.instance().componentWillReceiveProps(Object.assign({}, mapbox.instance().props, { dataKey: 'loremIpsum' }))
  })

  it('should NOT update layers when the map is not defined', () => {
    const mapbox = subject()
    mapbox.instance().updateLayers = jest.fn()
    mapbox.instance().map = null
    mapbox.instance().componentWillReceiveProps(defaultProps)

    expect(mapbox.instance().updateLayers.mock.calls).toHaveLength(0)
  })


  it('should handle mouse movements', () => {
    defaultMap.style._loaded = true
    defaultMap.queryRenderedFeatures = jest.fn(() => [])

    const mapbox = subject()
    mapbox.simulate('mouseMove', defaultMap, { point: 0 })

    expect(defaultMap.queryRenderedFeatures.mock.calls).toHaveLength(1)
  })

  it('should remove hoveredLayer if mouse moves out from country/city feature', () => {
    defaultMap.style._loaded = true
    defaultMap.queryRenderedFeatures = jest.fn(() => [])

    const mapbox = subject()
    mapbox.setState({ hoveredLayer: 'abc' })
    mapbox.simulate('mouseMove', defaultMap, { point: 0 })

    expect(mapbox.state().hoveredLayer).toBe(null)
  })

  it('should show a popup for a hovered country', () => {
    const mockFeature = { layer: { id: 'abc' }, properties: { }, geometry: { coordinates: [ ] }, lngLat: { lng: 0, lat: 0 }, point: 0 }
    defaultMap.style._loaded = true
    defaultMap.queryRenderedFeatures = jest.fn(() => [ mockFeature ])

    const mapbox = subject()
    mapbox.instance().setHoverStyle = jest.fn(() => { return () => { return () => { } } })
    mapbox.simulate('mouseMove', defaultMap, mockFeature)

    expect(mapbox.state().hoveredLayer).toBeDefined()
  })

  it('should show a popup for a hovered cluster', () => {
    const mockFeature = { layer: { id: 'abc', paint: { } }, properties: { cluster: true }, geometry: { coordinates: [ 1, 2 ] }, lngLat: { lng: 0, lat: 0 }, point: 0 }
    defaultMap.style._loaded = true
    defaultMap.queryRenderedFeatures = jest.fn(() => [ mockFeature ])

    const mapbox = subject()
    mapbox.instance().setHoverStyle = jest.fn(() => () =>  () => { })
    mapbox.simulate('mouseMove', defaultMap, mockFeature)

    expect(mapbox.state().hoveredLayer).toBeDefined()
  })

  it('should ignore mouse movements if the map style isn\'t loaded', () => {
    const mapbox = subject()
    mapbox.simulate('mouseMove', defaultMap)

    expect(defaultMap.queryRenderedFeatures.mock.calls).toHaveLength(0)
  })
})
