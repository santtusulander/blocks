import React from 'react'

import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Link } from 'react-router'

import * as groupActionCreators from '../../redux/modules/group'
import * as hostActionCreators from '../../redux/modules/host'


class AnalyticsGroup extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    console.log("Group: componentDidMount()");
    console.log("Group: FetchHosts()");

    this.props.propertyActions.fetchHosts(this.props.params.brand, this.props.params.account, this.props.params.group);
  }

  componentWillReceiveProps(nextProps) {
    if ( nextProps.params.brand !== this.props.params.brand ||
      nextProps.params.account !== this.props.params.account ||
      nextProps.params.group !== this.props.params.group  ) {
        this.props.propertyActions.fetchHosts(nextProps.params.brand, nextProps.params.account, nextProps.params.group);
    }
  }

  render(){
    return (
      <div>


        <h3>PROPERTIES (should be dropdown)</h3>

      {
        this.props.properties.map( property => {
          return (
            <p>
              <Link to={`/v2-analytics/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/${property}`}>
                {property}
              </Link>
            </p>
          )
        })
      }

        <h2>Analytics for Group</h2>
        { this.props.children }

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    properties: state.host.get('allHosts') || Immutable.List(),
    activeProperty: state.host.get('activeHost')
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    propertyActions: bindActionCreators(hostActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsGroup);
