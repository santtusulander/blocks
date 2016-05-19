const Immutable = require('immutable');

jest.dontMock('../exports.js')

const {
  showDialog,
  hideDialog,
  downloadFile,
  sendEmail,
} = require('../exports.js');

describe('Exports Module', () => {
  it('should show dialog', () => {
    const newState = showDialog(Immutable.Map(), {payload: {} });
    expect(newState.get('dialogVisible')).toBe(true);
  });

  it('should hide dialog', () => {
    const newState = hideDialog(Immutable.Map(), {payload: {} });
    expect(newState.get('dialogVisible')).toBe(false);
  });

  it('should download', ()=> {

  });
  
  it('should send email', ()=> {

  });
});
