import {createAction, handleActions} from 'redux-actions'
import Immutable from 'immutable'

const UI_THEME_CHANGED = 'UI_THEME_CHANGED'
const UI_CHART_VIEW_TOGGLED = 'UI_CHART_VIEW_TOGGLED'
const UI_CHANGE_NOTIFICATION = 'UI_CHANGE_NOTIFICATION'
const UI_ANALYSIS_SERVICE_TYPE_TOGGLED = 'UI_ANALYSIS_SERVICE_TYPE_TOGGLED'
const UI_ANALYSIS_ON_OFF_NET_CHART_CHANGED = 'UI_ANALYSIS_ON_OFF_NET_CHART_CHANGED'
const UI_ANALYSIS_SP_CHART_CHANGED = 'UI_ANALYSIS_SP_CHART_CHANGED'
const UI_CONTENT_ITEM_SORTED = 'UI_CONTENT_ITEM_SORTED'
const UI_ACCOUNT_MANAGEMENT_MODAL_TOGGLED = 'UI_ACCOUNT_MANAGEMENT_MODAL_TOGGLED'

const UI_SHOW_ERROR_DIALOG = 'UI_SHOW_ERROR_DIALOG'
const UI_HIDE_ERROR_DIALOG = 'UI_HIDE_ERROR_DIALOG'

const theme = localStorage.getItem('EricssonUDNUiTheme') ?
  localStorage.getItem('EricssonUDNUiTheme') : 'dark'

export const docBody = document.body

/* We are manipulating body class with JS, which is not exactly how React
   is usually handling things, but in this case it seems to be the most
   clean and usable way to handle theme changing for this app */

docBody.className += theme + '-theme'

export const defaultUI = Immutable.fromJS({
  accountManagementModal: null,
  contentItemSortDirection: 1,
  contentItemSortValuePath: ['metrics', 'totalTraffic'],
  theme: theme,
  viewingChart: true,
  notification: '',
  analysisOnOffNetChartType: 'bar',
  analysisServiceTypes: ['http', 'https'],
  analysisSPChartType: 'bar',
  showErrorDialog: false
})

// REDUCERS

export function accountManagementModalToggled(state, action) {
  return state.merge({ accountManagementModal: action.payload })
}

export function themeChanged(state, action) {
  docBody.className = docBody.className.replace(
    /dark-theme|light-theme/gi, action.payload + '-theme'
  )
  localStorage.setItem('EricssonUDNUiTheme', action.payload)
  return state.set('theme', action.payload)
}

export function chartViewToggled(state) {
  return state.set('viewingChart', !state.get('viewingChart'))
}

export function notificationChanged(state, action) {
  return state.set('notification', action.payload)
}

export function analysisServiceTypeToggled(state, action) {
  let newServiceTypes = state.get('analysisServiceTypes')
  if(newServiceTypes.includes(action.payload)) {
    newServiceTypes = newServiceTypes.filter(type => type !== action.payload)
  }
  else {
    newServiceTypes = newServiceTypes.push(action.payload)
  }
  return state.set('analysisServiceTypes', newServiceTypes)
}

export function analysisOnOffNetChartChanged(state, action) {
  return state.set('analysisOnOffNetChartType', action.payload)
}

export function analysisSPChartChanged(state, action) {
  return state.set('analysisSPChartType', action.payload)
}

export function contentItemSorted(state, action) {
  return state.merge({
    contentItemSortDirection: action.payload.direction,
    contentItemSortValuePath: action.payload.valuePath
  })
}

export function errorDialogShown(state) {
  return state.set('showErrorDialog', true);
}

export function errorDialogHidden(state) {
  return state.set('showErrorDialog', false);
}

export default handleActions({
  UI_ACCOUNT_MANAGEMENT_MODAL_TOGGLED: accountManagementModalToggled,
  UI_THEME_CHANGED: themeChanged,
  UI_CHART_VIEW_TOGGLED: chartViewToggled,
  UI_CHANGE_NOTIFICATION: notificationChanged,
  UI_ANALYSIS_SERVICE_TYPE_TOGGLED: analysisServiceTypeToggled,
  UI_ANALYSIS_ON_OFF_NET_CHART_CHANGED: analysisOnOffNetChartChanged,
  UI_ANALYSIS_SP_CHART_CHANGED: analysisSPChartChanged,
  UI_CONTENT_ITEM_SORTED: contentItemSorted,
  UI_SHOW_ERROR_DIALOG: errorDialogShown,
  UI_HIDE_ERROR_DIALOG: errorDialogHidden
}, defaultUI)

// ACTIONS

export const changeTheme = createAction(UI_THEME_CHANGED)
export const toggleChartView = createAction(UI_CHART_VIEW_TOGGLED)
export const changeNotification = createAction(UI_CHANGE_NOTIFICATION)
export const toggleAccountManagementModal = createAction(UI_ACCOUNT_MANAGEMENT_MODAL_TOGGLED)
export const toggleAnalysisServiceType = createAction(UI_ANALYSIS_SERVICE_TYPE_TOGGLED)
export const changeOnOffNetChartType = createAction(UI_ANALYSIS_ON_OFF_NET_CHART_CHANGED)
export const changeSPChartType = createAction(UI_ANALYSIS_SP_CHART_CHANGED)
export const sortContentItems = createAction(UI_CONTENT_ITEM_SORTED)
export const showErrorDialog = createAction(UI_SHOW_ERROR_DIALOG)
export const hideErrorDialog = createAction(UI_HIDE_ERROR_DIALOG)
