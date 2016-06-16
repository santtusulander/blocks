import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import AnalysisTraffic from '../../../components/analysis/traffic.jsx'

import * as trafficActionCreators from '../../../redux/modules/traffic'

class AnalyticsTabTraffic extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    console.log("AnalyticsTabTraffic - componentDidMount()")

    const endDate = moment().utc().endOf('day')
    const startDate = moment().utc().startOf('month')


    const fetchOpts = Object.assign({
      account: this.props.params.account,
      brand: this.props.params.brand,
      group: this.props.params.group,
      host: this.props.params.property,

      startDate: startDate.format('X'),
      endDate: endDate.format('X')
    })



    const onOffOpts = {}
    const onOffTodayOpts = {}

    this.props.trafficActions.fetchByTime(fetchOpts)
    this.props.trafficActions.fetchByCountry(fetchOpts)
    this.props.trafficActions.fetchTotalEgress(fetchOpts)

    /*this.props.trafficActions.fetchOnOffNet(onOffOpts),
    this.props.trafficActions.fetchOnOffNetToday(onOffTodayOpts),
    this.props.trafficActions.fetchServiceProviders(onOffOpts),
    this.props.trafficActions.fetchStorage()
    */
  }

  render(){
    return (
      <div>
        <p>Traffic tab contents</p>

        <AnalysisTraffic
          avgTraffic={'avg traffic'}
          byCountry={this.props.trafficByCountry}
          byTime={this.props.trafficByTime}
          dateRange={'-date range-'}
          fetching={false}
          lowTraffic={'-low-'}
          peakTraffic={'-peak-'}
          serviceTypes={Immutable.fromJS(['http', 'https'])}
          totalEgress={this.props.totalEgress}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    trafficByTime: state.traffic.get('byTime'),
    trafficByCountry: state.traffic.get('byCountry'),
    totalEgress: state.traffic.get('totalEgress'),
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    trafficActions: bindActionCreators(trafficActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabTraffic);
