import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../error-modal.jsx')
const ErrorModal = require('../error-modal.jsx')

describe('ErrorModal', () => {
  it('should exist', () => {
    let modal = TestUtils.renderIntoDocument(
      <ErrorModal />
    );
    expect(TestUtils.isCompositeComponent(modal)).toBeTruthy();
  });
})
