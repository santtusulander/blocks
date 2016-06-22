import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'

import { Breadcrumbs } from '../../components/breadcrumbs.jsx'

function getNameById( list, id ) {
  const foundItem = list.find( (item) => {
    return item.get('id').toString() === id.toString()
  })

  if (foundItem) return foundItem.get('name')

  return null
}

class AnalyticsContainer2 extends React.Component {
  constructor(props){
    super(props)
  }

  render(){

    let breadCrumbLinks = []

    if (this.props.params.brand) breadCrumbLinks.push({label: getNameById(this.props.brands, this.props.params.brand), url: `/v2-analytics/${this.props.params.brand}`})
    if (this.props.params.account) breadCrumbLinks.push({label: getNameById(this.props.accounts, this.props.params.account), url: `/v2-analytics/${this.props.params.brand}/${this.props.params.account}`})
    if (this.props.params.group) breadCrumbLinks.push({label: getNameById(this.props.groups, this.props.params.group), url: `/v2-analytics/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}`})
    if (this.props.params.property) breadCrumbLinks.push({label: this.props.params.property, url: ''})

    return (
      <div>
        <Breadcrumbs links={breadCrumbLinks} />

        {this.props.children}

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    brands: Immutable.fromJS([{id: "udn", name: "UDN"}]),
    accounts: state.account.get('allAccounts'),
    groups: state.group.get('allGroups'),
    properties: state.host.get('allHosts')
  }
}

/*function mapDispatchToProps(dispatch, ownProps) {
  return {
    visitorsActions: bindActionCreators(visitorsActionCreators, dispatch)
  }
}*/

export default connect(mapStateToProps)(AnalyticsContainer2);
