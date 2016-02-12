import React from 'react'
import { ButtonToolbar, Button, Col, Row } from 'react-bootstrap';

import { Link } from 'react-router'
import AnalysisByTime from '../components/analysis/by-time'
import IconChart from '../components/icons/icon-chart.jsx'
import IconConfiguration from '../components/icons/icon-configuration.jsx'

const fakeRecentData = [
  {timestamp: new Date("2016-01-01 01:00:00"), bytes: 49405, requests: 943},
  {timestamp: new Date("2016-01-02 01:00:00"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-01-03 01:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-04 01:00:00"), bytes: 44336, requests: 345},
  {timestamp: new Date("2016-01-05 01:00:00"), bytes: 43456, requests: 567},
  {timestamp: new Date("2016-01-06 01:00:00"), bytes: 46756, requests: 244},
  {timestamp: new Date("2016-01-07 01:00:00"), bytes: 45466, requests: 455},
  {timestamp: new Date("2016-01-08 01:00:00"), bytes: 43456, requests: 233},
  {timestamp: new Date("2016-01-09 01:00:00"), bytes: 47454, requests: 544},
  {timestamp: new Date("2016-01-10 01:00:00"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-01-11 01:00:00"), bytes: 54675, requests: 435},
  {timestamp: new Date("2016-01-12 01:00:00"), bytes: 54336, requests: 456},
  {timestamp: new Date("2016-01-13 01:00:00"), bytes: 53456, requests: 567},
  {timestamp: new Date("2016-01-14 01:00:00"), bytes: 56756, requests: 244},
  {timestamp: new Date("2016-01-15 01:00:00"), bytes: 55466, requests: 455},
  {timestamp: new Date("2016-01-16 01:00:00"), bytes: 43456, requests: 456},
  {timestamp: new Date("2016-01-17 01:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-18 01:00:00"), bytes: 53456, requests: 233},
  {timestamp: new Date("2016-01-19 01:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-20 01:00:00"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-01-21 01:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-22 01:00:00"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-01-23 01:00:00"), bytes: 23456, requests: 567},
  {timestamp: new Date("2016-01-24 01:00:00"), bytes: 26756, requests: 244},
  {timestamp: new Date("2016-01-25 01:00:00"), bytes: 25466, requests: 455},
  {timestamp: new Date("2016-01-26 01:00:00"), bytes: 23456, requests: 456},
  {timestamp: new Date("2016-01-27 01:00:00"), bytes: 27454, requests: 544},
  {timestamp: new Date("2016-01-28 01:00:00"), bytes: 23456, requests: 456},
  {timestamp: new Date("2016-01-29 01:00:00"), bytes: 27454, requests: 544},
  {timestamp: new Date("2016-01-30 01:00:00"), bytes: 23456, requests: 233},
  {timestamp: new Date("2016-01-31 01:00:00"), bytes: 24675, requests: 435}
]

class ContentItemList extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      byLocationWidth: 0,
      byTimeWidth: 0
    }

    this.measureContainers = this.measureContainers.bind(this)
    this.deleteAccount = this.deleteAccount.bind(this)
  }
  componentDidMount() {
    this.measureContainers()
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
  }
  measureContainers() {
    this.setState({
      byTimeWidth: this.refs.byTimeHolder.clientWidth
    })
  }
  deleteAccount(e) {
    e.stopPropagation()
    e.preventDefault()
    this.props.delete(this.props.id)
  }
  render() {
    return (
      <div className="content-item-list">

        <div className="content-item-list-section section-lg">
          <Link className="content-item-list-link" to={this.props.linkTo}>
            <div className="content-item-details">
              <div className="content-item-list-name">{this.props.name}</div>
              <div className="content-item-list-details text-sm">
                <p>Last Edited</p>
                <p>Yesterday 12:30 pm</p>
                <p>By John McKinley</p>
              </div>
            </div>
          </Link>

          <ButtonToolbar className="pull-right">
            {this.props.configurationLink ?
              <Button bsSize="small"
                className="edit-content-item btn-primary btn-icon
                btn-round">
                <Link to={this.props.configurationLink}>
                  <IconConfiguration/>
                </Link>
              </Button> : ''
            }
            <Button bsSize="small"
               className="btn-primary btn-icon btn-round">
              <IconChart/>
            </Button>
          </ButtonToolbar>
        </div>

        <Link className="content-item-list-link" to={this.props.linkTo}>
          <div className="pull-right">
            <div className="content-item-list-section section-sm">
              <p>Peak <b className="pull-right">10.8 Gbps</b></p>
              <p>Lowest <b className="pull-right">5.2 Gbps</b></p>
              <p>Average <b className="pull-right">8.0 Gbps</b></p>
            </div>

            <div className="content-item-list-section section-lg">
              <Row>
                <Col xs={6}>
                  <h1>95<span className="heading-suffix"> %</span></h1>
                  <p>Avg. Cache Hit Rate</p>
                </Col>
                <Col xs={6}>
                  <h1>36<span className="heading-suffix"> ms</span></h1>
                  <p>Avg. TTFB</p>
                </Col>
              </Row>
            </div>
          </div>

          <div className="content-item-list-chart">
            <div ref="byTimeHolder">
              <AnalysisByTime axes={false} padding={0} className="bg-transparent"
                dataKey="bytes"
                data={fakeRecentData}
                width={this.state.byTimeWidth}
                height={200} />
            </div>
          </div>
        </Link>

      </div>
    )
  }
}

ContentItemList.displayName = 'ContentItemList'
ContentItemList.propTypes = {
  configurationLink: React.PropTypes.string,
  delete: React.PropTypes.func,
  description: React.PropTypes.string,
  id: React.PropTypes.string,
  linkTo: React.PropTypes.string,
  name: React.PropTypes.string,
  toggleActive: React.PropTypes.func
}

module.exports = ContentItemList
