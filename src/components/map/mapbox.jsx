import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {getTheme} from '../../redux/modules/ui'
import {fetchCountries, getCountryTopo} from '../../redux/modules/topo'

import MapPoc from './poc'

class MapBox extends Component {
  constructor(props){
    super(props)
  }

  componentWillMount(){
    this.fetchData()
  }

  shouldComponentUpdate(){
    return true
  }

  fetchData(){
    this.props.getCountryTopo()
  }

  render(){
    const {geoData, theme} = this.props

    return (
      <MapPoc
        geoData={geoData}
        theme={theme}
      />
    )
  }


}

MapBox.propTypes = {
  geoData: PropTypes.object,
  getCountryTopo: PropTypes.func,
  theme: PropTypes.string
}

const mapStateToProps = (state) => {
  return {
    geoData: getCountryTopo(state),
    theme: getTheme(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCountryTopo: () => dispatch( fetchCountries() )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapBox)
