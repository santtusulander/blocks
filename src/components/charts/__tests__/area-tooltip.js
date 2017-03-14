import React from 'react'
import { shallow } from 'enzyme'
import '../../../../__mocks__/recharts'

jest.unmock('../area-tooltip')
import AreaTooltip from '../area-tooltip'

jest.mock('../../../util/helpers', () => ({ formatBitsPerSecond: bits_per_second => bits_per_second }))

const data = [
	{
		"stroke": "false",
		"strokeWidth": "2",
		"fillOpacity": 0.9,
		"fill": "#009f80",
		"dataKey": "https",
		"name": "HTTPS",
		"color": "false",
		"value": 800559267,
		"payload": {
			"timestamp": 1486713600,
			"http": 1777785972,
			"actualTime": 1484035200,
			"https": 800559267,
			"comparison_http": 2260010422,
			"comparison_https": 1051671521
		}
	},
	{
		"stroke": "false",
		"strokeWidth": "2",
		"fillOpacity": 0.9,
		"fill": "#00a9d4",
		"dataKey": "http",
		"name": "HTTP",
		"color": "false",
		"value": 1777785972,
		"payload": {
			"timestamp": 1486713600,
			"http": 1777785972,
			"actualTime": 1484035200,
			"https": 800559267,
			"comparison_http": 2260010422,
			"comparison_https": 1051671521
		}
	}
]

const subject = shallow(
  <AreaTooltip
    payload={data}
    iconClass={() => 'tooltip-class'}
    />
)

describe('Area Tooltip', () => {
  it('should exist', () => {
    expect(subject).toBeDefined()
  });
})
