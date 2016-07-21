import React from 'react';
import { Input, Table, Button } from 'react-bootstrap'
import {storiesOf} from '@kadira/storybook';
import {reducer as form} from 'redux-form'
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'

import ActionLinks from '../account-management/action-links.jsx'
import InlineAdd from '../inline-add.jsx'

const stateReducer = combineReducers({ form })
const store = createStore(stateReducer)
const ThemeWrap = require('./theme-wrap.jsx')
const users = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
/**
 * Each sub-array contains elements per <td>.
 * The style-field is meant for positional styling of the element. To get values from input fields,
 * the input elements' IDs must match the field prop's array items.
 */
const addRowInputs = [
  [
    { input: <Input id='a' type="text"/>, style: { float: 'left' } },
    { input: <Button>Do something</Button>, style: { float: 'right' } }
  ],
  [
    { input: <Input id='b' type="text"/>, style: { float: 'left' } },
    { input: <Input id='c' type="text"/>, style: { float: 'right' } }
  ],
  []
]

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
              <th width="30%">NAME</th>
              <th width="30%">ROLE</th>
              <th width="30%">EMAIL</th>
              <th width="8%"></th>
            </tr>
          </thead>
          <tbody>
            {
             <InlineAdd
              validate={({ a, b, c }) => {
                let errors = {}
                if( a && a.length > 1) {
                  errors.a = 'insert validation'
                }
                if( b && b.length > 1) {
                  errors.b = 'insert validation'
                }
                if( c && c.length > 3) {
                  errors.c = 'insert validation'
                }
                return errors
              }}
              fields={['a', 'b', 'c']}
              inputs={addRowInputs}
              cancel={() => {}}
              save={vals => console.log(vals)}/>
            }
            {users.map((user, index) => {
              return (
                <tr key={index}>
                  <td>aaa</td>
                  <td>bbb</td>
                  <td>ccc</td>
                  <td>
                    <ActionLinks
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
