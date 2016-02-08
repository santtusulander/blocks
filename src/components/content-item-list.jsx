import React from 'react'
import { ButtonToolbar, Button, Col, Row } from 'react-bootstrap';

import { Link } from 'react-router'
import AnalysisByTime from '../components/analysis/by-time'
import IconChart from '../components/icons/icon-chart.jsx'
import IconConfiguration from '../components/icons/icon-configuration.jsx'

const fakeRecentData = [
  {epoch_start: 1451606300, bytes: 0, requests: 0},
  {epoch_start: 1451606400, bytes: 49405, requests: 943},
  {epoch_start: 1451606500, bytes: 44766, requests: 546},
  {epoch_start: 1451606600, bytes: 44675, requests: 435},
  {epoch_start: 1451606700, bytes: 44336, requests: 345},
  {epoch_start: 1451606800, bytes: 43456, requests: 567},
  {epoch_start: 1451606900, bytes: 46756, requests: 244},
  {epoch_start: 1451607000, bytes: 45466, requests: 455},
  {epoch_start: 1451607100, bytes: 43456, requests: 233},
  {epoch_start: 1451607200, bytes: 47454, requests: 544},
  {epoch_start: 1451607300, bytes: 54766, requests: 546},
  {epoch_start: 1451607400, bytes: 54675, requests: 435},
  {epoch_start: 1451607500, bytes: 54336, requests: 456},
  {epoch_start: 1451607600, bytes: 53456, requests: 567},
  {epoch_start: 1451607700, bytes: 56756, requests: 244},
  {epoch_start: 1451607800, bytes: 55466, requests: 455},
  {epoch_start: 1451607900, bytes: 43456, requests: 456},
  {epoch_start: 1451608000, bytes: 57454, requests: 544},
  {epoch_start: 1451608100, bytes: 53456, requests: 233},
  {epoch_start: 1451608200, bytes: 57454, requests: 544},
  {epoch_start: 1451608300, bytes: 54766, requests: 546},
  {epoch_start: 1451608400, bytes: 44675, requests: 435},
  {epoch_start: 1451608500, bytes: 44336, requests: 456},
  {epoch_start: 1451608600, bytes: 23456, requests: 567},
  {epoch_start: 1451608700, bytes: 26756, requests: 244},
  {epoch_start: 1451608800, bytes: 25466, requests: 455},
  {epoch_start: 1451608900, bytes: 23456, requests: 456},
  {epoch_start: 1451609000, bytes: 27454, requests: 544},
  {epoch_start: 1451609100, bytes: 23456, requests: 456},
  {epoch_start: 1451609200, bytes: 27454, requests: 544},
  {epoch_start: 1451609300, bytes: 23456, requests: 233},
  {epoch_start: 1451609400, bytes: 24675, requests: 435},
  {epoch_start: 1451609500, bytes: 24336, requests: 456},
  {epoch_start: 1451609600, bytes: 23456, requests: 567},
  {epoch_start: 1451609700, bytes: 26756, requests: 244},
  {epoch_start: 1451609800, bytes: 25466, requests: 455},
  {epoch_start: 1451609900, bytes: 23456, requests: 456},
  {epoch_start: 1451610000, bytes: 37454, requests: 544},
  {epoch_start: 1451610100, bytes: 33456, requests: 456},
  {epoch_start: 1451610200, bytes: 37454, requests: 544},
  {epoch_start: 1451610300, bytes: 33456, requests: 233},
  {epoch_start: 1451610400, bytes: 34675, requests: 435},
  {epoch_start: 1451610500, bytes: 44336, requests: 456},
  {epoch_start: 1451610600, bytes: 53456, requests: 567},
  {epoch_start: 1451610700, bytes: 56756, requests: 244},
  {epoch_start: 1451610800, bytes: 55466, requests: 455},
  {epoch_start: 1451610900, bytes: 53456, requests: 456},
  {epoch_start: 1451611000, bytes: 57454, requests: 544},
  {epoch_start: 1451611100, bytes: 53456, requests: 233},
  {epoch_start: 1451611200, bytes: 67454, requests: 544},
  {epoch_start: 1451611300, bytes: 64766, requests: 546},
  {epoch_start: 1451611400, bytes: 64675, requests: 435},
  {epoch_start: 1451611500, bytes: 64336, requests: 456},
  {epoch_start: 1451611600, bytes: 63456, requests: 567},
  {epoch_start: 1451611700, bytes: 66756, requests: 244},
  {epoch_start: 1451611800, bytes: 65466, requests: 455},
  {epoch_start: 1451611900, bytes: 63456, requests: 456},
  {epoch_start: 1451612000, bytes: 67454, requests: 544},
  {epoch_start: 1451612100, bytes: 63456, requests: 456},
  {epoch_start: 1451612200, bytes: 57454, requests: 544},
  {epoch_start: 1451612300, bytes: 53456, requests: 233},
  {epoch_start: 1451612400, bytes: 44675, requests: 435},
  {epoch_start: 1451612500, bytes: 44336, requests: 456},
  {epoch_start: 1451612600, bytes: 33456, requests: 567},
  {epoch_start: 1451612700, bytes: 46756, requests: 244},
  {epoch_start: 1451612800, bytes: 35466, requests: 455},
  {epoch_start: 1451612900, bytes: 43456, requests: 456},
  {epoch_start: 1451613000, bytes: 47454, requests: 544},
  {epoch_start: 1451613100, bytes: 0, requests: 0}
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
              <AnalysisByTime axes={false} padding={0}
                className="bg-transparent"
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
