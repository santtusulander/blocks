import React from 'react'
import numeral from 'numeral'
import Immutable from 'immutable'
import moment from 'moment'

import AnalysisByTime from './by-time'
import AnalysisByLocation from './by-location'
import TableSorter from '../table-sorter'

const DataSorter = ({column, children, reversed, sortFunc, changeSort, sortBy, sortDir}) => <TableSorter
    column={column}
    reversed={reversed}
    activateSort={changeSort}
    activeColumn={sortBy}
    sortFunc={sortFunc}
    activeDirection={sortDir}>
    {children}
  </TableSorter>
DataSorter.displayName = 'DataSorter'

class AnalysisVisitors extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      byLocationWidth: 100,
      byTimeWidth: 100,
      sortCountryBy: 'total',
      sortCountryDir: -1,
      sortBrowserBy: 'total',
      sortBrowserDir: -1,
      sortOSBy: 'total',
      sortOSDir: -1,
      sortCountryFunc: '',
      sortBrowserFunc: '',
      sortOSFunc: ''
    }

    this.measureContainers = this.measureContainers.bind(this)
    this.changeCountrySort = this.changeCountrySort.bind(this)
    this.changeBrowserSort = this.changeBrowserSort.bind(this)
    this.changeOSSort = this.changeOSSort.bind(this)
    this.sortedData = this.sortedData.bind(this)
    this.getTrending = this.getTrending.bind(this)
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
  changeCountrySort(column, direction, sortFunc) {
    this.setState({
      sortCountryBy: column,
      sortCountryDir: direction,
      sortCountryFunc: sortFunc
    })
  }
  changeBrowserSort(column, direction, sortFunc) {
    this.setState({
      sortBrowserBy: column,
      sortBrowserDir: direction,
      sortBrowserFunc: sortFunc
    })
  }
  changeOSSort(column, direction, sortFunc) {
    this.setState({
      sortOSBy: column,
      sortOSDir: direction,
      sortOSFunc: sortFunc
    })
  }
  getTrending(data) {
    const startVis = data.get('detail').first().get('uniq_vis') || 0
    const endVis = data.get('detail').last().get('uniq_vis') || 0
    let trending = endVis ? startVis / endVis : 0
    if(trending > 1) {
      trending = numeral((trending - 1) * -1).format('0%')
    }
    else {
      trending = numeral(trending).format('+0%');
    }
    return trending
  }
  sortedData(data, sortBy, sortDir, sortType) {
    let sortFunc = ''
    if((sortType === 'country' && this.state.sortCountryFunc === 'trending') ||
      (sortType === 'browser' && this.state.sortBrowserFunc === 'trending') ||
      (sortType === 'os' && this.state.sortOSFunc === 'trending')) {
      sortFunc = data.sort((a, b) => {
        if(this.getTrending(a) < this.getTrending(b)) {
          return -1 * sortDir
        }
        else if(this.getTrending(a) > this.getTrending(b)) {
          return 1 * sortDir
        }
        return 0
      })
    } else {
      sortFunc = data.sort((a, b) => {
        const _a = typeof a.get(sortBy) === 'string' ? a.get(sortBy).toLowerCase() : a.get(sortBy)
        const _b = typeof b.get(sortBy) === 'string' ? b.get(sortBy).toLowerCase() : b.get(sortBy)
        if(_a < _b) {
          return -1 * sortDir
        }
        else if(_a > _b) {
          return 1 * sortDir
        }
        return 0
      })
    }
    return sortFunc
  }
  render() {
    const sortedCountries = !this.props.fetching ? this.sortedData(this.props.byCountry, this.state.sortCountryBy, this.state.sortCountryDir, 'country') : ''
    const sortedBrowsers = !this.props.fetching ? this.sortedData(this.props.byBrowser, this.state.sortBrowserBy, this.state.sortBrowserDir, 'browser') : ''
    const sortedOS = !this.props.fetching ? this.sortedData(this.props.byOS, this.state.sortOSBy, this.state.sortOSDir, 'os') : ''
    return (
      <div className="analysis-traffic">
        <h3>VISITORS BY TIME</h3>
        <div ref="byTimeHolder">
          {this.props.fetching ?
            <div>Loading...</div> :
            <AnalysisByTime axes={true} padding={40}
              dataKey="uniq_vis"
              primaryData={this.props.byTime.toJS()}
              stacked={true}
              width={this.state.byTimeWidth} height={this.state.byTimeWidth / 3}/>
            }
        </div>
        <h3>BY GEOGRAPHY</h3>
        <div ref="byLocationHolder">
          {this.props.fetching ?
            <div>Loading...</div> :
            <AnalysisByLocation
            dataKey="total"
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
              <DataSorter column="name"
                changeSort={this.changeCountrySort}
                sortBy={this.state.sortCountryBy}
                sortDir={this.state.sortCountryDir}>
                Country
              </DataSorter>
              <DataSorter column="total"
                changeSort={this.changeCountrySort}
                sortBy={this.state.sortCountryBy}
                sortDir={this.state.sortCountryDir}>
                Total Visitors
              </DataSorter>
              <DataSorter column="percent_total"
                changeSort={this.changeCountrySort}
                sortBy={this.state.sortCountryBy}
                sortDir={this.state.sortCountryDir}>
                % of Visitors
              </DataSorter>
              <th className="text-center">Period Trend</th>
              <DataSorter column="change" sortFunc="trending"
                changeSort={this.changeCountrySort}
                sortBy={this.state.sortCountryBy}
                sortDir={this.state.sortCountryDir}>
                Change
              </DataSorter>
            </tr>
          </thead>
          <tbody>
            {this.props.fetching ?
              <tr><td colSpan="5">Loading...</td></tr> :
              sortedCountries.map((country, i) => {
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
                    <td>{this.getTrending(country)}</td>
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
              <DataSorter column="name"
                changeSort={this.changeBrowserSort}
                sortBy={this.state.sortBrowserBy}
                sortDir={this.state.sortBrowserDir}>
                Country
              </DataSorter>
              <DataSorter column="total"
                changeSort={this.changeBrowserSort}
                sortBy={this.state.sortBrowserBy}
                sortDir={this.state.sortBrowserDir}>
                Total Visitors
              </DataSorter>
              <DataSorter column="percent_total"
                changeSort={this.changeBrowserSort}
                sortBy={this.state.sortBrowserBy}
                sortDir={this.state.sortBrowserDir}>
                % of Visitors
              </DataSorter>
              <th className="text-center">Period Trend</th>
              <DataSorter column="change" sortFunc="trending"
                changeSort={this.changeBrowserSort}
                sortBy={this.state.sortBrowserBy}
                sortDir={this.state.sortBrowserDir}>
                Change
              </DataSorter>
            </tr>
          </thead>
          <tbody>
            {this.props.fetching ?
              <tr><td colSpan="5">Loading...</td></tr> :
              sortedBrowsers.map((browser, i) => {
                return (
                  <tr key={i}>
                    <td>{browser.get('name')}</td>
                    <td>{numeral(browser.get('total')).format('0,0')}</td>
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
                    <td>{this.getTrending(browser)}</td>
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
              <DataSorter column="name"
                changeSort={this.changeOSSort}
                sortBy={this.state.sortOSBy}
                sortDir={this.state.sortOSDir}>
                Operating System
              </DataSorter>
              <DataSorter column="total"
                changeSort={this.changeOSSort}
                sortBy={this.state.sortOSBy}
                sortDir={this.state.sortOSDir}>
                Total Visitors
              </DataSorter>
              <DataSorter column="percent_total"
                changeSort={this.changeOSSort}
                sortBy={this.state.sortOSBy}
                sortDir={this.state.sortOSDir}>
                % of Visitors
              </DataSorter>
              <th className="text-center">Period Trend</th>
              <DataSorter column="change" sortFunc="trending"
                changeSort={this.changeOSSort}
                sortBy={this.state.sortOSBy}
                sortDir={this.state.sortOSDir}>
                Change
              </DataSorter>
            </tr>
          </thead>
          <tbody>
            {this.props.fetching ?
              <tr><td colSpan="5">Loading...</td></tr> :
              sortedOS.map((os, i) => {
                return (
                  <tr key={i}>
                    <td>{os.get('name')}</td>
                    <td>{numeral(os.get('total')).format('0,0')}</td>
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
                    <td>{this.getTrending(os)}</td>
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
