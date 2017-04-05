import React from 'react';
import { Input, Table, Button } from 'react-bootstrap'
import { storiesOf, action } from '@kadira/storybook';
import { reducer as form } from 'redux-form'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import SelectWrapper from '../shared/form-elements/select-wrapper.jsx'
import ActionButtons from '../shared/action-buttons.jsx'
import InlineAdd from '../shared/page-elements/inline-add.jsx'

const stateReducer = combineReducers({ form })
const store = createStore(stateReducer)
const ThemeWrap = require('./theme-wrap.jsx')
const users = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
/**
 * Each sub-array contains elements per <td>. If no elements are needed for a <td>, insert empty array [].
 * The positionClass-field is meant for positioning the div that wraps the input element and it's tooltip.
 * To get values from input fields, the input elements' IDs must match the field prop's array items.
 */
const inlineAddInputs = [
  [
    { input: <Input id='a' placeholder=" Name" type="text"/>, positionClass: 'half-width-item left' },
    { input: <Button>Do something</Button>, positionClass: 'trailing-item'}
  ],
  [
    { input: <Input id='b' placeholder=" Some" type="text"/>, positionClass: 'half-width-item left' },
    { input: <Input id='c' placeholder=" Things" type="text"/>, positionClass: 'half-width-item right' }
  ],
  [ {
    input: <SelectWrapper
        id='d'
        numericValues={true}
        className=" inline-add-dropdown"
        options={[1, 2, 3 ,4, 5].map(item => [item, item])}/>
    , positionClass: 'left'
  } ],
  []
]

function validateInlineAdd({ a, b, c }) {
  let errors = {}
  if( a && a.length > 0) {
    errors.a = 'insert validation'
  }
  if( b && b.length > 0) {
    errors.b = 'insert validation'
  }
  if( c && c.length > 0) {
    errors.c = 'insert validation'
  }
  return errors
}

storiesOf('Inline Add', module)
  .addDecorator((story) => (
    <ThemeWrap>
      <Provider {...{ store }}>
        {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('Default', () => (
    <div className="tab-bodies">
    <div className="account-management-account-users">
        <Table striped={true}>
          <thead >
            <tr>
              <th>Email</th>
              <th>Password</th>
              <th>Role</th>
              <th>Groups</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <InlineAdd
              validate={validateInlineAdd}
              fields={['a', 'b', 'c', 'd']}
              inputs={inlineAddInputs}
              cancel={() => {}}
              unmount={() => action('will unmount!')}
              save={vals => action(vals)}/>
            {users.map((user, index) => {
              return (
                <tr key={index}>
                  <td>aaa</td>
                  <td>bbb</td>
                  <td>ccc</td>
                  <td>
                    <ActionButtons
                      onEdit={() => {}}
                      onDelete={() => {}}/>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
      </div>
  ))
