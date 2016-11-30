import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../custom-tooltip')
import Tooltip from '../custom-tooltip'

jest.mock('../../../util/helpers', () => ({ formatBytes: bytes => bytes }))

const subject = shallow(
  <Tooltip
    iconClass={dataKey => dataKey}
    payload={[
      { name: 'aa', value: 1000, dataKey: 1 },
      { name: 'bb', value: 1000, dataKey: 2 }
    ]}/>
)

describe('Custom Tooltip', () => {
  it('should exist', () => {
    expect(subject).toBeDefined()
  });
  it('should show lines for every item', () => {
    expect(subject.find('.tooltip-item').length).toBe(2)
  });
  it('should call className getter correctly', () => {
    expect(subject.find('.1')).toBeDefined()
    expect(subject.find('.2')).toBeDefined()
  });
  it('should count total amount correctly', () => {
    expect(subject.find('#tooltip-total').text()).toBe("2000")
  });

})
