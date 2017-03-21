import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'
import { List } from 'immutable'

import SectionHeader from '../layout/section-header'
import SectionContainer from '../layout/section-container'
import LineAreaComposedChart from '../../components/charts/line-area-composed-chart'

const AnalysisStorage = ({
  dateRangeLabel,
  storageType,
  peakStorage,
  avgStorage,
  lowStorage,
  chartData,
  valueFormatter,
  includeComparison,
  intl
  }) => {

  return (
    <div className="analysis-storage">
      <SectionHeader
        sectionHeaderTitle={storageType === 'bytes'
          ? intl.formatMessage({id: "portal.analytics.storage.usage.text"})
          : intl.formatMessage({id: "portal.analytics.storage.files.text"})} />
      <SectionContainer className="analysis-data-box wide">
        <Row>
          <Col xs={4} className="right-separator">
            <h4><FormattedMessage id="portal.analytics.peak.text"/></h4>
            <p>{peakStorage}</p>
          </Col>
          <Col xs={4} className="right-separator">
            <h4><FormattedMessage id="portal.analytics.average.text"/></h4>
            <p>{avgStorage}</p>
          </Col>
          <Col xs={4}>
            <h4><FormattedMessage id="portal.analytics.low.text"/></h4>
            <p>{lowStorage}</p>
          </Col>
        </Row>
      </SectionContainer>

      <SectionHeader
        sectionHeaderTitle={intl.formatMessage({id: "portal.analytics.storage.usageByTime.text"})} />
      <SectionContainer className="analysis-by-time">
        <LineAreaComposedChart
          chartLabel={intl.formatMessage({id: dateRangeLabel})}
          data={chartData.toJS()}
          dataKey={storageType}
          comparisonDataKey={`historical_${storageType}`}
          keyLabel={storageType === 'bytes'
            ? intl.formatMessage({id: "portal.analysis.filters.storageType.usage.title"})
            : intl.formatMessage({id: "portal.analysis.filters.storageType.files.title"})}
          comparisonKeyLabel={storageType === 'bytes'
            ? intl.formatMessage({id: "portal.analysis.filters.storageType.usage.comparison.title"})
            : intl.formatMessage({id: "portal.analysis.filters.storageType.files.comparison.title"})}
          valueFormatter={valueFormatter}
          isComparison={includeComparison}
        />
      </SectionContainer>
    </div>
  )
}

AnalysisStorage.defaultProps   = {
  avgStorage: 0,
  lowStorage: 0,
  peakStorage: 0
}

AnalysisStorage.defaultProps   = {
  chartData: List()
}

AnalysisStorage.displayName = 'AnalysisStorage'
AnalysisStorage.propTypes   = {
  avgStorage: React.PropTypes.string,
  chartData: React.PropTypes.instanceOf(List),
  dateRangeLabel: React.PropTypes.string,
  includeComparison: React.PropTypes.bool,
  intl: React.PropTypes.object,
  lowStorage: React.PropTypes.string,
  peakStorage: React.PropTypes.string,
  storageType: React.PropTypes.string,
  valueFormatter: React.PropTypes.func
}

export default injectIntl(AnalysisStorage)
