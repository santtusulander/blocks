import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import AnalysisVisitors from '../../../components/analysis/visitors.jsx'
import * as visitorsActionCreators from '../../../redux/modules/visitors'

class AnalyticsTabVisitors extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    console.log("AnalyticsTabVisitors - componentDidMount()")
    console.log(this.props.params);

    this.fetchData()

  }

  componentDidUpdate(prevProps){
    const params = this.props.params
    const prevParams = prevProps.params

    if ( !(params.brand === prevParams.brand &&
      params.account === prevParams.account &&
      params.group === prevParams.group &&
      params.property === prevParams.property &&

      this.props.filters === prevProps.filters )) {

      this.fetchData()

    }
  }

  fetchData(){
    const endDate = this.props.filters.get('dateRange').endDate || moment().utc().endOf('day')
    const startDate = this.props.filters.get('dateRange').startDate || moment().utc().startOf('month')

    const fetchOpts = {
      account: this.props.params.account,
      brand: this.props.params.brand,
      group: this.props.params.group,
      host: this.props.params.property,

      startDate: startDate.format('X'),
      endDate: endDate.format('X')
    }

    this.props.visitorsActions.fetchByBrowser(fetchOpts)
    this.props.visitorsActions.fetchByCountry(fetchOpts)
    this.props.visitorsActions.fetchByTime(fetchOpts)
    this.props.visitorsActions.fetchByOS(fetchOpts)

  }

  render() {
    return (
      <div>
        <AnalysisVisitors
          byBrowser={this.props.byBrowser.get('browsers')}
          byCountry={this.props.byCountry.get('countries')}
          byOS={this.props.byOS.get('os')}
          byTime={this.props.byTime}
          fetching={this.props.fetching}
          serviceTypes={Immutable.fromJS(['http', 'https'])}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    metrics: Immutable.List(),
    byBrowser: state.visitors.get('byBrowser'),
    byCountry: state.visitors.get('byCountry'),
    byOS: state.visitors.get('byOS'),
    byTime: state.visitors.get('byTime'),
    fetching: state.visitors.get('fetching')
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    visitorsActions: bindActionCreators(visitorsActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabVisitors);

