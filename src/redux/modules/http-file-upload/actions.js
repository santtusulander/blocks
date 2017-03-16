import { createAction } from 'redux-actions'
import { UPLOAD_FILE } from './actionTypes'

const uploadActionParser = (name, { lengthComputable, loaded, total }) => {
  const progress = lengthComputable ? parseInt(loaded / total * 100) : 0

  return { [name]: { progress, status }}
}

export default {
  [UPLOAD_FILE]: createAction(UPLOAD_FILE, uploadActionParser)
}

