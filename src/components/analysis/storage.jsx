import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import SectionHeader from '../layout/section-header'
import SectionContainer from '../layout/section-container'
import LineAreaComposedChart from '../../components/charts/line-area-composed-chart'
import { formatBitsPerSecond } from '../../util/helpers'

//TODO: remove mock data when integrating with redux in UDNP-2938
import {composedChartData } from '../../containers/__mocks__/chart-data'

const AnalysisStorage = (props) => {
  return (
    <div className="analysis-storage">
      <SectionHeader
        sectionHeaderTitle={props.storageType === 'usage'
          ? <FormattedMessage id="portal.analytics.storage.usage.text"/>
          : <FormattedMessage id="portal.analytics.storage.files.text"/>} />
      <SectionContainer className="analysis-data-box wide">
        <Row>
          <Col xs={4} className="right-separator">
            <h4><FormattedMessage id="portal.analytics.peak.text"/></h4>
            <p>{props.peakStorage && props.peakStorage}</p>
          </Col>
          <Col xs={4} className="right-separator">
            <h4><FormattedMessage id="portal.analytics.average.text"/></h4>
            <p>{props.avgStorage && props.avgStorage}</p>
          </Col>
          <Col xs={4}>
            <h4><FormattedMessage id="portal.analytics.low.text"/></h4>
            <p>{props.lowStorage && props.lowStorage}</p>
          </Col>
        </Row>
      </SectionContainer>

      <SectionHeader
        sectionHeaderTitle={<FormattedMessage id="portal.analytics.storage.usageByTime.text"/>} />
      <SectionContainer className="analysis-by-time">
        <LineAreaComposedChart
          chartLabel="Oct 2016 Month To Date"
          data={composedChartData}
          valueFormatter={formatBitsPerSecond}
        />
      </SectionContainer>
    </div>
  )
}

AnalysisStorage.displayName = 'AnalysisStorage'
AnalysisStorage.propTypes   = {
  avgStorage: React.PropTypes.string,
  lowStorage: React.PropTypes.string,
  peakStorage: React.PropTypes.string,
  storageType: React.PropTypes.string
}

export default AnalysisStorage
