const Immutable = require('immutable');

jest.dontMock('../account.js')

const {
  createSuccess,
  deleteSuccess,
  deleteFailure,
} = require('../account.js');

describe('Account Module', () => {

  it('should create account succeed', () => {
    const state = Immutable.Map({
      allAccounts: Immutable.List()
    });
    const newState = createSuccess(state, {payload: {account_id: 1}});
    const expectedState = Immutable.fromJS({
      allAccounts: [1],
      activeAccount: {account_id: 1}
    })
    expect(Immutable.is(newState, expectedState)).toBeTruthy();
  });

  it('should delete account succeed', () => {
    const state = Immutable.Map({
      allAccounts: Immutable.List.of(1)
    });
    const newState = deleteSuccess(state, {payload: {id: 1}});
    expect(newState.get('allAccounts')).not.toContain(1);
    expect(newState.get('fetching')).toBeFalsy();
  });

  it('should delete account fail', () => {
    const state = Immutable.Map({
      allAccounts: Immutable.List.of(1)
    });
    const newState = deleteFailure(state, {payload: {id: 1}});
    expect(newState.get('allAccounts')).toContain(1);
    expect(newState.get('fetching')).toBeFalsy();
  });

});
