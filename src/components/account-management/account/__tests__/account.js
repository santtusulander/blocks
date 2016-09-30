import React from 'react'
import {shallow} from 'enzyme'

if (![].includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}

jest.unmock('../account.jsx')
import Account from '../account.jsx'

const fakeRouter = {
  setRouteLeaveHook: jest.fn()
}

const fakeFields = {
  accountName: {value: "foo"},
  accountType: {value: 2}
}

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('AccountManagementAccountDetails', () => {
  it('should exist', () => {
    const details = shallow(
      <Account router={fakeRouter} fields={fakeFields} intl={intlMaker()} />
    )
    expect(details.length).toBe(1)
  })
})
