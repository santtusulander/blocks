import FileDialog from './file-dialog'
import Reader from './file-reader'
import * as api from '../api'

/**
 * _accessKey, _uploadHandlers, _gateway - using Symbols as private members of Uploader
 * @type {Symbol}
 * @private
 */
const _accessKey = Symbol('accessKey')
const _uploadHandlers = Symbol('uploadHandlers')
const _gateway = Symbol('gateway')
const _uploadPath = Symbol('uploadPath')
/**
 * Represents file Uploader instance,
 * exposes public API for open file dialog,
 * read and upload files
 */
class Uploader {
  static get displayName() {
    return 'httpFileUploader'
  }

  /**
   * Initialize and return new Uploader instance
   * @param accessKey {string} - upload access key
   * @param gateway {string} - gateway host
   * @param uploadHandlers {object} - handlers wrapper
   * @param uploadPath {string} - upload path
   * @returns {Uploader}
   */
  static initialize(accessKey, gateway, uploadHandlers, uploadPath) {
    if (!arguments.length || [...arguments].includes(undefined)) {
      throw new Error(`${Uploader.displayName} initialization failed`)
    }

    return new Uploader(accessKey, gateway, uploadHandlers, uploadPath)
  }

  constructor(accessKey, gateway, uploadHandlers, uploadPath) {
    this[_accessKey] = accessKey
    this[_uploadHandlers] = uploadHandlers
    this[_gateway] = gateway
    this[_uploadPath] = uploadPath

    this.openFileDialog = this.openFileDialog.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
    this.processFiles = this.processFiles.bind(this)
  }

  get accessKey() {
    return this[_accessKey]
  }

  get gateway() {
    return this[_gateway]
  }

  get uploadHandlers() {
    return this[_uploadHandlers]
  }

  get uploadPath() {
    return this[_uploadPath]
  }

  /**
   * Upload file via API
   * @param file {File} - HTML File object to upload
   */
  uploadFile(file) {
    api.uploadFile(this.accessKey, this.gateway, file, this.uploadHandlers, this.uploadPath)
  }

  /**
   * Read and upload files
   * @param files []
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

/**
 * @export @static initialize method to create Uploader instance
 */
export default { initialize: Uploader.initialize }
