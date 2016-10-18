import React from 'react'
import ReactDOM from 'react-dom'
import Immutable from 'immutable'
import { shallow, mount } from 'enzyme'

jest.dontMock('../../../constants/content-item-sort-options.js')
jest.unmock('../../../util/status-codes')
jest.dontMock('../content-items.jsx')

const ContentItems = require('../content-items.jsx').default

const fakeMetrics = Immutable.fromJS([
  {
    "avg_cache_hit_rate": 94,
    "avg_ttfb": "13 ms",
    "transfer_rates": {
      "peak": "1.94 Mbps",
      "average": "126.96 Kbps",
      "lowest": "27.51 Kbps"
    },
    "historical_variance": [
      {
        "bytes": 50552191,
        "timestamp": 1461607200
      },
      {
        "bytes": 28499240,
        "timestamp": 1460552400
      }
    ],
    "historical_traffic": [
      {
        "bytes": null,
        "timestamp": 1458136800
      },
      {
        "bytes": null,
        "timestamp": 1458133200
      }
    ],
    "group": 3
  }
])

const fakeItems = Immutable.fromJS([
  {
    id: 3,
    name: 'aaa'
  }
])

const fakeHeader = {
  summary: 'aaa',
  label: 'bbb'
}

const fakeLinks = [{
  label: 'aaa',
  url: 'bbb'
}]

describe('ContentItems', () => {
  it('should exist', () => {
    let contentItems = shallow(
      <ContentItems
        account={'account'}
        activeAccount={Immutable.Map()}
        activeGroup={Immutable.Map()}
        analyticsURLBuilder={jest.fn()}
        brand={'brand'}
        breadcrumbs={fakeLinks}
        className="hosts-container"
        configURLBuilder={jest.fn()}
        contentItems={fakeItems}
        fetching={true}
        fetchingMetrics={true}
        headerText={fakeHeader}
        metrics={fakeMetrics}
        nextPageURLBuilder={jest.fn()}
        showAnalyticsLink={true}
        sortDirection={1}
        sortItems={jest.fn()}
        toggleChartView={jest.fn()}
        type='property'
        viewingChart={true}/>
    );
    expect(contentItems.is('Content')).toBeTruthy();
  })

  it('should show analytics link', () => {
    let contentItems = shallow(
      <ContentItems
        account={'account'}
        activeAccount={Immutable.Map()}
        activeGroup={Immutable.Map()}
        analyticsURLBuilder={jest.fn()}
        breadcrumbs={fakeLinks}
        className="hosts-container"
        configURLBuilder={jest.fn()}
        contentItems={fakeItems}
        fetching={true}
        fetchingMetrics={true}
        headerText={fakeHeader}
        metrics={fakeMetrics}
        nextPageURLBuilder={jest.fn()}
        showAnalyticsLink={true}
        sortDirection={1}
        sortItems={jest.fn()}
        toggleChartView={jest.fn()}
        type='property'
        viewingChart={true}/>
    );
    expect(contentItems.find('AnalyticsLink').length).toBe(1);
  });

  it('should not show analytics link', () => {
    let contentItems = shallow(
      <ContentItems
        account={'account'}
        activeAccount={Immutable.Map()}
        activeGroup={Immutable.Map()}
        analyticsURLBuilder={jest.fn()}
        breadcrumbs={fakeLinks}
        className="hosts-container"
        configURLBuilder={jest.fn()}
        contentItems={fakeItems}
        fetching={true}
        fetchingMetrics={true}
        headerText={fakeHeader}
        metrics={fakeMetrics}
        nextPageURLBuilder={jest.fn()}
        sortDirection={1}
        sortItems={jest.fn()}
        toggleChartView={jest.fn()}
        type='property'
        viewingChart={true}/>
    );
    expect(contentItems.find('AnalyticsLink').length).toBe(0);
  });

  it('should show text for no content', () => {
    let contentItems = shallow(
      <ContentItems
        account={'account'}
        activeAccount={Immutable.Map()}
        activeGroup={Immutable.Map()}
        analyticsURLBuilder={jest.fn()}
        breadcrumbs={fakeLinks}
        className="hosts-container"
        configURLBuilder={jest.fn()}
        contentItems={Immutable.List()}
        headerText={fakeHeader}
        ifNoContent={'test'}
        metrics={fakeMetrics}
        nextPageURLBuilder={jest.fn()}
        sortDirection={1}
        sortItems={jest.fn()}
        toggleChartView={jest.fn()}
        type='property'
        viewingChart={true}/>
    );
    expect(contentItems.find('NoContentItems').length).toBe(1);
  });

  it('should pass chart prop to content item', () => {
    let contentItems = shallow(
      <ContentItems
        account={'account'}
        activeAccount={Immutable.Map()}
        activeGroup={Immutable.Map()}
        analyticsURLBuilder={jest.fn()}
        className="hosts-container"
        configURLBuilder={jest.fn()}
        contentItems={fakeItems}
        headerText={fakeHeader}
        metrics={fakeMetrics}
        nextPageURLBuilder={jest.fn()}
        params={{brand:'aaa'}}
        showAnalyticsLink={false}
        sortDirection={1}
        sortItems={jest.fn()}
        toggleChartView={jest.fn()}
        type='property'
        viewingChart={true}/>
    );
    expect(contentItems.find('ContentItem').first().prop('isChart')).toBe(true);
  });

})
