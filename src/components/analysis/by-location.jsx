import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import {FormattedMessage} from 'react-intl'

import * as topoActionCreators from '../../redux/modules/topo'

import Mapbox from '../map/mapbox';

import * as countriesGeoJSON from '../../assets/topo/custom.geo.json';

class AnalysisByLocation extends React.Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    if(this.props.topoActions) {
      this.props.topoActions.startFetching()
      this.props.topoActions.fetchCountries()
    }
  }

  render() {
    if(!this.props.width || !this.props.countries || !this.props.countries.size
      || this.props.fetching || !this.props.countryData.size) {
      return <div><FormattedMessage id="portal.loading.text"/></div>
    }

    return (
      <div className={classNames(
        'analysis-by-location',
        { 'no-bg': this.props.noBg })}>
        <Mapbox
          geoData={countriesGeoJSON}
          countryData={this.props.countryData.toJS()}
          cityData={[]}
          theme={this.props.theme} />
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
  theme: React.PropTypes.string,
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
    fetching: state.topo.get('fetching'),
    theme: state.ui.get('theme')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    topoActions: bindActionCreators(topoActionCreators, dispatch)
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(AnalysisByLocation);
