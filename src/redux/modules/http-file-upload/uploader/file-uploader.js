import FileDialog from './file-dialog'
import Reader from './file-reader'
import * as api from '../api'

const _accessKey = Symbol('accessKey')
const _progressHandler = Symbol('progressHandler')

class Uploader {
  static get displayName() {
    return 'httpFileUploader'
  }

  static modelGetter(instance) {
    return (prop) => instance[prop]
  }

  static initialize(accessKey) {
    if (!arguments.length || [...arguments].includes(undefined)) {
      throw new Error(`${Uploader.displayName} initialization failed`)
    }

    return new Uploader(accessKey)
  }

  constructor(accessKey) {
    this[_accessKey] = accessKey
    this[_progressHandler] = ()=>{}

    this.openFileDialog = this.openFileDialog.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
    this.processFiles = this.processFiles.bind(this)
  }

  get accessKey() {
    return this[_accessKey]
  }

  get onProgress() {
    return this[_progressHandler]
  }

  set onProgress(cb) {
    this[_progressHandler] = cb
  }

  uploadFile(file) {
    api.uploadFile(this.accessKey, file, this.onProgress)
  }

  /**
   * Read and upload files if file uploader initiated
   * @param files {[]} - files to read and upload
   */
  processFiles(files) {
    [...files].forEach(file => Reader.readFile(file).then(this.uploadFile))
  }

  /**
   * open Browser File Dialog
   */
  openFileDialog() {
    FileDialog.open().then(this.processFiles)
  }

}

export default { initialize: Uploader.initialize }
