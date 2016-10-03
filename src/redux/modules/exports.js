import {createAction} from 'redux-actions'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

//import { BASE_URL_AAA, mapReducers, parseResponseData } from '../util'

const EXPORTS_SHOW_DIALOG = 'EXPORTS_SHOW_DIALOG'
const EXPORTS_HIDE_DIALOG = 'EXPORTS_HIDE_DIALOG'
const EXPORTS_DOWNLOAD_FILE = 'EXPORTS_DOWNLOAD_FILE'
const EXPORTS_SEND_EMAIL = 'EXPORTS_SEND_EMAIL'

const defaultState = Immutable.Map({
  dialogVisible: false,
  exportType: 'export_pdf'
});


// ACTIONS
export const exportsShowDialog = createAction(EXPORTS_SHOW_DIALOG)
export const exportsHideDialog = createAction(EXPORTS_HIDE_DIALOG);

export const exportsDownloadFile = createAction(EXPORTS_DOWNLOAD_FILE, (exportParams) => {

  /* TODO: Make API call similar to this
  return axios.post(`${BASE_URL_AAA}/brands/${brand}/accounts`, {}, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(parseResponseData)
  */

  return Promise.resolve(exportParams)
    .then( (res) => {
      console.log('ACTION: exportDownloadFile() -- params:', exportParams)
      return res;
    });
})

export const exportsSendEmail = createAction(EXPORTS_SEND_EMAIL, (exportParams) => {

  /* TODO: Make API call
  //
  */

  return Promise.resolve(exportParams)
    .then( (res) => {
      console.log('ACTION: exportSendEmail() -- params:', exportParams)
      return res;
    });

})


//REDUCERS
export function showDialog(state, action) {
  let payload = Immutable.fromJS(action.payload)
  payload = payload.set('dialogVisible', true)

  return state.merge( payload );
}

export function hideDialog(state) {
  return state.set('dialogVisible',false)
}

export function downloadFile(state, action) {
  console.log( 'REDUCER: downloadFile() -- action:', action)

  return state
}

export function sendEmail(state, action) {
  console.log( 'REDUCER: sendEmail() -- action:', action)

  return state
}

export default handleActions({
  EXPORTS_SHOW_DIALOG: showDialog,
  EXPORTS_HIDE_DIALOG: hideDialog,
  EXPORTS_DOWNLOAD_FILE: downloadFile,
  EXPORTS_SEND_EMAIL: sendEmail
}, defaultState )
