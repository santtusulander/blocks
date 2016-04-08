import React from 'react'
import numeral from 'numeral'
import Immutable from 'immutable'
import moment from 'moment'

import AnalysisByTime from './by-time'
import AnalysisByLocation from './by-location'

class AnalysisVisitors extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      byLocationWidth: 100,
      byTimeWidth: 100
    }

    this.measureContainers = this.measureContainers.bind(this)
  }
  componentDidMount() {
    this.measureContainers()
    setTimeout(() => {this.measureContainers()}, 500)
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
  }
  measureContainers() {
    this.setState({
      byLocationWidth: this.refs.byLocationHolder.clientWidth,
      byTimeWidth: this.refs.byTimeHolder.clientWidth
    })
  }
  render() {
    return (
      <div className="analysis-traffic">
        <h3>VISITORS BY TIME</h3>
        <div ref="byTimeHolder">
          {this.props.fetching ?
            <div>Loading...</div> :
            <AnalysisByTime axes={true} padding={40}
              dataKey="uniq_vis"
              primaryData={this.props.byTime.toJS()}
              width={this.state.byTimeWidth} height={this.state.byTimeWidth / 3}/>
            }
        </div>
        <h3>BY GEOGRAPHY</h3>
        <div ref="byLocationHolder">
          {this.props.fetching ?
            <div>Loading...</div> :
            <AnalysisByLocation
            timelineKey="detail"
            width={this.state.byLocationWidth}
            height={this.state.byLocationWidth / 1.6}
            countryData={this.props.byCountry}/>
          }
        </div>
        <h3>BY COUNTRY</h3>
        <table className="table table-striped table-analysis by-country-table">
          <thead>
            <tr>
              <th>Country</th>
              <th>Total Visitors</th>
              <th>% of Visitors</th>
              <th className="text-center">Period Trend</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {this.props.fetching ?
              <tr><td colSpan="5">Loading...</td></tr> :
              this.props.byCountry.map((country, i) => {
                const startVis = country.get('detail').first().get('uniq_vis') || 0
                const endVis = country.get('detail').last().get('uniq_vis') || 0
                let trending = endVis ? startVis / endVis : 0
                if(trending > 1) {
                  trending = numeral((trending - 1) * -1).format('0%')
                }
                else {
                  trending = numeral(trending).format('+0%');
                }
                return (
                  <tr key={i}>
                    <td>{country.get('name')}</td>
                    <td>{numeral(country.get('total')).format('0,0')}</td>
                    <td>{country.get('percent_total')}%</td>
                    <td width={this.state.byTimeWidth / 3}>
                      <AnalysisByTime axes={false} padding={0} area={false}
                        primaryData={country.get('detail').map(datapoint => {
                          return datapoint.set(
                            'timestamp',
                            moment(datapoint.get('timestamp'), 'X').toDate()
                          )
                        }).toJS()}
                        dataKey='uniq_vis'
                        width={this.state.byTimeWidth / 3}
                        height={50} />
                    </td>
                    <td>{trending}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <h3>BY BROWSER</h3>
        <table className="table table-striped table-analysis by-browser-table">
          <thead>
            <tr>
              <th>Browser</th>
              <th>Total Visitors</th>
              <th>% of Visitors</th>
              <th className="text-center">Period Trend</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {this.props.fetching ?
              <tr><td colSpan="5">Loading...</td></tr> :
              this.props.byBrowser.map((browser, i) => {
                const totalVis = browser.get('detail').reduce((total, visitors) => {
                  return total + (visitors.get('uniq_vis') || 0)
                }, 0)
                const startVis = browser.get('detail').first().get('uniq_vis') || 0
                const endVis = browser.get('detail').last().get('uniq_vis') || 0
                let trending = endVis ? startVis / endVis : 0
                if(trending > 1) {
                  trending = numeral((trending - 1) * -1).format('0%')
                }
                else {
                  trending = numeral(trending).format('+0%');
                }
                return (
                  <tr key={i}>
                    <td>{browser.get('name')}</td>
                    <td>{numeral(totalVis).format('0,0')}</td>
                    <td>{numeral(browser.get('percent_total') / 100).format('0,0.0%')}</td>
                    <td width={this.state.byTimeWidth / 3}>
                      <AnalysisByTime axes={false} padding={0} area={false}
                        primaryData={browser.get('detail').map(datapoint => {
                          return datapoint.set(
                            'timestamp',
                            moment(datapoint.get('timestamp'), 'X').toDate()
                          )
                        }).toJS()}
                        dataKey='uniq_vis'
                        width={this.state.byTimeWidth / 3}
                        height={50} />
                    </td>
                    <td>{trending}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <h3>BY OPERATING SYSTEM</h3>
        <table className="table table-striped table-analysis by-os-table">
          <thead>
            <tr>
              <th>Operating System</th>
              <th>Total Visitors</th>
              <th>% of Visitors</th>
              <th className="text-center">Period Trend</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {this.props.fetching ?
              <tr><td colSpan="5">Loading...</td></tr> :
              this.props.byOS.map((os, i) => {
                const totalVis = os.get('detail').reduce((total, visitors) => {
                  return total + (visitors.get('uniq_vis') || 0)
                }, 0)
                const startVis = os.get('detail').first().get('uniq_vis') || 0
                const endVis = os.get('detail').last().get('uniq_vis') || 0
                let trending = endVis ? startVis / endVis : 0
                if(trending > 1) {
                  trending = numeral((trending - 1) * -1).format('0%')
                }
                else {
                  trending = numeral(trending).format('+0%');
                }
                return (
                  <tr key={i}>
                    <td>{os.get('name')}</td>
                    <td>{numeral(totalVis).format('0,0')}</td>
                    <td>{numeral(os.get('percent_total') / 100).format('0,0.0%')}</td>
                    <td width={this.state.byTimeWidth / 3}>
                      <AnalysisByTime axes={false} padding={0} area={false}
                        primaryData={os.get('detail').map(datapoint => {
                          return datapoint.set(
                            'timestamp',
                            moment(datapoint.get('timestamp'), 'X').toDate()
                          )
                        }).toJS()}
                        dataKey='uniq_vis'
                        width={this.state.byTimeWidth / 3}
                        height={50} />
                    </td>
                    <td>{trending}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}

AnalysisVisitors.displayName = 'AnalysisVisitors'
AnalysisVisitors.propTypes = {
  byBrowser: React.PropTypes.instanceOf(Immutable.List),
  byCountry: React.PropTypes.instanceOf(Immutable.List),
  byOS: React.PropTypes.instanceOf(Immutable.List),
  byTime: React.PropTypes.instanceOf(Immutable.List),
  fetching: React.PropTypes.bool,
  serviceTypes: React.PropTypes.instanceOf(Immutable.List)
}

module.exports = AnalysisVisitors
