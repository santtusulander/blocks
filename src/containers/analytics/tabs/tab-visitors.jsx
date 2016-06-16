import React from 'react'
import Immutable from 'immutable'

import AnalysisVisitors from '../../../components/analysis/visitors.jsx'

class AnalyticsTabVisitors extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    console.log("AnalyticsTabVisitors - componentDidMount()")
    console.log(this.props.params);
  }

  render() {
    return (
      <div>
        <AnalysisVisitors
          byBrowser={Immutable.List()}
          byCountry={Immutable.List()}
          byOS={Immutable.List()}
          byTime={Immutable.List()}
          fetching={false}
          serviceTypes={Immutable.List()}
        />
      </div>
    )
  }
}

export default AnalyticsTabVisitors
