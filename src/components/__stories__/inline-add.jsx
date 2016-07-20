import React from 'react';
import { Input } from 'react-bootstrap'
import {storiesOf, action} from '@kadira/storybook';
import {reducer as form} from 'redux-form'
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'

import ActionLinks from '../account-management/action-links.jsx'
import InlineAdd from '../inline-add.jsx'

const stateReducer = combineReducers({ form })
const store = createStore(stateReducer)
const ThemeWrap = require('./theme-wrap.jsx')
const users = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
storiesOf('Inline Add', module)
  .addDecorator((story) => (
    <ThemeWrap>
      <Provider {...{ store }}>
        {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('Default', () => (
    <table className="table table-striped cell-text-left">
        <thead >
          <tr>
            <th width="30%">NAME</th>
            <th width="30%">ROLE</th>
            <th width="30%">EMAIL</th>
            <th width="8%"></th>
          </tr>
        </thead>
        <tbody>
        <InlineAdd
            validate={({ a }) => {
              let errors = {}
              if( a && a.length > 3) {
                errors.a = 'no go'
              }
              return errors
            }}
            fields={['a', 'b', 'c']}
            inputs={[[ <Input id='a' className="half" type="text"/> ], [ <Input id='b' type="text"/>, <Input id='c' type="text"/> ], []]}
            cancel={action('cancel pressed')}
            save={vals => console.log(vals)}/>
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
      </table>
  ))
