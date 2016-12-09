import React from 'react'
import d3 from 'd3'
import numeral from 'numeral'
import * as topojson from 'topojson'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import {FormattedMessage} from 'react-intl'

import * as topoActionCreators from '../../redux/modules/topo'
import Tooltip from '../tooltip'

class AnalysisByLocation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      zoom: null,
      statesHidden: true,
      citiesHidden: true,
      tooltipCountry: null,
      tooltipPercent: 0,
      tooltipX: 0,
      tooltipY: 0
    }

    // this.selectCountry = this.selectCountry.bind(this)
    // this.selectState = this.selectState.bind(this)
    // this.zoomOut = this.zoomOut.bind(this)
  }
  componentWillMount() {
    if(this.props.topoActions) {
      this.props.topoActions.startFetching()
      this.props.topoActions.fetchCountries()
    }
  }
  // selectCountry(country, path) {
  //   const id = country.id.toLowerCase()
  //   return () => {
  //     this.setState({
  //       statesHidden: true,
  //       citiesHidden: true
  //     })
  //     this.props.topoActions.changeActiveCountry(id)
  //     this.props.topoActions.fetchStates(id).then((action) => {
  //       this.setState({zoom: this.getZoomBounds(country, path)})
  //       if(action.error) {
  //         return false;
  //       }
  //       setTimeout(() => {
  //         this.setState({statesHidden: false})
  //       }, 500)
  //     })
  //   }
  // }
  // selectState(state, path) {
  //   const name = state.properties.name
  //   return () => {
  //     this.setState({citiesHidden: true})
  //     this.props.topoActions.changeActiveState(name)
  //     this.props.topoActions.fetchCities(this.props.activeCountry).then((action) => {
  //       this.setState({zoom: this.getZoomBounds(state, path)})
  //       if(action.error) {
  //         return false;
  //       }
  //       setTimeout(() => {
  //         this.setState({citiesHidden: false})
  //       }, 500)
  //     })
  //   }
  // }
  // getZoomBounds(d, path) {
  //   const bounds = path.bounds(d)
  //   const w_scale = (bounds[1][0] - bounds[0][0]) / this.props.width
  //   const h_scale = (bounds[1][1] - bounds[0][1]) / this.props.height
  //   const z = 0.96 / Math.max(w_scale, h_scale)
  //   const x = (bounds[1][0] + bounds[0][0]) / 2
  //   const y = (bounds[1][1] + bounds[0][1]) / 2 + (this.props.height / z / 6)
  //   return [x, y, z]
  // }
  // zoomOut(path) {
  //   return (e) => {
  //     e.preventDefault()
  //     if(this.props.activeState) {
  //       this.props.topoActions.changeActiveState(null)
  //       const countries = topojson.feature(
  //         this.props.countries.toJS(),
  //         this.props.countries.toJS().objects.countries
  //       ).features
  //       const country = countries.find(
  //         data => data.id.toLowerCase() === this.props.activeCountry
  //       )
  //       this.setState({zoom: this.getZoomBounds(country, path)})
  //     }
  //     else if(this.props.activeCountry) {
  //       this.props.topoActions.changeActiveCountry(null)
  //       this.setState({zoom: null})
  //     }
  //   }
  // }
  moveMouse(country, percent) {
    return e => {
      const bounds = this.refs.chart.getBoundingClientRect()
      e.stopPropagation()
      this.setState({
        tooltipCountry: country,
        tooltipPercent: percent,
        tooltipX: e.pageX - bounds.left,
        tooltipY: e.pageY - (bounds.top + window.pageYOffset)
      })
    }
  }
  render() {
    if(!this.props.width || !this.props.countries || !this.props.countries.size
      || this.props.fetching || !this.props.countryData) {
      return <div><FormattedMessage id="portal.loading.text"/></div>
    }

    const projection = d3.geo.mercator().scale(this.props.width / 7)
      .translate([this.props.width / 2, this.props.height / 1.45])
    const path = d3.geo.path().projection(projection)
    const countries = topojson.feature(
      this.props.countries.toJS(),
      this.props.countries.toJS().objects.countries
    ).features

    // let states = null
    // if(this.props.states && this.props.states.size) {
    //   states = topojson.feature(
    //     this.props.states.toJS(),
    //     this.props.states.toJS().objects.states
    //   ).features
    // }
    //
    // let cities = null
    // if(this.props.cities && this.props.cities.size) {
    //   cities = topojson.feature(
    //     this.props.cities.toJS(),
    //     this.props.cities.toJS().objects.cities
    //   ).features.filter(d => {
    //     return this.props.activeState == d.properties.state
    //   })
    // }

    let transform = ''
    let strokeWidth = 1
    // if(this.state.zoom) {
    //   let projTranslate = projection.translate()
    //   transform = "translate(" +
    //   projTranslate[0] + 'px,' +
    //   projTranslate[1] +
    //   "px) scale(" +
    //   this.state.zoom[2] +
    //   ") translate(-" +
    //   this.state.zoom[0] +
    //   "px,-" +
    //   this.state.zoom[1] +
    //   "px)"
    //   strokeWidth = 1.0 / this.state.zoom[2] + "px"
    // }
    const pathStyle = {
      transform: transform,
      strokeWidth: strokeWidth
    }

    return (
      <div className={classNames(
        'analysis-by-location',
        { 'no-bg': this.props.noBg })}>
        <div className="chart" ref="chart">
          <svg
            viewBox={'0 0 ' + this.props.width + ' ' + this.props.height}
            width={this.props.width}
            height={this.props.height}
            onMouseMove={this.moveMouse(null, null)}
            onMouseLeave={this.moveMouse(null, null)}>
            {countries.map((country, i) => {
              // let hideCountry = false
              const id = country.id.toLowerCase()
              // if(!this.state.statesHidden &&
              //   this.props.activeCountry === id) {
              //   hideCountry = true
              // }
              const dataIndex = this.props.countryData.findIndex(
                data => data.get('code').toLowerCase() === id
              )
              let classes = `country country-${dataIndex}`
              // if(hideCountry) {
              //   classes += ' hiddenpath'
              // }
              let label = ''
              if(dataIndex >= 0 && this.props.countryData.get(dataIndex)) {
                label = this.props.tooltipCustomFormat ?
                  this.props.tooltipCustomFormat(
                    this.props.countryData.get(dataIndex).get(this.props.dataKey) || 0
                  ) : numeral(
                    this.props.countryData.get(dataIndex).get(this.props.dataKey) || 0
                  ).format('0,0')
              }
              return (
                <path key={i} d={path(country)}
                  onMouseMove={this.moveMouse(country.id, label)}
                  className={classes}
                  style={pathStyle}/>
              )
            })}
            {/*states ? states.map((state, i) => {
              const data = this.props.stateData.find(
                data => data.get('id') === state.properties.name
              )
              let classes = 'country'
              if(this.state.statesHidden) {
                classes += ' hiddenpath'
              }
              if(data) {
                classes += ' ' + getTrendClass(data)
              }
              return (
                <path key={i} d={path(state)}
                  className={classes}
                  style={pathStyle}
                  onClick={this.selectState(state, path)}/>
              )
            }) : null*/}
            {/*cities ? cities.map((city, i) => {
              const data = this.props.cityData.find(
                data => data.get('name') === city.properties.name && data.get('state') === city.properties.state
              )
              let classes = 'country'
              if(this.state.citiesHidden) {
                classes += ' hiddenpath'
              }
              if(data) {
                classes += ' ' + getTrendClass(data)
              }
              let zoomLevel = this.state.zoom ? this.state.zoom[2] : 1
              return (
                <path key={i} d={path.pointRadius(20 / zoomLevel)(city)}
                  className={classes}
                  style={pathStyle}/>
              )
            }) : null*/}
          </svg>
          {/*<div className="zoom-out">
            <a href="#" onClick={this.zoomOut(path)}
              title="Zoom Out"
              className={this.props.activeCountry || this.props.activeState ? '' : 'hidden'}>
              -
            </a>
          </div>*/}
        </div>
        <Tooltip x={this.state.tooltipX} y={this.state.tooltipY}
          hidden={!this.state.tooltipCountry}>
          {this.state.tooltipCountry} {this.state.tooltipPercent}
        </Tooltip>
      </div>
    )
  }
}

AnalysisByLocation.displayName = 'AnalysisByLocation'
AnalysisByLocation.propTypes = {
  // activeCountry: React.PropTypes.string,
  // activeState: React.PropTypes.string,
  // cities: React.PropTypes.instanceOf(Immutable.Map),
  // cityData: React.PropTypes.instanceOf(Immutable.List),
  countries: React.PropTypes.instanceOf(Immutable.Map),
  countryData: React.PropTypes.instanceOf(Immutable.List),
  dataKey: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  height: React.PropTypes.number,
  noBg: React.PropTypes.bool,
  // stateData: React.PropTypes.instanceOf(Immutable.List),
  // states: React.PropTypes.instanceOf(Immutable.Map),
  // timelineKey: React.PropTypes.string,
  tooltipCustomFormat: React.PropTypes.func,
  topoActions: React.PropTypes.object,
  width: React.PropTypes.number
}

AnalysisByLocation.defaultProps = {
  cities: Immutable.Map(),
  cityData: Immutable.List(),
  countries: Immutable.Map(),
  countryData: Immutable.List(),
  stateData: Immutable.List(),
  states: Immutable.Map()
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(AnalysisByLocation);
