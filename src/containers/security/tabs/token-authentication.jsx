import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import * as propertyActionCreators from '../../../redux/modules/properties/actions'
import {getProperties, isFetching} from '../../../redux/modules/properties/selectors'

import {actionIsTokenAuth, parsePolicy} from '../../../util/policy-config'

class TabTokenAuthentication extends Component {
  componentDidMount(){
    this.fetchData()
  }

  shouldComponentUpdate(){
    return true
  }

  fetchData(){
    const {brand,account,group} = this.props.params
    this.props.fetchProperties(brand,account,group)
  }

  //Loop all hosts
    //loop all rules
      //has tokenAuth => return

  render(){
    const {properties} = this.props

    //const tokenAuth = properties.

    return (
      <div>
        <h1>
          Tab Token Authentication
        </h1>

        {this.props.isFetching && <span>fetching...</span>}

        <div>
          {JSON.stringify(this.props.properties)}
        </div>
      </div>
    )
  }
}

TabTokenAuthentication.propTypes = {

}

const mapStateToProps = (state) => {
  return {
    properties: getProperties(state),
    isFetching: isFetching(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  const propertyActions = bindActionCreators(propertyActionCreators, dispatch)

  const fetchProperties = (brand, account, group) => {
    propertyActions.startFetching()
    propertyActions.fetchAllWithDetails(brand,account,group)
  }

  return {
    propertyActions,
    fetchProperties
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TabTokenAuthentication))
