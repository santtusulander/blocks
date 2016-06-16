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

  componentDidMount() {
    console.log("AnalyticsTabTraffic - componentDidMount()")

    this.fetchData()
  }

  componentDidUpdate(prevProps){
    const params = this.props.params
    const prevParams = prevProps.params

    if ( !(params.brand === prevParams.brand &&
      params.account === prevParams.account &&
      params.group === prevParams.group &&
      params.property === prevParams.property )) {

      this.fetchData()

    }

  }

  fetchData(){
    const endDate = moment().utc().endOf('day')
    const startDate = moment().utc().startOf('month')

    const fetchOpts = {
      account: this.props.params.account,
      brand: this.props.params.brand,
      group: this.props.params.group,
      host: this.props.params.property,

      startDate: startDate.format('X'),
      endDate: endDate.format('X')
    }

    const onOffOpts = Object.assign({}, fetchOpts)
    onOffOpts.granularity = 'day'

    const onOffTodayOpts = Object.assign({}, onOffOpts)
    onOffTodayOpts.startDate = moment().utc().startOf('day').format('X'),
    onOffTodayOpts.endDate = moment().utc().format('X')

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
    const metrics = this.props.metrics

    const peakTraffic = metrics.has('transfer_rates') ?
      metrics.get('transfer_rates').get('peak') : '0.0 Gbps'
    const avgTraffic = metrics.has('transfer_rates') ?
      metrics.get('transfer_rates').get('average') : '0.0 Gbps'
    const lowTraffic = metrics.has('transfer_rates') ?
      metrics.get('transfer_rates').get('lowest') : '0.0 Gbps'


    return (
      <div>
        <AnalysisTraffic
          avgTraffic={avgTraffic}
          byCountry={this.props.trafficByCountry}
          byTime={this.props.trafficByTime}
          dateRange={'-date range-'}
          fetching={false}
          lowTraffic={lowTraffic}
          peakTraffic={peakTraffic}
          serviceTypes={Immutable.fromJS(['http', 'https'])}
          totalEgress={this.props.totalEgress}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    metrics: Immutable.List(),
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
