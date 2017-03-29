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
    input.style.display = 'none'

    return input
  }

  /**
   * Check Browser support of DOM event constructor pattern.
   * Currently not supported by IE11 only.
   * @returns {boolean}
   */
  static get isIE() {
    return !(typeof window.Event === 'function')
  }

  /**
   * Create 'click' DOM event
   * @return {MouseEvent}
   */
  static get clickEvent() {
    const eventType = 'click'
    let clickEvent = null

    if (FileDialog.isIE) {
      /* IE@11 workaround https://msdn.microsoft.com/library/dn905219(v=vs.85).aspx */
      clickEvent = document.createEvent("MouseEvents")
      clickEvent.initMouseEvent(eventType, true, true, "window", 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    } else {
      clickEvent = new MouseEvent(eventType, { view: window, bubbles: true, cancelable: true })
    }

    return clickEvent
  }

  /**
   * Open Browser file upload dialog
   * @return {Promise} - resolved promise with files payload
   */
  open() {
    const { inputElement, clickEvent, isIE } = FileDialog

    if (isIE) {
      document.body.appendChild(inputElement)
    }

    return new Promise(resolve => {
      const changeEvent = 'change'
      const handler = () => resolve(inputElement.files)
      inputElement.addEventListener(changeEvent, handler)
      inputElement.dispatchEvent(clickEvent)

      if (isIE) {
        document.body.removeChild(inputElement)
      }
    })
  }
}
