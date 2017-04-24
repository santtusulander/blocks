import React from 'react'
import { Row } from 'react-bootstrap';

import BarChart from '../../components/charts/bar-chart'
import LineChart from '../../components/charts/line-chart'
import SectionContainer from '../../components/shared/layout/section-container'
import StackedAreaChart from '../../components/charts/stacked-area-chart'
import LineAreaComposedChart from '../../components/charts/line-area-composed-chart'

import { formatBitsPerSecond } from '../../util/helpers'
import { stackedBarChartData,
         singleBarChartData,
         lineChartData,
         twoStackedComparisonAreaData as AreaChartData,
         nonStackedAreaDataset,
         stackedAreaDataset,
         comparisonAreaDataset,
         twoStackedAreaDataset,
         composedChartData
  } from '../__mocks__/chart-data'

/* eslint-disable react-intl/string-is-marked-for-translation */

const StyleguideCharts = () => {
  return (
    <div>
      <Row>
        <label>Stacked barchart</label>
        <SectionContainer className="analysis-chart-container">
          {<BarChart
            chartLabel="Month to Date"
            chartData={stackedBarChartData}
            barModels={[
              { dataKey: 'offNetHttps', name: 'Off-Net HTTPS', className: 'line-3' },
              { dataKey: 'offNetHttp', name: 'Off-Net HTTP', className: 'line-2' },
              { dataKey: 'onNetHttps', name: 'On-Net HTTPS', className: 'line-1' },
              { dataKey: 'onNetHttp', name: 'On-Net HTTP', className: 'line-0' }
            ]}/>}
        </SectionContainer>
        </Row>

        <hr />

        <Row>
          <label>Normal barchart</label>
          <SectionContainer className="analysis-chart-container">
            <BarChart
              chartLabel="This Week"
              chartData={singleBarChartData}
              barModels={[{ dataKey: 'onNetHttp', name: 'On-Net HTTP', className: 'line-0' }]}/>
          </SectionContainer>
        </Row>

        <hr/>

        <Row>
          <label>Line chart</label>
          <SectionContainer className="analysis-by-time">
            <LineChart
              data={lineChartData}
              dataKey="bits_per_second"
            />
          </SectionContainer>
        </Row>

        <hr/>

        <Row>
          <label>Area chart</label>
          <SectionContainer className="analysis-by-time">
            <StackedAreaChart
              chartLabel="Oct 2016 Month To Date"
              areas={nonStackedAreaDataset}
              data={AreaChartData}
              valueFormatter={formatBitsPerSecond}
            />
          </SectionContainer>
        </Row>

        <hr/>

        <Row>
          <label>Stacked area chart</label>
          <SectionContainer className="analysis-by-time">
            <StackedAreaChart
              chartLabel="Oct 2016 Month To Date"
              areas={stackedAreaDataset}
              data={AreaChartData}
              valueFormatter={formatBitsPerSecond}
            />
          </SectionContainer>
        </Row>

        <hr/>
        <Row>
          <label>Comparison area chart</label>
          <SectionContainer className="analysis-by-time">
            <StackedAreaChart
              chartLabel="Oct 2016 Month To Date"
              areas={comparisonAreaDataset}
              data={AreaChartData}
              valueFormatter={formatBitsPerSecond}
            />
          </SectionContainer>
        </Row>

        <hr/>
        <Row>
          <label>Comparison chart for two stacked area</label>
          <SectionContainer className="analysis-by-time">
            <StackedAreaChart
              chartLabel="Oct 2016 Month To Date"
              areas={twoStackedAreaDataset}
              data={AreaChartData}
              valueFormatter={formatBitsPerSecond}
            />
          </SectionContainer>
        </Row>

        <hr/>

        <Row>
          <label>Comparison chart composed with line chart </label>
          <SectionContainer className="analysis-by-time">
            <LineAreaComposedChart
              chartLabel="Oct 2016 Month To Date"
              data={composedChartData}
              keyLabel="Storage"
              valueFormatter={formatBitsPerSecond}
              comparisonKeyLabel="Comparison Storage"
              isComparison={true}
            />
          </SectionContainer>
        </Row>
    </div>
  )
}

StyleguideCharts.displayName = 'StyleguideCharts'

export default StyleguideCharts
