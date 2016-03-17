import {createAction, handleActions} from 'redux-actions'
import Immutable from 'immutable'

const UI_THEME_CHANGED = 'UI_THEME_CHANGED'
const UI_CHART_VIEW_TOGGLED = 'UI_CHART_VIEW_TOGGLED'
const UI_CHANGE_NOTIFICATION = 'UI_CHANGE_NOTIFICATION'

const theme = localStorage.getItem('EricssonUDNUiTheme') ?
  localStorage.getItem('EricssonUDNUiTheme') : 'dark'

const docBody = document.body

/* We are manipulating body class with JS, which is not exactly how React
   is usually handling things, but in this case it seems to be the most
   clean and usable way to handle theme changing for this app */

docBody.className += theme + '-theme'

const defaultUI = Immutable.Map({
  theme: theme,
  viewingChart: true,
  notification: ''
})

// REDUCERS

export default handleActions({
  UI_THEME_CHANGED: (state, action) => {
    docBody.className = docBody.className.replace(
      /dark-theme|light-theme/gi, action.payload + '-theme'
    )
    localStorage.setItem('EricssonUDNUiTheme', action.payload)
    return state.set('theme', action.payload)
  },
  UI_CHART_VIEW_TOGGLED: (state) => {
    return state.set('viewingChart', !state.get('viewingChart'))
  },
  UI_CHANGE_NOTIFICATION: (state, action) => {
    return state.set('notification', action.payload)
  }
}, defaultUI)

// ACTIONS

export const changeTheme = createAction(UI_THEME_CHANGED)
export const toggleChartView = createAction(UI_CHART_VIEW_TOGGLED)
export const changeNotification = createAction(UI_CHANGE_NOTIFICATION)
