import { createAction } from 'redux-actions'
import * as actionTypes from './actionTypes'
import { PROGRESS } from './uploader/events'

const uploadActionParser = (name, { lengthComputable, loaded, total, type }) => {
  debugger
  return type === PROGRESS ?
    {[name]: { type, progress: lengthComputable ? parseInt(loaded / total * 100) : 0 }} :
    // {[name]: { type }}
    { name, type }
}

/*{
  switch (type) {
    case 'progress':
      const progress = lengthComputable ? parseInt(loaded / total * 100) : 0

      return { [name]: { progress, type }}
    case 'load':
    case 'abort':
    case 'error':
      return { [name]: { status: type }}
  }
}*/
export default {
  [actionTypes.UPLOAD_FILE]: createAction(actionTypes.UPLOAD_FILE, uploadActionParser),
  [actionTypes.UPLOAD_FINISHED]: createAction(actionTypes.UPLOAD_FINISHED, uploadActionParser),
  [actionTypes.UPLOAD_FAILURE]: createAction(actionTypes.UPLOAD_FAILURE, uploadActionParser),
  [actionTypes.UPLOAD_CANCELLED]: createAction(actionTypes.UPLOAD_CANCELLED, uploadActionParser)
}

