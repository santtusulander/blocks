import React from 'react'
import { ButtonToolbar, Button, Col, Row } from 'react-bootstrap';

import { Link } from 'react-router'
import AnalysisByTime from '../components/analysis/by-time'
import IconChart from '../components/icons/icon-chart.jsx'
import IconConfiguration from '../components/icons/icon-configuration.jsx'

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
              <p>Peak <b className="pull-right">{this.props.maxTransfer}</b></p>
              <p>Lowest <b className="pull-right">{this.props.minTransfer}</b></p>
              <p>Average <b className="pull-right">{this.props.avgTransfer}</b></p>
            </div>

            <div className="content-item-list-section section-lg">
              <Row>
                <Col xs={6}>
                  <h1>{this.props.cacheHitRate}<span className="heading-suffix"> %</span></h1>
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
                data={this.props.primaryData}
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
  avgTransfer: React.PropTypes.string,
  cacheHitRate: React.PropTypes.number,
  configurationLink: React.PropTypes.string,
  delete: React.PropTypes.func,
  description: React.PropTypes.string,
  id: React.PropTypes.string,
  linkTo: React.PropTypes.string,
  maxTransfer: React.PropTypes.string,
  minTransfer: React.PropTypes.string,
  name: React.PropTypes.string,
  primaryData: React.PropTypes.array,
  toggleActive: React.PropTypes.func
}

module.exports = ContentItemList
