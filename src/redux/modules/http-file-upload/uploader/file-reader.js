/**
 * Static class represents file reader instance
 */
export default class Reader {
  static get displayName() {
    return 'File Reader'
  }

  /**
   * Get File Object (Blob) and resolve as it is
   * @param file {File} - HTML File object
   * @returns {Promise}
   */
  static readFile(file) {
    return new Promise(resolve => {
      resolve({ [ file.name ]: file })
    })
  }
}
