// 
//
// jest.dontMock('../account.js')
// jest.dontMock('redux-actions')
//
// let axios = require('axios')
// axios.post = jest.genMockFunction().mockImplementation(function() {
//   return {
//     then: jest.genMockFunction()
//   };
// })
//
// const {createAccount, deleteAccount, fetchAccount, fetchAccounts, updateAccount, startFetching} = require('../account.js')
//
// describe('Account Module', () => {
//   it('should have a create action', () => {
//     createAccount('aaa')
//     expect(axios.post.mock.calls[0][0]).toBe('http://localhost:3000/VCDN/v2/aaa/accounts')
//   });
  // it('should have a delete action', () => {
  //   console.log(deleteAccount)
  // });
  // it('should have a fetch one action', () => {
  //   console.log(fetchAccount)
  // });
  // it('should have a fetch all action', () => {
  //   console.log(fetchAccounts)
  // });
  // it('should have an update action', () => {
  //   console.log(updateAccount)
  // });
  // it('should have a start fetch action', () => {
  //   console.log(startFetching)
  // });
// })
