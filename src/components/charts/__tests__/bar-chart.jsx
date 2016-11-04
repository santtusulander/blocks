import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../bar-chart.jsx')
import BarChart from '../bar-chart.jsx'

const chartData = [
  {
    "name": "Datafone Inc.",
    "onNetHttp": 9149792187422,
    "onNetHttps": 4324269843760,
    "offNetHttp": 2297510618946,
    "offNetHttps": 1090755001954
  },
  {
    "name": "AsiaNet",
    "onNetHttp": 58034767339905,
    "onNetHttps": 27260875504858,
    "offNetHttp": 16598076780724,
    "offNetHttps": 6941781887919
  },
  {
    "name": "QXT",
    "onNetHttp": 17640581263893,
    "onNetHttps": 8905041306312,
    "offNetHttp": 4413020296483,
    "offNetHttps": 2063509423994
  },
  {
    "name": "Datafone Inc.",
    "onNetHttp": 9149792187422,
    "onNetHttps": 4324269843760,
    "offNetHttp": 2297510618946,
    "offNetHttps": 1090755001954
  },
  {
    "name": "QXT",
    "onNetHttp": 17640581263893,
    "onNetHttps": 8905041306312,
    "offNetHttp": 4413020296483,
    "offNetHttps": 2063509423994
  }
]

const barModels = [
  { dataKey: 'onNetHttp', name: 'On-Net HTTP', className: 'line-0' },
  { dataKey: 'onNetHttps', name: 'On-Net HTTPS', className: 'line-1' },
  { dataKey: 'offNetHttp', name: 'Off-Net HTTP', className: 'line-2' },
  { dataKey: 'offNetHttps', name: 'Off-Net HTTPS', className: 'line-3' }
]

const subject = (conditionalProps = {}) => shallow(
  <BarChart
    {...conditionalProps}
    chartLabel="LABEL"
    barModels={conditionalProps.barModels || barModels}
    chartData={conditionalProps.chartData || chartData}/>
)

// BarChart.propTypes = {
//   barModels: PropTypes.arrayOf(
//     PropTypes.shape({
//       className: PropTypes.string,
//       name: PropTypes.string.isRequired,
//       dataKey: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
//       stackId: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
//     })).isRequired,
//   chartData: PropTypes.arrayOf(PropTypes.object),
//   chartLabel: PropTypes.string,
//   maxBarSize: PropTypes.number,
//   toolTipOffset: PropTypes.number,
//   tooltipAlwaysActive: PropTypes.bool
// }

describe('BarChart', () => {
  it('should exist', () => {
    expect(subject()).toBeDefined()
  });

  it('should handle tooltip offset-prop', () => {
    expect(subject({ toolTipOffset: 100 }).find('Tooltip').props().offset).toBe(100)
  });

  it('should handle chart label-prop', () => {
    expect(subject().find('#bar-chart-label').text()).toBe('LABEL')
  });

  it('should handle tooltip active-prop', () => {
    expect(subject({ tooltipAlwaysActive: false }).find('Tooltip').length).toBe(0)
  });

  it('should handle max bar size-prop', () => {
    expect(subject({ maxBarSize: 70 }).find('AnimationDecorator(BarChart)').props().maxBarSize).toBe(70)
  });

  it('should set default stackIds', () => {
    expect(subject().find('Bar').every({ stackId: 0 })).toBeTruthy()
  });

  it('should set stackIds passed along barModels', () => {
    const chart = subject({ barModels: [
      { dataKey: 'a', name: 'a', stackId: 1 },
      { dataKey: 'b', name: 'b', stackId: 2 }
    ] }).find('Bar')
    expect([chart.first().props().stackId, chart.last().props().stackId]).toEqual([1, 2])
  });

  it('should not set stackId if single bar passed', () => {
    const chart = subject({ barModels: [{ dataKey: 'a', name: 'a', stackId: 1 }] }).find('Bar')
    expect(chart.first().props().stackId).not.toBeDefined()
  });
})
