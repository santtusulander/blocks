import React from 'react'
import moment from 'moment'
import Immutable from 'immutable'
import { Col, Row } from 'react-bootstrap'
import numeral from 'numeral'
import {FormattedMessage, injectIntl} from 'react-intl'

import SectionHeader from '../layout/section-header'
import SectionContainer from '../layout/section-container'
import AnalysisByTime from './by-time'
import AnalysisByLocation from './by-location'
import TableSorter from '../table-sorter'
import { formatBitsPerSecond } from '../../util/helpers'
import { paleblue, green } from '../../constants/colors'

class AnalysisTraffic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      byLocationWidth: 100,
      byTimeWidth: 100,
      sortBy: 'average_bits_per_second',
      sortDir: -1
    }

    this.measureContainers = this.measureContainers.bind(this)
    this.changeSort        = this.changeSort.bind(this)
    this.sortedData        = this.sortedData.bind(this)

    this.measureContainersTimeout = null
  }

  componentDidMount() {
    this.measureContainers()
    window.addEventListener('resize', this.measureContainers)
  }

  componentWillReceiveProps() {
    if (this.measureContainersTimeout) {
      clearTimeout(this.measureContainersTimeout)
    }

    // TODO: remove this timeout as part of UDNP-1426
    this.measureContainersTimeout = setTimeout(() => {this.measureContainers()}, 300)
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

  changeSort(column, direction) {
    this.setState({
      sortBy: column,
      sortDir: direction
    })
  }

  sortedData(data, sortBy, sortDir) {
    return data.sort((a, b) => {
      if(a.get(sortBy) < b.get(sortBy)) {
        return -1 * sortDir
      }
      else if(a.get(sortBy) > b.get(sortBy)) {
        return 1 * sortDir
      }
      return 0
    })
  }

  render() {
    const httpData    = this.props.serviceTypes.includes('http') ?
      this.props.byTime.filter(time => time.get('service_type') === 'http')
      : Immutable.List()
    const httpsData   = this.props.serviceTypes.includes('https') ?
      this.props.byTime.filter(time => time.get('service_type') === 'https')
      : Immutable.List()
    const dates = this.props.byTime.map(dataset => moment(dataset.get('timestamp'))).toJS()
    const minDate = moment.min(dates)
    const comparisonDates = this.props.byTimeComparison.map(dataset => moment(dataset.get('timestamp'))).toJS()
    const comparisonMinDate = moment.min(comparisonDates)
    const dateShift = minDate - comparisonMinDate
    const timespanAdjust = direction => time => time.set(
      'timestamp',
      new Date(time.get('timestamp').getTime() + dateShift * direction))
    const comparisonHttpData  = this.props.serviceTypes.includes('http') ?
      this.props.byTimeComparison
        .filter(time => time.get('service_type') === 'http')
        .map(timespanAdjust(1))
      : Immutable.List()
    const comparisonHttpsData = this.props.serviceTypes.includes('https') ?
      this.props.byTimeComparison
        .filter(time => time.get('service_type') === 'https')
        .map(timespanAdjust(1))
      : Immutable.List()
    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }
    const byTimeDataKey = this.props.recordType === 'transfer_rates' ?
      'bits_per_second' : 'requests'
    const byCountryDataKey = this.props.recordType === 'transfer_rates' ?
      'average_bits_per_second' : 'requests'
    const byTimeYAxisFormat = this.props.recordType === 'transfer_rates' ?
      (val, setMax) => formatBitsPerSecond(val, true, setMax) :
      (val) => numeral(val).format('0,0')
    const byCountryDataFormat = this.props.recordType === 'transfer_rates' ?
      val => formatBitsPerSecond(val, true) :
      val => numeral(val).format('0,0')
    const sortedCountries = this.sortedData(this.props.byCountry, this.state.sortBy, this.state.sortDir)

    const datasets = []
    if(this.props.serviceTypes.includes('http') && httpData.size) {
      datasets.push({
        area: true,
        color: paleblue,
        comparisonData: false,
        data: httpData.toJS(),
        id: 'http',
        label: this.props.intl.formatMessage({id: 'portal.analytics.trafficOverview.httpDatasetLabel.text'}),
        line: true,
        stackedAgainst: false,
        xAxisFormatter: false
      })
    }
    if(this.props.serviceTypes.includes('https') && httpsData.size){
      datasets.push({
        area: true,
        color: green,
        comparisonData: false,
        data: httpsData.toJS(),
        id: 'https',
        label: this.props.intl.formatMessage({id: 'portal.analytics.trafficOverview.httpsDatasetLabel.text'}),
        line: true,
        stackedAgainst: 'http',
        xAxisFormatter: false
      })
    }
    if(this.props.byTimeComparison.size) {
      if(this.props.serviceTypes.includes('http') && comparisonHttpData.size) {
        datasets.push({
          area: true,
          color: paleblue,
          comparisonData: true,
          data: comparisonHttpData.toJS(),
          id: 'httpComparison',
          label: this.props.intl.formatMessage({id: 'portal.analytics.trafficOverview.httpComparisonDatasetLabel.text'}),
          line: true,
          stackedAgainst: false,
          xAxisFormatter: (date) => moment.utc(timespanAdjust(-1)(date).get('timestamp'))
        })
      }
      if(this.props.serviceTypes.includes('https') && comparisonHttpsData.size) {
        datasets.push({
          area: true,
          color: green,
          comparisonData: true,
          data: comparisonHttpsData.toJS(),
          id: 'httpsComparison',
          label: this.props.intl.formatMessage({id: 'portal.analytics.trafficOverview.httpsComparisonDatasetLabel.text'}),
          line: true,
          stackedAgainst: 'httpComparison',
          xAxisFormatter: (date) => moment.utc(timespanAdjust(-1)(date).get('timestamp'))
        })
      }
    }
    return (
      <div className="analysis-traffic">
        <SectionHeader
          sectionHeaderTitle={this.props.recordType === 'transfer_rates'
            ? <FormattedMessage id="portal.analytics.trafficOverview.bandwidth.text"/>
            : <FormattedMessage id="portal.analytics.trafficOverview.requests.text"/>} />
        <SectionContainer className="analysis-data-box wide">
          <Row>
            <Col xs={4} className="right-separator">
              <h4><FormattedMessage id="portal.analytics.peak.text"/></h4>
              <p>{this.props.peakTraffic && this.props.peakTraffic}</p>
            </Col>
            <Col xs={4} className="right-separator">
              <h4><FormattedMessage id="portal.analytics.average.text"/></h4>
              <p>{this.props.avgTraffic && this.props.avgTraffic}</p>
            </Col>
            <Col xs={4}>
              <h4><FormattedMessage id="portal.analytics.low.text"/></h4>
              <p>{this.props.lowTraffic && this.props.lowTraffic}</p>
            </Col>
          </Row>
        </SectionContainer>
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.analytics.trafficOverview.transferByTime.text"/>} />
        <SectionContainer>
          <div ref="byTimeHolder">
            {this.props.fetching ?
              <div><FormattedMessage id="portal.loading.text"/></div> :
              <AnalysisByTime
                axes={true}
                padding={40}
                dataKey={byTimeDataKey}
                dataSets={datasets}
                showLegend={true}
                showTooltip={false}
                yAxisCustomFormat={byTimeYAxisFormat}
                width={this.state.byTimeWidth}
                height={this.state.byTimeWidth / 2.5}/>
            }
          </div>
        </SectionContainer>
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.analytics.trafficOverview.byGeography.text"/>} />
        <SectionContainer>
          <div ref="byLocationHolder">
            {this.props.fetching ?
              <div><FormattedMessage id="portal.loading.text"/></div> :
              <AnalysisByLocation
                countryData={this.props.byCountry}
                cityData={this.props.byCity}
                getCityData={this.props.getCityData}
                theme={this.props.theme}
                height={this.state.byTimeWidth / 2}
                mapBounds={this.props.mapBounds}
                mapboxActions={this.props.mapboxActions}
                dataKey={byCountryDataKey}
                dataKeyFormat={byCountryDataFormat}
                />
            }
          </div>
        </SectionContainer>
        <SectionHeader
          sectionHeaderTitle={<FormattedMessage id="portal.analytics.trafficOverview.byCountry.text"/>} />
        <SectionContainer>
          {!sortedCountries.size
           ? <h4><FormattedMessage id="portal.common.no-data.text" /></h4>
           : <table className="table table-striped table-analysis">
              <thead>
              <tr>
                <TableSorter {...sorterProps} column="name">
                  <FormattedMessage id="portal.analytics.trafficOverview.byCountry.country.header"/>
                </TableSorter>
                <TableSorter {...sorterProps} column={byCountryDataKey}>
                  {this.props.recordType === 'transfer_rates' ? <FormattedMessage id="portal.analytics.trafficOverview.byCountry.bandwidth.header"/> : <FormattedMessage id="portal.analytics.trafficOverview.byCountry.request.header"/>}
                </TableSorter>
                <th className="text-center"><FormattedMessage id="portal.analytics.trafficOverview.byCountry.periodTrend.header"/></th>
              </tr>
              </thead>
              <tbody>
              {!this.props.fetching ? sortedCountries.map((country, i) => {
                const primaryData = country.get('detail').map(datapoint => {
                  return datapoint.set(
                    'timestamp',
                    moment(datapoint.get('timestamp'), 'X').toDate()
                  )
                })
                const datasets = []
                if(primaryData.size) {
                  datasets.push({
                    area: false,
                    color: paleblue,
                    comparisonData: false,
                    data: primaryData.toJS(),
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
                    <td>{byCountryDataFormat(country.get(byCountryDataKey))}</td>
                    <td width={this.state.byTimeWidth / 2}>
                      <AnalysisByTime
                        axes={false}
                        padding={0}
                        dataKey={byTimeDataKey}
                        dataSets={datasets}
                        showTooltip={true}
                        yAxisCustomFormat={byTimeYAxisFormat}
                        width={this.state.byTimeWidth / 2}
                        height={50}/>
                    </td>
                  </tr>
                )
              }) : <tr>
                <td colSpan="3"><FormattedMessage id="portal.loading.text"/></td>
              </tr>}
              </tbody>
            </table>
          }
        </SectionContainer>
      </div>
    )
  }
}

AnalysisTraffic.displayName = 'AnalysisTraffic'
AnalysisTraffic.propTypes   = {
  avgTraffic: React.PropTypes.string,
  byCity: React.PropTypes.instanceOf(Immutable.List),
  byCountry: React.PropTypes.instanceOf(Immutable.List),
  byTime: React.PropTypes.instanceOf(Immutable.List),
  byTimeComparison: React.PropTypes.instanceOf(Immutable.List),
  fetching: React.PropTypes.bool,
  getCityData: React.PropTypes.func,
  intl: React.PropTypes.object,
  lowTraffic: React.PropTypes.string,
  mapBounds: React.PropTypes.object,
  mapboxActions: React.PropTypes.object,
  peakTraffic: React.PropTypes.string,
  recordType: React.PropTypes.string,
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  theme: React.PropTypes.string
}

AnalysisTraffic.defaultProps = {
  byCity: Immutable.List(),
  byCountry: Immutable.List(),
  byTime: Immutable.List(),
  byTimeComparison: Immutable.List(),
  serviceTypes: Immutable.List()
}

module.exports = injectIntl(AnalysisTraffic)
