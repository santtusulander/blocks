import React from 'react'
import numeral from 'numeral'
import Immutable from 'immutable'
import moment from 'moment'
import {FormattedMessage, injectIntl} from 'react-intl'

import SectionHeader from '../layout/section-header'
import SectionContainer from '../layout/section-container'
import AnalysisByTime from './by-time'
import AnalysisByLocation from './by-location'
import TableSorter from '../table-sorter'
import { paleblue } from '../../constants/colors'


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

    this.measureContainersTimeout = null
  }
  componentDidMount() {
    this.measureContainers()
    // TODO: remove this timeout as part of UDNP-1426
    this.measureContainersTimeout = setTimeout(() => {
      this.measureContainers()
    }, 500)
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
    clearTimeout(this.measureContainersTimeout)
  }
  measureContainers() {
    this.setState({
      byLocationWidth: this.refs.byLocationHolder && this.refs.byLocationHolder.clientWidth,
      byTimeWidth: this.refs.byTimeHolder && this.refs.byTimeHolder.clientWidth
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
    if (trending > 1) {
      trending = numeral((trending - 1) * -1).format('0%')
    } else {
      trending = numeral(trending).format('+0%');
    }
    return trending
  }
  sortedData(data, sortBy, sortDir, sortType) {
    let sortFunc = ''
    if ((sortType === 'country' && this.state.sortCountryFunc === 'trending') ||
      (sortType === 'browser' && this.state.sortBrowserFunc === 'trending') ||
      (sortType === 'os' && this.state.sortOSFunc === 'trending')) {
      sortFunc = data.sort((a, b) => {
        if (this.getTrending(a) < this.getTrending(b)) {
          return -1 * sortDir
        } else if (this.getTrending(a) > this.getTrending(b)) {
          return 1 * sortDir
        }
        return 0
      })
    } else {
      sortFunc = data.sort((a, b) => {
        const _a = typeof a.get(sortBy) === 'string' ? a.get(sortBy).toLowerCase() : a.get(sortBy)
        const _b = typeof b.get(sortBy) === 'string' ? b.get(sortBy).toLowerCase() : b.get(sortBy)
        if (_a < _b) {
          return -1 * sortDir
        } else if (_a > _b) {
          return 1 * sortDir
        }
        return 0
      })
    }
    return sortFunc
  }
  render() {
    const countrySorterProps = {
      activateSort: this.changeCountrySort,
      activeColumn: this.state.sortCountryBy,
      activeDirection: this.state.sortCountryDir
    }
    const sortedCountries = !this.props.fetching ? this.sortedData(this.props.byCountry, this.state.sortCountryBy, this.state.sortCountryDir, 'country') : ''
    const browserSorterProps = {
      activateSort: this.changeBrowserSort,
      activeColumn: this.state.sortBrowserBy,
      activeDirection: this.state.sortBrowserDir
    }
    const sortedBrowsers = !this.props.fetching ? this.sortedData(this.props.byBrowser, this.state.sortBrowserBy, this.state.sortBrowserDir, 'browser') : ''
    const OSSorterProps = {
      activateSort: this.changeOSSort,
      activeColumn: this.state.sortOSBy,
      activeDirection: this.state.sortOSDir
    }
    const sortedOS = !this.props.fetching ? this.sortedData(this.props.byOS, this.state.sortOSBy, this.state.sortOSDir, 'os') : ''
    const datasets = []
    if (this.props.byTime.size) {
      datasets.push({
        area: false,
        color: paleblue,
        comparisonData: false,
        data: this.props.byTime.toJS(),
        id: '',
        label: this.props.intl.formatMessage({id: 'portal.analytics.visitors.chart.visitors.label'}),
        line: true,
        stackedAgainst: false,
        xAxisFormatter: false
      })
    }
    return (
      <div className="analysis-traffic">
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.analytics.visitors.visiorsByTime.text"/>} />
        <SectionContainer>
          <div ref="byTimeHolder" className="visitors-by-time">
            {this.props.fetching ?
              <div><FormattedMessage id="portal.loading.text"/></div> :
              <AnalysisByTime
                axes={true}
                padding={40}
                dataKey="uniq_vis"
                dataSets={datasets}
                showLegend={true}
                showTooltip={false}
                width={this.state.byTimeWidth} height={this.state.byTimeWidth / 3}/>
              }
          </div>
        </SectionContainer>

        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.analytics.visitors.byGeography.text"/>} />
        <SectionContainer>
          <div ref="byLocationHolder">
            <AnalysisByLocation
              countryData={this.props.byCountry}
              cityData={this.props.byCity}
              getCityData={this.props.getCityData}
              theme={this.props.theme}
              height={this.state.byTimeWidth / 2}
              mapBounds={this.props.mapBounds}
              mapboxActions={this.props.mapboxActions}
              dataKey="total"
              dataKeyFormat={val => numeral(val).format('0,0')}/>
          </div>
        </SectionContainer>

        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.analytics.visitors.byCountry.text"/>} />
        <SectionContainer>
          {sortedCountries.size ?
            <table className="table table-striped table-analysis">
              <thead>
                <tr>
                  <TableSorter {...countrySorterProps} column="name">
                    Country
                  </TableSorter>
                  <TableSorter {...countrySorterProps} column="total">
                    Total Visitors
                  </TableSorter>
                  <TableSorter {...countrySorterProps} column="percent_total">
                    % of Visitors
                  </TableSorter>
                  <th className="text-center">Period Trend</th>
                  {/* Hide in 0.8 UDNP-1109
                  <TableSorter {...countrySorterProps} column="change" sortFunc="trending">
                    Change
                  </TableSorter>
                  */}
                </tr>
              </thead>
              <tbody>
                {this.props.fetching ?
                  <tr><td colSpan="5"><FormattedMessage id="portal.loading.text"/></td></tr> :
                  sortedCountries.map((country, i) => {
                    const countryData = country.get('detail').map(datapoint => {
                      return datapoint.set(
                        'timestamp',
                        moment(datapoint.get('timestamp'), 'X').toDate()
                      )
                    })
                    const datasets = []
                    if (countryData.size) {
                      datasets.push({
                        area: false,
                        color: paleblue,
                        comparisonData: false,
                        data: countryData.toJS(),
                        id: '',
                        label: '',
                        line: true,
                        stackedAgainst: false,
                        xAxisFormatter: false
                      })
                    }
                    return (
                      <tr key={i}>
                        <td>{country.get('name')}</td>
                        <td>{numeral(country.get('total')).format('0,0')}</td>
                        <td>{numeral(country.get('percent_total')).format('0,0.0%')}</td>
                        <td width={this.state.byTimeWidth / 3}>
                          <AnalysisByTime
                            axes={false}
                            padding={0}
                            area={false}
                            dataKey='uniq_vis'
                            dataSets={datasets}
                            width={this.state.byTimeWidth / 3}
                            height={50} />
                        </td>
                        {/* Hide in 0.8 UDNP-1109
                        <td>{this.getTrending(country)}</td>
                        */}
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          :
            <h4><FormattedMessage id="portal.common.no-data.text" /></h4>
          }
        </SectionContainer>

        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.analytics.visitors.byBrowser.text"/>} />
        <SectionContainer>
          {sortedBrowsers.size ?
            <table className="table table-striped table-analysis by-browser-table">
              <thead>
                <tr>
                  <TableSorter {...browserSorterProps} column="name">
                    <FormattedMessage id="portal.analytics.visitors.grid.browser.header"/>
                  </TableSorter>
                  <TableSorter {...browserSorterProps} column="total">
                    <FormattedMessage id="portal.analytics.visitors.grid.totalVisitors.header"/>
                  </TableSorter>
                  <TableSorter {...browserSorterProps} column="percent_total">
                    <FormattedMessage id="portal.analytics.visitors.grid.percentage.header"/>
                  </TableSorter>
                  <th className="text-center"><FormattedMessage id="portal.analytics.visitors.grid.periodTrend.header"/></th>
                    {/* Hide in 0.8 UDNP-1109
                    <TableSorter {...browserSorterProps} column="change" sortFunc="trending">
                      Change
                    </TableSorter>
                    */}
                </tr>
              </thead>
              <tbody>
                {this.props.fetching ?
                  <tr><td colSpan="5"><FormattedMessage id="portal.loading.text"/></td></tr> :
                  sortedBrowsers.map((browser, i) => {
                    const browserData = browser.get('detail').map(datapoint => {
                      return datapoint.set(
                        'timestamp',
                        moment(datapoint.get('timestamp'), 'X').toDate()
                      )
                    })
                    const datasets = []
                    if (browserData.size) {
                      datasets.push({
                        area: false,
                        color: paleblue,
                        comparisonData: false,
                        data: browserData.toJS(),
                        id: '',
                        label: '',
                        line: true,
                        stackedAgainst: false,
                        xAxisFormatter: false
                      })
                    }
                    return (
                      <tr key={i}>
                        <td>{browser.get('name')}</td>
                        <td>{numeral(browser.get('total')).format('0,0')}</td>
                        <td>{numeral(browser.get('percent_total')).format('0,0.0%')}</td>
                        <td width={this.state.byTimeWidth / 3}>
                          <AnalysisByTime
                            axes={false}
                            padding={0}
                            area={false}
                            dataKey='uniq_vis'
                            dataSets={datasets}
                            width={this.state.byTimeWidth / 3}
                            height={50} />
                        </td>
                        {/* Hide in 0.8 UDNP-1109
                        <td>{this.getTrending(browser)}</td>
                        */}
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          :
            <h4><FormattedMessage id="portal.common.no-data.text" /></h4>
          }
        </SectionContainer>

        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.analytics.visitors.byOS.text"/>} />
        <SectionContainer>
          {sortedOS.size ?
            <table className="table table-striped table-analysis by-os-table">
              <thead>
                <tr>
                  <TableSorter {...OSSorterProps} column="name">
                    <FormattedMessage id="portal.analytics.visitors.grid.os.header"/>
                  </TableSorter>
                  <TableSorter {...OSSorterProps} column="total">
                    <FormattedMessage id="portal.analytics.visitors.grid.totalVisitors.header"/>
                  </TableSorter>
                  <TableSorter {...OSSorterProps} column="percent_total">
                    % of Visitors
                  </TableSorter>
                  <th className="text-center">Period Trend</th>
                    {/* Hide in 0.8 UDNP-1109
                    <TableSorter {...OSSorterProps} column="change" sortFunc="trending">
                      Change
                    </TableSorter>
                    */}
                </tr>
              </thead>
              <tbody>
                {this.props.fetching ?
                  <tr><td colSpan="5"><FormattedMessage id="portal.loading.text"/></td></tr> :
                  sortedOS.map((os, i) => {
                    const osData = os.get('detail').map(datapoint => {
                      return datapoint.set(
                        'timestamp',
                        moment(datapoint.get('timestamp'), 'X').toDate()
                      )
                    })
                    const datasets = []
                    if (osData.size) {
                      datasets.push({
                        area: false,
                        color: paleblue,
                        comparisonData: false,
                        data: osData.toJS(),
                        id: '',
                        label: '',
                        line: true,
                        stackedAgainst: false,
                        xAxisFormatter: false
                      })
                    }
                    return (
                      <tr key={i}>
                        <td>{os.get('name')}</td>
                        <td>{numeral(os.get('total')).format('0,0')}</td>
                        <td>{numeral(os.get('percent_total')).format('0,0.0%')}</td>
                        <td width={this.state.byTimeWidth / 3}>
                          <AnalysisByTime
                            axes={false}
                            padding={0}
                            area={false}
                            dataKey='uniq_vis'
                            dataSets={datasets}
                            width={this.state.byTimeWidth / 3}
                            height={50} />
                        </td>
                        {/* Hide in 0.8 UDNP-1109
                        <td>{this.getTrending(os)}</td>
                        */}
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          :
            <h4><FormattedMessage id="portal.common.no-data.text" /></h4>
          }
        </SectionContainer>
      </div>
    )
  }
}

AnalysisVisitors.displayName = 'AnalysisVisitors'
AnalysisVisitors.propTypes = {
  byBrowser: React.PropTypes.instanceOf(Immutable.List),
  byCity: React.PropTypes.instanceOf(Immutable.List),
  byCountry: React.PropTypes.instanceOf(Immutable.List),
  byOS: React.PropTypes.instanceOf(Immutable.List),
  byTime: React.PropTypes.instanceOf(Immutable.List),
  fetching: React.PropTypes.bool,
  getCityData: React.PropTypes.func,
  intl: React.PropTypes.object,
  mapBounds: React.PropTypes.object,
  mapboxActions: React.PropTypes.object,
  theme: React.PropTypes.string
}

AnalysisVisitors.defaultProps = {
  byBrowser: Immutable.List(),
  byCity: Immutable.List(),
  byCountry: Immutable.List(),
  byOS: Immutable.List(),
  byTime: Immutable.List(),
  serviceTypes: Immutable.List()
}

export default injectIntl(AnalysisVisitors)
