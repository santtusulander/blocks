import Immutable from 'immutable';

jest.unmock('../security.js')

const {
  activeCertificatesToggled
} = require('../security.js');

describe('Security Module', () => {

  it('should handle active certificates toggled', () => {
    const state = Immutable.fromJS({
      activeCertificates: []
    });
    const newState = activeCertificatesToggled(state, {payload: 1});
    expect(newState.get('activeCertificates').get(0)).toBe(1);
  });

});
