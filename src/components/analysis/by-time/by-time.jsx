import React from 'react'
import d3 from 'd3'
import moment from 'moment'
import numeral from 'numeral'
import Immutable from 'immutable'
import { FormattedMessage } from 'react-intl'
import { formatDate } from '../../../util/helpers'
import Tooltip from '../../shared/tooltips/tooltip'
import Legend from './legend'
import TimeAxisLabels from '../time-axis-labels'

const closestDate = d3.bisector(d => d.timestamp).left

const getExtent = (datasets, key) => {
  const extents = datasets.map(
    dataset => d3.extent(dataset.data.map(
      data => data[key])))
  return [
    d3.min(extents.map(extent => extent[0])),
    d3.max(extents.map(extent => extent[1]))
  ]
}

const configureTooltip = (date, positionVal, height, width, formatY, xScale, yScale, actualVal, formatter) => {
  const formattedDate = formatDate(date, 'MMM D H:mm')
  const val = actualVal || 0
  const formattedValue = formatY(val)
  const text = formatter ?
    formatter(date, val) :
    `${formattedDate} ${formattedValue}`
  return {
    text: text,
    x: xScale(date),
    y: yScale(positionVal),
    top: yScale(positionVal) + 50 > height,
    left: xScale(date) > width/2
  }
}

class AnalysisByTime extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tooltipText: [],
      tooltipX: [],
      tooltipY: [],
      tooltipOffsetTop: [],
      tooltipOffsetLeft: [],
      labelWidth: []
    }

    this.moveMouse = this.moveMouse.bind(this)
    this.deactivateTooltip = this.deactivateTooltip.bind(this)

    this.formatY = this.formatY.bind(this)
  }

  moveMouse(xScale, yScale, datasets) {
    const configTooltip = (time, positionData, actualData, formatter) => configureTooltip(
      time,
      positionData,
      this.props.height,
      this.props.width,
      this.formatY,
      xScale,
      yScale,
      actualData,
      formatter
    )
    return e => {
      const sourceData = datasets.reduce((longest, dataset) => {
        if (dataset.data.length > longest.length) {
          return dataset.data
        }
        return longest
      }, [])
      const bounds = this.refs.chart.getBoundingClientRect()
      const xDate = xScale.invert(e.pageX - bounds.left)
      let i = closestDate(sourceData, xDate, 1)
      const d0 = sourceData[i - 1]
      const d1 = sourceData[i]
      if (d1 && xDate - d0.timestamp.getTime() <= d1.timestamp.getTime() - xDate) {
        i = i -1
      } else if (!d1) {
        i = i -1
      }
      const tooltipData = datasets.map(dataset => {
        //Workaround for UDNP-1793
        //catch any TypeError: Cannot read property 'bits_per_second' of undefined(…)
        try {
          let realValue = dataset.data[i][this.props.dataKey]
          if (dataset.stackedAgainst) {
            const against = datasets
              .find(otherDataset => otherDataset.id === dataset.stackedAgainst)
            if (against) {
              realValue = realValue - against.data[i][this.props.dataKey]
            }
          }
          const formatter = dataset.xAxisFormatter ?
            (date, val) => {
              const dateMap = Immutable.fromJS({timestamp: date})
              const formattedDate = formatDate(dataset.xAxisFormatter(dateMap), 'MMM D H:mm')
              const formattedValue = this.formatY(val)
              return `${formattedDate} ${formattedValue}`
            }
          : null
          return configTooltip(
            dataset.data[i].timestamp,
            dataset.data[i][this.props.dataKey],
            realValue,
            formatter
          )
        } catch (e) {
          return {}
        }
      })
      this.setState({
        tooltipText: tooltipData.map(tooltip => tooltip.text),
        tooltipX: tooltipData.map(tooltip => tooltip.x),
        tooltipY: tooltipData.map(tooltip => tooltip.y),
        tooltipOffsetTop: tooltipData.map(tooltip => tooltip.top),
        tooltipOffsetLeft: tooltipData.map(tooltip => tooltip.left)
      })
    }
  }

  deactivateTooltip() {
    if (this.props.showTooltip) {
      this.setState({tooltipText: []})
    }
  }

  formatY(val, setMax) {
    return this.props.yAxisFormat ?
      numeral(val).format(this.props.yAxisFormat)
    : this.props.yAxisCustomFormat ?
      this.props.yAxisCustomFormat(numeral(val).format('0'), setMax)
    : numeral(val).format('0,0')
  }

  render() {
    if (!this.props.width || !this.props.dataSets) {
      return <div><FormattedMessage id="portal.loading.text"/></div>
    }
    if (!this.props.dataSets || !this.props.dataSets.length ||
      !this.props.dataSets.some(dataset => dataset.data.some(data => data[this.props.dataKey]))) {
      return <h4><FormattedMessage id="portal.common.no-data.text" /></h4>
    }
    const stackedDatasets = Immutable.fromJS(this.props.dataSets).map(dataset => {
      if (dataset.get('stackedAgainst')) {
        const against = this.props.dataSets
          .find(otherDataset => otherDataset.id === dataset.get('stackedAgainst'))
        if (against && against.data.length) {
          dataset = dataset.set('data', dataset.get('data').map((data, i) => {
            return data.merge({
              bits_per_second: data.get('bits_per_second') + against.data[i].bits_per_second,
              bytes: data.get('bytes') + against.data[i].bytes,
              requests: data.get('requests') + against.data[i].requests
            })
          }))
        }
      }
      return dataset
    }).toJS()

    const [startDate, endDate] = getExtent(stackedDatasets, 'timestamp')
    const yMax = getExtent(stackedDatasets, this.props.dataKey)[1]

    const yScale = d3.scale.linear()
      .domain([0, yMax])
      .range([
        this.props.height - this.props.padding * (this.props.axes ? 2 : 1),
        this.props.padding * (this.props.dataSets.some(dataset => dataset.label) ? 2 : 1)
      ]);

    const xScale = d3.time.scale.utc()
      .domain([startDate, endDate])
      .range([
        this.props.padding * (this.props.axes ? 3 : 1),
        this.props.width - this.props.padding * (this.props.axes ? 2 : 1)
      ])

    if (!this.props.noXNice) {
      xScale.nice(d3.time.day.utc, 1)
    }

    const trafficLine = d3.svg.line()
      .y(d => yScale(d[this.props.dataKey]))
      .x(d => xScale(d.timestamp))
      .interpolate('monotone')

    const trafficArea = d3.svg.area()
      .y(d => yScale(d[this.props.dataKey]))
      .y0(yScale(0))
      .x(d => xScale(d.timestamp))
      .interpolate('monotone')

    let className = 'analysis-by-time'
    if (this.props.className) {
      className = className + ' ' + this.props.className
    }
    const slices = []
    if (this.props.sliceGranularity) {
      slices.push(startDate)
      while (slices[0] < moment(endDate).startOf(this.props.sliceGranularity).toDate()) {
        slices.unshift(moment(slices[0]).add(1, this.props.sliceGranularity).toDate())
      }
    }

    // Set some extra height to chart if we have more than two datasets as the legends take up approx. 25px per legend
    const extraHeight = stackedDatasets.length > 2 ? stackedDatasets.length * 25 : 0

    return (
      <div className={className}
      onMouseMove={!this.props.noHover && this.moveMouse(xScale, yScale, stackedDatasets)}
      onMouseLeave={!this.props.noHover && this.deactivateTooltip}>
        <svg
          viewBox={`0 0 ${this.props.width} ${this.props.height}`}
          width={this.props.width}
          height={this.props.height + extraHeight}
          ref='chart'>
          {stackedDatasets.map((dataset, i) => {
            return (
              <g key={i}
                className={dataset.comparisonData ? 'dataset-comparison' : null}>
                {dataset.line &&
                  <path d={trafficLine(dataset.data)}
                    className="line"
                    style={{stroke: dataset.color}}/>}
                {dataset.area &&
                  <path d={trafficArea(dataset.data)}
                    className="area"
                    fill={`url(#${dataset.id}-${i}-gradient)`} />}
                <defs>
                  <linearGradient
                    key={i} id={`${dataset.id}-${i}-gradient`}
                    x1="0%" y1="0%" x2="0%" y2="100%">

                    <stop offset="0%" stopColor={dataset.color} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={dataset.color} stopOpacity={dataset.noGradient ? '0.5' : '0'} />

                  </linearGradient>
                </defs>
              </g>
            )
          })}
          {!this.props.noHover && this.state.tooltipText.map((text, i) => {
            return (
              <g key={i}>
                <circle r="5"
                  cx={this.state.tooltipX[i]}
                  cy={this.state.tooltipY[i]}/>
                <line className="crosshair"
                  x1={this.state.tooltipX[i]} x2={this.state.tooltipX[i]}
                  y1={0} y2={this.props.height}/>
              </g>
            )
          })}
          {this.props.axes && <TimeAxisLabels
            xScale={xScale}
            padding={this.props.padding}
            height={this.props.height}
            xAxisTickFrequency={this.props.xAxisTickFrequency}
            showHours={endDate - startDate <= 24*60*60*1000}
            />}
          {this.props.axes ? (() => {
            let numTicks = 4;
            const yMaxAxes = Math.max(...yScale.ticks(numTicks))

            // If the yMaxAxes is less than the number of ticks, we end up seeing
            // multiple ticks on the Y axis with the same number. See UDNP-1586
            numTicks = yMaxAxes < numTicks ? yMaxAxes : numTicks

            return yScale.ticks(numTicks).reduce((axes, tick, i) => {
              if (i) {
                axes.push(
                  <g key={i}>
                    <text x={this.props.padding} y={yScale(tick)}>
                      {/* Numeral.js doesn't offer all needed formats, e.g. (bps),
                      so we can use custom formatter for those cases */}
                      {this.formatY(tick, yMaxAxes)}
                    </text>
                  </g>
                );
              }
              return axes
            }, [])
          })()
            : null

          }
          {slices.map((slice, i) => {
            const startX = xScale(slice)
            const endX = xScale(moment(slice).endOf(this.props.sliceGranularity))
            return (
              <polygon key={i} className="slice"
                onClick={() => {
                  this.props.selectSlice(slice)
                }}
                onMouseOver={() => {
                  this.props.hoverSlice(slice, startX, endX)
                }}
                onMouseOut={() => {
                  this.props.hoverSlice()
                }}
                points={[
                  `${startX},${this.props.height}`,
                  `${startX},0`,
                  `${endX},0`,
                  `${endX},${this.props.height}`
                ].join(' ')}/>
            )
          })}
        </svg>

      {this.props.showTooltip && <div className='tooltips'>
        {this.props.dataSets.map((dataset, i) => {
          return (
            <Tooltip key={i}
              x={this.state.tooltipX[i]}
              y={this.state.tooltipY[i]}
              hidden={!this.state.tooltipText[i]}
              offsetTop={this.state.tooltipOffsetTop[i]}
              offsetLeft={this.state.tooltipOffsetLeft[i]}
            >
                {this.state.tooltipText[i]}
            </Tooltip>
          )
        })}
      </div>}

      {this.props.showLegend && <Legend
        dataSets={this.props.dataSets}
        values={this.props.dataSets.map((dataset, i) => this.state.tooltipText[i])}
      />}
      </div>
    )
  }
}

AnalysisByTime.displayName = 'AnalysisByTime'
AnalysisByTime.propTypes = {
  axes: React.PropTypes.bool,
  className: React.PropTypes.string,
  dataKey: React.PropTypes.string,
  dataSets: React.PropTypes.array,
  height: React.PropTypes.number,
  hoverSlice: React.PropTypes.func,
  noHover: React.PropTypes.bool,
  noXNice: React.PropTypes.bool,
  padding: React.PropTypes.number,
  selectSlice: React.PropTypes.func,
  showLegend: React.PropTypes.bool,
  showTooltip: React.PropTypes.bool,
  sliceGranularity: React.PropTypes.string,
  width: React.PropTypes.number,
  xAxisTickFrequency: React.PropTypes.number,
  yAxisCustomFormat: React.PropTypes.func,
  yAxisFormat: React.PropTypes.string
}

AnalysisByTime.defaultProps = {
  showTooltip: true,
  showLegend: false
}

module.exports = AnalysisByTime
