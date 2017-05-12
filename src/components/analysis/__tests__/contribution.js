import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme'

jest.autoMockOff()
jest.unmock('../contribution.jsx')
jest.unmock('../../shared/table-sorter.jsx')

import AnalysisContribution from '../contribution.jsx'

// Set up mocks to make sure formatting libs are used correctly
import moment from 'moment'
import numeral from 'numeral'

moment.format = jest.fn()
numeral.format = jest.fn()

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

const fakeStats = Immutable.fromJS([
  {
    "name": "Vodafone",
    "http": {
      "net_on": 25000,
      "net_on_bps": 25000,
      "net_off": 50000,
      "net_off_bps": 50000
    },
    "https": {
      "net_on": 25000,
      "net_on_bps": 25000,
      "net_off": 50000,
      "net_off_bps": 50000
    },
    "countries": [
      {
        "name": "Germany",
        "code": "GER",
        "bytes": 150000,
        "bits_per_second": 150000,
        "percent_total": 0.35
      },
      {
        "name": "France",
        "code": "FRA",
        "bytes": 150000,
        "bits_per_second": 150000,
        "percent_total": 0.20
      }
    ]
  },
  {
    "name": "Telstra",
    "http": {
      "net_on": 50000,
      "net_on_bps": 50000,
      "net_off": 25000,
      "net_off_bps": 25000
    },
    "https": {
      "net_on": 25000,
      "net_on_bps": 25000,
      "net_off": 50000,
      "net_off_bps": 50000
    },
    "countries": [
      {
        "name": "Australia",
        "code": "AUS",
        "bytes": 150000,
        "bits_per_second": 150000,
        "percent_total": 0.30
      }
    ]
  }
])

describe('AnalysisContribution', () => {
  it('should exist', () => {
    const analysisContribution = shallow(
      <AnalysisContribution
        stats={fakeStats}
        intl={intlMaker()}
      />
    );
    expect(TestUtils.isCompositeComponent(analysisContribution)).toBeTruthy();
  });

  it('should show data rows in table', () => {
    const analysisContribution = shallow(
      <AnalysisContribution
        stats={fakeStats}
        intl={intlMaker()}
      />
    );
    const trs = analysisContribution.find('tr')
    expect(trs.length).toBe(4);
  });
})
