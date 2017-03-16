/**
 * @class represents FileDialog instance.
 */
export default new class FileDialog {
  /**
   * Get display name
   * @return {string}
   */
  static get displayName() {
    return 'FileDialog'
  }

  /**
   * Create HTML input element
   * @return {HTMLElement}
   */
  static get inputElement() {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('multiple', '')

    return input
  }

  /**
   * Create 'click' event
   * @return {MouseEvent}
   */
  static get clickEvent() {
    const event = 'click'

    return new MouseEvent(event, {
      'view': window,
      'bubbles': true,
      'cancelable': true
    })
  }

  /**
   * Open Browser file upload dialog
   * @return {Promise} - resolved promise with files payload
   */
  open() {
    const { clickEvent, inputElement } = FileDialog

    return new Promise(resolve => {
      const event = 'change'
      const handler = () => resolve(inputElement.files)

      inputElement.addEventListener(event, handler, false)
      inputElement.dispatchEvent(clickEvent)
    })
  }
}
