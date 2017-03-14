/**
 * Static class represents file reader instance
 */
export default class Reader {
  static get displayName() {
    return 'File Reader'
  }

  /**
   * Read file content as binary data
   * @param file {File} - HTML File object
   * @returns {Promise}
   */
  static readFile(file) {
    return new Promise(resolve => {
      const e = 'load'
      const reader = new FileReader()

      const handler = () => {
        resolve({ [ file.name ]: reader.result })
        reader.removeEventListener(e, handler)
      }

      reader.addEventListener(e, handler)
      reader.readAsBinaryString(file)
    })
  }
}
