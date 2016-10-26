import React from 'react'
import {injectIntl} from 'react-intl'
import numeral from 'numeral'

import AnalysisByTime from '../analysis/by-time'
import {formatBytes} from '../../util/helpers'
import { paleblue } from '../../constants/colors'

class SPOnOffNetTraffic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      byTimeWidth: 500
    }

    this.measureContainers = this.measureContainers.bind(this)
  }

  componentDidMount() {
    this.measureContainers()
    window.addEventListener('resize', this.measureContainers)
  }

  componentWillReceiveProps() {
    this.measureContainersTimeout = setTimeout(() => {this.measureContainers()}, 300)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
  }

  measureContainers() {
    this.setState({
      byTimeWidth: this.refs.byTimeHolder.clientWidth
    })
  }

  render() {
    let statsDetails = []
    statsDetails.push(
      {
        "timestamp": new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)'),
        "total": 92020173697866,
        "net_on": {
          "bytes": 71856580682504,
          "percent_total": 0.7809
        },
        "net_off": {
          "bytes": 20163593015362,
          "percent_total": 0.2191
        }
      },
      {
        "timestamp": new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)'),
        "total": 99672709053865,
        "net_on": {
          "bytes": 76848354018252,
          "percent_total": 0.771
        },
        "net_off": {
          "bytes": 22824355035613,
          "percent_total": 0.229
        }
      },
      {
        "timestamp": new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)'),
        "total": 94821186769899,
        "net_on": {
          "bytes": 72941835769369,
          "percent_total": 0.7693
        },
        "net_off": {
          "bytes": 21879351000530,
          "percent_total": 0.2307
        }
      },
      {
        "timestamp": new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)'),
        "total": 117441291619312,
        "net_on": {
          "bytes": 90477417340581,
          "percent_total": 0.7704
        },
        "net_off": {
          "bytes": 26963874278731,
          "percent_total": 0.2296
        }
      },
      {
        "timestamp": new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)'),
        "total": 81546375702611,
        "net_on": {
          "bytes": 62160286504951,
          "percent_total": 0.7623
        },
        "net_off": {
          "bytes": 19386089197660,
          "percent_total": 0.2377
        }
      },
      {
        "timestamp": new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)'),
        "total": 117341539984300,
        "net_on": {
          "bytes": 90364165873239,
          "percent_total": 0.7701
        },
        "net_off": {
          "bytes": 26977374111061,
          "percent_total": 0.2299
        }
      },
      {
        "timestamp": new Date('Thu May 26 2016 18:17:01 GMT-0700 (PDT)'),
        "total": 94064934029131,
        "net_on": {
          "bytes": 72989086766237,
          "percent_total": 0.7759
        },
        "net_off": {
          "bytes": 21075847262894,
          "percent_total": 0.2241
        }
      },
      {
        "timestamp": new Date('Thu May 26 2016 19:17:01 GMT-0700 (PDT)'),
        "total": 93196929110225,
        "net_on": {
          "bytes": 72133332220394,
          "percent_total": 0.774
        },
        "net_off": {
          "bytes": 21063596889831,
          "percent_total": 0.226
        }
      }
    )

    const onNet = statsDetails.map(datapoint => {
      return {
        bytes: datapoint['net_on']['bytes'] || 0,
        timestamp: datapoint['timestamp']
      }
    })

    const offNet = statsDetails.map(datapoint => {
      return {
        bytes: datapoint['net_off']['bytes'] || 0,
        timestamp: datapoint['timestamp']
      }
    })

    let datasets = []
    datasets.push({
      area: true,
      color: 'yellow',
      comparisonData: true,
      data: offNet,
      id: 'offNet',
      label: '',
      line: true,
      stackedAgainst: false,
      xAxisFormatter: false
    })

    datasets.push({
      area: true,
      color: paleblue,
      comparisonData: true,
      data: onNet,
      id: 'onNet',
      label: '',
      line: true,
      stackedAgainst: 'offNet',
      xAxisFormatter: false
    })

    return (
      <div>
        <h4>Total</h4>
        <h1>{formatBytes(1558780931444688)}</h1>

        <div ref="byTimeHolder">
          <AnalysisByTime
            padding={40}
            dataKey="bytes"
            dataSets={datasets}
            width={this.state.byTimeWidth}
            height={this.state.byTimeWidth / 3}
            showTooltip={false}
            showLegend={false}/>
        </div>

        <h4>On-Net</h4>
        <h1>{numeral(0.7704).format('0,0%')}</h1>

        <h4>Off-Net</h4>
        <h1>{numeral(0.2296).format('0,0%')}</h1>
      </div>
    )
  }
}

SPOnOffNetTraffic.displayName = 'SPOnOffNetTraffic'
SPOnOffNetTraffic.propTypes = {
  intl: React.PropTypes.object
}

SPOnOffNetTraffic.defaultProps = {

}

module.exports = injectIntl(SPOnOffNetTraffic)
