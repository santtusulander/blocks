import React from 'react'
import d3 from 'd3'
import topojson from 'topojson'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as topoActionCreators from '../../redux/modules/topo'

class AnalysisByTime extends React.Component {
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
    const id = state.id.toLowerCase()
    return () => {
      this.props.topoActions.changeActiveState(id)
      this.props.topoActions.fetchCities(this.props.activeCountry, id).then(() => {
        console.log(this.getZoomBounds(state, path))
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

    let transform = ''
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
    }

    return (
      <svg
        className='analysis-by-location'
        width={this.props.width}
        height={this.props.height}>
        {countries.map((country, i) => {
          return (
            <path key={i} d={path(country)} className="country"
              style={{transform:transform}}
              onClick={this.selectCountry(country, path)}/>
          )
        })}
        {states ? states.map((state, i) => {
          return (
            <path key={i} d={path(state)}
              className={'country' + (this.state.statesHidden ? ' hidden' : '')}
              style={{transform:transform}}
              onClick={this.selectState(state, path)}/>
          )
        }) : null}
      </svg>
    )
  }
}

AnalysisByTime.displayName = 'AnalysisByTime'
AnalysisByTime.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisByTime);
