import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../storage-usage.jsx')
import AnalysisStorageUsage from '../storage-usage.jsx'

// no test case using this fake data yet
// const fakeData = [
//   {
//     timestamp: 1459468800,
//     bytes: 6531816426588
//   },
//   {
//     timestamp: 1459555200,
//     bytes: 3531816426500
//   },
//   {
//     timestamp: 1459641600,
//     bytes: 9367492184905
//   }
// ]

describe('AnalysisStorageUsage', () => {
  it('should exist', () => {
    let storage = shallow(
      <AnalysisStorageUsage fetching={true} />
    );
    expect(storage).toBeTruthy();
  });
});
