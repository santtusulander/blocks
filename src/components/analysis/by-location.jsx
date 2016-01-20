import React from 'react'
import d3 from 'd3'
import topojson from 'topojson'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as topoActionCreators from '../../redux/modules/topo'

export class AnalysisByLocation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      zoom: null,
      statesHidden: true,
      citiesHidden: true
    }

    this.selectCountry = this.selectCountry.bind(this)
    this.selectState = this.selectState.bind(this)
  }
  componentWillMount() {
    this.props.topoActions.startFetching()
    this.props.topoActions.fetchCountries()
  }
  selectCountry(country, path) {
    const id = country.id.toLowerCase()
    return () => {
      this.setState({
        statesHidden: true,
        citiesHidden: true
      })
      this.props.topoActions.changeActiveCountry(id)
      this.props.topoActions.fetchStates(id).then(() => {
        this.setState({zoom: this.getZoomBounds(country, path)})
        setTimeout(() => {
          this.setState({statesHidden: false})
        }, 500)
      })
    }
  }
  selectState(state, path) {
    const name = state.properties.name
    return () => {
      this.setState({citiesHidden: true})
      this.props.topoActions.changeActiveState(name)
      this.props.topoActions.fetchCities(this.props.activeCountry).then(() => {
        this.setState({zoom: this.getZoomBounds(state, path)})
        setTimeout(() => {
          this.setState({citiesHidden: false})
        }, 500)
      })
    }
  }
  getZoomBounds(d, path) {
    const bounds = path.bounds(d)
    const w_scale = (bounds[1][0] - bounds[0][0]) / this.props.width
    const h_scale = (bounds[1][1] - bounds[0][1]) / this.props.height
    const z = 0.96 / Math.max(w_scale, h_scale)
    const x = (bounds[1][0] + bounds[0][0]) / 2
    const y = (bounds[1][1] + bounds[0][1]) / 2 + (this.props.height / z / 6)
    return [x, y, z]
  }
  render() {
    if(!this.props.width || !this.props.countries.size || this.props.fetching) {
      return <div>Loading...</div>
    }

    const projection = d3.geo.mercator().scale(150)
      .translate([this.props.width / 2, this.props.height / 1.5])
    const path = d3.geo.path().projection(projection)
    const countries = topojson.feature(
      this.props.countries.toJS(),
      this.props.countries.toJS().objects.countries
    ).features

    let states = null
    if(this.props.states.size) {
      states = topojson.feature(
        this.props.states.toJS(),
        this.props.states.toJS().objects.states
      ).features
    }

    let cities = null
    if(this.props.cities.size) {
      cities = topojson.feature(
        this.props.cities.toJS(),
        this.props.cities.toJS().objects.cities
      ).features.filter(d => {
        return this.props.activeState == d.properties.state
      })
    }

    let transform = ''
    let strokeWidth = 1
    if(this.state.zoom) {
      let projTranslate = projection.translate()
      transform = "translate(" +
      projTranslate[0] + 'px,' +
      projTranslate[1] +
      "px) scale(" +
      this.state.zoom[2] +
      ") translate(-" +
      this.state.zoom[0] +
      "px,-" +
      this.state.zoom[1] +
      "px)"
      strokeWidth = 1.0 / this.state.zoom[2] + "px"
    }
    const pathStyle = {
      transform: transform,
      strokeWidth: strokeWidth
    }

    return (
      <svg
        className='analysis-by-location'
        width={this.props.width}
        height={this.props.height}>
        {countries.map((country, i) => {
          let hideCountry = false
          if(!this.state.statesHidden &&
            this.props.activeCountry === country.id.toLowerCase()) {
            hideCountry = true
          }
          return (
            <path key={i} d={path(country)}
              className={'country' + (hideCountry ? ' hiddenpath' : '')}
              style={pathStyle}
              onClick={this.selectCountry(country, path)}/>
          )
        })}
        {states ? states.map((state, i) => {
          return (
            <path key={i} d={path(state)}
              className={'country' + (this.state.statesHidden ? ' hiddenpath' : '')}
              style={pathStyle}
              onClick={this.selectState(state, path)}/>
          )
        }) : null}
        {cities ? cities.map((city, i) => {
          return (
            <path key={i} d={path.pointRadius(20 / this.state.zoom[2])(city)}
              className={'country' + (this.state.citiesHidden ? ' hiddenpath' : '')}
              style={pathStyle}/>
          )
        }) : null}
      </svg>
    )
  }
}

AnalysisByLocation.displayName = 'AnalysisByLocation'
AnalysisByLocation.propTypes = {
  activeCountry: React.PropTypes.string,
  activeState: React.PropTypes.string,
  cities: React.PropTypes.instanceOf(Immutable.Map),
  countries: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  height: React.PropTypes.number,
  states: React.PropTypes.instanceOf(Immutable.Map),
  topoActions: React.PropTypes.object,
  width: React.PropTypes.number
}

function mapStateToProps(state) {
  return {
    activeCountry: state.topo.get('activeCountry'),
    activeState: state.topo.get('activeState'),
    cities: state.topo.get('cities'),
    countries: state.topo.get('countries'),
    states: state.topo.get('states'),
    fetching: state.topo.get('fetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    topoActions: bindActionCreators(topoActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisByLocation);
