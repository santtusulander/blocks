import Immutable from 'immutable';

jest.unmock('../security.js')

const {
  activeCertificatesToggled,
  certificateToEditChanged
} = require('../security.js');

describe('Security Module', () => {

  it('should handle certificate to edit change', () => {
    const state = Immutable.fromJS({
      certificateToEdit: null
    });
    const newState = certificateToEditChanged(state, {payload: 1});
    expect(newState.get('certificateToEdit')).toBe(1);
  });

  it('should handle active certificates toggled', () => {
    const state = Immutable.fromJS({
      activeCertificates: []
    });
    const newState = activeCertificatesToggled(state, {payload: 1});
    expect(newState.get('activeCertificates').get(0)).toBe(1);
  });

});
