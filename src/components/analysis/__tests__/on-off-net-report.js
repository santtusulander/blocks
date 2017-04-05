import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.autoMockOff()
jest.unmock('../on-off-net-report.jsx')
jest.unmock('../../shared/table-sorter.jsx')

jest.mock('../../../util/helpers', () => ({ formatBytes: bytes => bytes }))

import AnalysisOnOffNetReport from '../on-off-net-report.jsx'

// Set up mocks to make sure formatting libs are used correctly
import moment from 'moment'
import numeral from 'numeral'

moment.format = jest.fn()
numeral.format = jest.fn()

const fakeOnOffStats = Immutable.fromJS({
  total: 31000000,
  net_on: {bytes: 500000, percent_total: 0.5},
  net_off: {bytes: 500000, percent_total: 0.5},
  detail: [{
    timestamp: new Date(1451606400 * 1000),
    total: 1000000,
    net_on: {bytes: 500000, percent_total: 0.5},
    net_off: {bytes: 500000, percent_total: 0.5}
  }, {
    timestamp: new Date(1451692800 * 1000),
    total: 1000000,
    net_on: {bytes: 500000, percent_total: 0.5},
    net_off: {bytes: 500000, percent_total: 0.5}
  }]
})

const fakeOnOffStatsToday = Immutable.fromJS({
  total: 123456,
  net_on: {bytes: 123, percent_total: 0.2},
  net_off: {bytes: 456, percent_total: 0.8}
})

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('AnalysisOnOffNetReport', () => {
  it('should exist', () => {
    let analysisOnOffNetReport = shallow(
      <AnalysisOnOffNetReport
        dateRange={Immutable.Map({startDate: new Date(), endDate: new Date()})}
        dateRangeLabel='Label'
        fetching={true}
        onOffStats={fakeOnOffStats}
        onOffStatsToday={fakeOnOffStatsToday}
        intl={intlMaker()}/>
    );
    expect(analysisOnOffNetReport).toBeDefined();
  });

  it('should not show data rows in table if there is no data', () => {
    let analysisOnOffNetReport = shallow(
      <AnalysisOnOffNetReport
        dateRange={ Immutable.Map({startDate: new Date(), endDate: new Date() })}
        dateRangeLabel='Label'
        fetching={false}
        onOffStats={fakeOnOffStats}
        onOffStatsToday={fakeOnOffStatsToday}
        intl={intlMaker()}/>
    );
    let noData = analysisOnOffNetReport.find({id: 'portal.common.no-data.text'})
    expect(noData.length).toBe(1);
  });

  it('should show summary stats', () => {
    let analysisOnOffNetReport = shallow(
      <AnalysisOnOffNetReport
        dateRange={Immutable.Map({startDate: new Date(), endDate: new Date()})}
        dateRangeLabel='Label'
        fetching={false}
        onOffStats={fakeOnOffStats}
        onOffStatsToday={fakeOnOffStatsToday}
        intl={intlMaker()}/>
    );

    let summaryBoxes = analysisOnOffNetReport.find('.analysis-data-box')

    expect(summaryBoxes.at(0).find('p').text()).toContain('123')
    expect(summaryBoxes.at(1).find('p').text()).toContain('500000')
  });
})
