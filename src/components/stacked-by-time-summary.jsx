import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import classnames from 'classnames'

import AnalysisByTime from './analysis/by-time'
import { paleblue, yellow } from '../constants/colors'

class StackedByTimeSummary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      byTimeWidth: 100
    }

    this.measureContainers = this.measureContainers.bind(this)
    this.measureContainersTimeout = null
  }

  componentDidMount() {
    this.measureContainers()
    this.measureContainersTimeout = setTimeout(() => {
      this.measureContainers()
    }, 500)
    window.addEventListener('resize', this.measureContainers)
  }

  componentWillReceiveProps() {
    this.measureContainers()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
    clearTimeout(this.measureContainersTimeout)
  }

  measureContainers() {
    this.setState({
      byTimeWidth: this.refs.byTimeHolder && this.refs.byTimeHolder.clientWidth
    })
  }

  render() {
    const {
      dataKey,
      datasetAArray,
      datasetALabel,
      datasetAUnit,
      datasetAValue,
      datasetBArray,
      datasetBLabel,
      datasetBUnit,
      datasetBValue,
      totalDatasetUnit,
      totalDatasetValue
    } = this.props

    const datasets = []
    datasets.push({
      area: true,
      color: paleblue,
      comparisonData: false,
      data: datasetAArray,
      id: 'datasetA',
      label: '',
      line: true,
      stackedAgainst: datasetBArray ? 'datasetB' : '',
      xAxisFormatter: false
    })

    if (datasetBArray) {
      datasets.push({
        area: true,
        color: yellow,
        comparisonData: false,
        data: datasetBArray,
        id: 'datasetB',
        label: '',
        line: true,
        stackedAgainst: false,
        xAxisFormatter: false
      })
    }
    const total = Number(totalDatasetValue)
    const dataSetBColClasses = classnames('dataset-col', { empty: !total })
    return (
      <div className="stacked-by-time-summary">
        <div className="dataset-label"><FormattedMessage id='portal.common.total.text'/></div>

        <div className="stacked-by-time-summary-container">
          {total > 0 ? [
            <div key={0} className="dataset-col total">
              <span className="value">{totalDatasetValue}</span>
              <span className="suffix">{totalDatasetUnit}</span>
            </div>,

            <div key={1} ref="byTimeHolder" className="dataset-col chart">
              <AnalysisByTime
                dataKey={dataKey}
                dataSets={datasets}
                className="bg-transparent"
                padding={2}
                width={this.state.byTimeWidth}
                height={72}
                showTooltip={false}
                showLegend={false}
                noHover={true}
                noXNice={true} />
            </div>
          ] : <div className="dataset-col chart">
              <div className="no-data by-time-summary">
                <FormattedMessage id="portal.common.no-data.text"/>
              </div>
            </div>}

          <div className="dataset-col">
            <div className="dataset-label dataset-a">{datasetALabel}</div>
            {total > 0 ? [
              <span key={0} className="value">{datasetAValue}</span>,
              datasetAUnit && <span key={1} className="suffix">{datasetAUnit}</span>
            ] : <div className="no-data by-time-summary">
                <FormattedMessage id="portal.common.no-data.text"/>
              </div>
            }
          </div>

          {datasetBArray &&
          <div className={dataSetBColClasses}>
            {datasetBLabel && <div className="dataset-label dataset-b">{datasetBLabel}</div>}
            {totalDatasetValue > 0 && [
              datasetBValue && <span key={0} className="value">{datasetBValue}</span>,
              datasetBUnit && <span key={1} className="suffix">{datasetBUnit}</span>
            ]}
          </div>
          }
        </div>
      </div>
    )
  }
}

StackedByTimeSummary.displayName = 'StackedByTimeSummary'
StackedByTimeSummary.propTypes = {
  dataKey: PropTypes.string,
  datasetAArray: PropTypes.array.isRequired,
  datasetALabel: PropTypes.string.isRequired,
  datasetAUnit: PropTypes.string,
  datasetAValue: PropTypes.string.isRequired,
  datasetBArray: PropTypes.array,
  datasetBLabel: PropTypes.string,
  datasetBUnit: PropTypes.string,
  datasetBValue: PropTypes.string,
  totalDatasetUnit: PropTypes.string.isRequired,
  totalDatasetValue: PropTypes.string.isRequired
}

module.exports = StackedByTimeSummary
