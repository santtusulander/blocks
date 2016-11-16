import {fromJS} from 'immutable'
jest.unmock('../selectors')
import * as selectors from '../selectors'

const properties = {
  'aa': {
    published_host_id: 'aa',
    brandId: 'udn',
    accountId: 1,
    groupId: 2,
  },
  'bb': {
    published_host_id: 'bb',
    brandId: 'udn',
    accountId: 3,
    groupId: 4,
  }
}

const initialState = {
  properties: {
    properties: fromJS(properties)
  }
}

describe('Properties Module', () => {
  it('should getAllHosts', () => {
      const p = selectors.getAllHosts( initialState )
      expect(p).toEqual(['aa','bb'])
  });

  it('should getProperties', () => {
    const p = selectors.getProperties( initialState )
    expect(p).toEqual(properties)
  });

  it('should getByAccount', () => {
    const p = selectors.getProperties( initialState, null, 3 )
    expect(p).toEqual( {bb: {
      published_host_id: 'bb',
      brandId: 'udn',
      accountId: 3,
      groupId: 4,
    }})
  });

  it('should getByGroup', () => {
    const p = selectors.getProperties( initialState, null, 1,2 )
    expect(p).toEqual( {  'aa': {
        published_host_id: 'aa',
        brandId: 'udn',
        accountId: 1,
        groupId: 2,
      },})
  });

  it('should getById', () => {
    const p = selectors.getById( initialState, 'aa' )
    expect(p).toEqual({
        published_host_id: 'aa'
    })
  });
})
