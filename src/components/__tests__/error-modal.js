import React from 'react'
import { Button } from 'react-bootstrap'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

import { shallow, render, mount } from 'enzyme';

jest.dontMock('../error-modal.jsx')
const ErrorModal = require('../error-modal.jsx')

function uiActionsMaker(){
  return {
    showErrorDialog: jest.genMockFunction(),
    hideErrorDialog: jest.genMockFunction(),
  }
}

describe('ErrorModal', () => {
  it('should exist', () => {


    const modal = shallow(<ErrorModal />)

    expect(modal.find('Modal').length).toBe(1);
  });

  it('should call hideErrorDialog when close clicked', () => {
    const uiActions = uiActionsMaker()

    let modal = shallow(
      <ErrorModal uiActions={uiActions} />
    );


    let btns = modal.find('Button');

    //should have 2 buttons (Close / Reload)
    expect(btns.length).toBe(2);

    btns.first().simulate('click');
    expect(uiActions.hideErrorDialog.mock.calls.length).toBe(1)

  })
})

