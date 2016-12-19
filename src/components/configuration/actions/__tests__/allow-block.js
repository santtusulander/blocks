import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../../../../util/status-codes')
jest.unmock('../allow-block.jsx')
import AllowBlock from '../allow-block.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('AllowBlock', () => {
  it('should exist', () => {
    let allowBlock = shallow(
      <AllowBlock intl={intlMaker()} />
    );
    expect(allowBlock).toBeDefined();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let allowBlock = shallow(
      <AllowBlock intl={intlMaker()} changeValue={changeValue}/>
    )
    let inputs = allowBlock.find('FormControl')
    inputs.at(0).simulate('change', { target: { value: 'new' } })
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'actions', 'allow_block_redirect_url'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should handle select changes', () => {
    let changeValue = jest.genMockFunction()
    let allowBlock = shallow(
      <AllowBlock intl={intlMaker()} changeValue={changeValue}/>
    )
    expect(allowBlock.state('activeAccessControl')).toBe('allow')
    allowBlock.instance().handleSelectChange('activeAccessControl')('foo')
    expect(allowBlock.state('activeAccessControl')).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(allowBlock.state('activeErrorResponse')).toBe('301')
    allowBlock.instance().handleSelectChange('activeErrorResponse')('bar')
    expect(allowBlock.state('activeErrorResponse')).toBe('bar')
    expect(changeValue.mock.calls[1][1]).toBe('bar')
  })
})
