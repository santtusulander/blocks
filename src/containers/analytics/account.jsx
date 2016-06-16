import React from 'react'

import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Link } from 'react-router'
import * as groupActionCreators from '../../redux/modules/group'

class AnalyticsAccount extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    console.log("Account: componentDidMount()");
    this.props.groupActions.fetchGroups(this.props.params.brand, this.props.params.account);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.params.brand !== this.props.params.brand ||
      nextProps.params.account !== this.props.params.account ) {
      this.props.groupActions.fetchGroups(nextProps.params.brand, nextProps.params.account);
    }
  }

  render(){
    return (
      <div>
        <h1>AnalyticsAccount</h1>

        { this.props.children}

        <h3>GROUPS</h3>
      {
        this.props.groups.map( group => {
          return (
            <p>
              <Link to={`/v2-analytics/${this.props.params.brand}/${this.props.params.account}/${group.get('id')}`}>
              {group.get('name')}
              </Link>
            </p>
          )
        })
        }

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    groups: state.group.get('allGroups'),
    activeGroup: state.group.get('activeGroup')
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    groupActions: bindActionCreators(groupActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsAccount);
