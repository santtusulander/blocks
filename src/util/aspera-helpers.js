// eslint-disable-next-line import/no-unresolved
const AW_CORE = require('exports?AW4!../assets/js/asperaweb-4.min.js')
// eslint-disable-next-line import/no-unresolved
const AW_CONNECT = require('exports?AW4!../assets/js/connectinstaller-4.min.js')

export const AW4 = Object.assign({}, AW_CORE, AW_CONNECT);
export const ASPERA_MIN_VER = "3.6.0"
export const ASPERA_DOWNLOAD_URL = "http://downloads.asperasoft.com/connect2/"
export const ASPERA_TROUBLESHOOT_URL = "https://test-connect.asperasoft.com/"
export const ASPERA_CONNECT_INSTALLER =  "//d3gcli72yxqn2z.cloudfront.net/connect/v4";


export class Aspera {
  constructor(containerId, dragDropEnabled) {
    /* This SDK location should be an absolute path, it is a bit tricky since the usage examples
     * and the install examples are both two levels down the SDK, that's why everything works
     */
    this.asperaWeb = new AW4.Connect({
      sdkLocation: ASPERA_CONNECT_INSTALLER,
      minVersion: ASPERA_MIN_VER,
      dragDropEnabled: dragDropEnabled,
      id: containerId
    });

    this.asperaInitConnect = this.asperaInitConnect.bind(this)
    this.asperaDeInitConnect = this.asperaDeInitConnect.bind(this)
    this.asperaDragAndDropSetup = this.asperaDragAndDropSetup.bind(this)

    this.asperaStartTransfer = this.asperaStartTransfer.bind(this)
    this.asperaCancelTransfer = this.asperaCancelTransfer.bind(this)

    this.asperaGetAllTransfers = this.asperaGetAllTransfers.bind(this)
  }

  /**
   * @description Initiates Aspera
   *
   * @param statusFunctions (objects) - functions that will process init events
   *        - showLaunching Should display a banner in the top of the screen explaining the user that Aspera Connect is trying to be launched.
   *        - showDownload Should display a banner in the top of the screen urging the user to download Aspera Connect.
   *        - showUpdate Should display a banner in the top of the screen urging the user to update Aspera Connect to the latest version.
   *        - connected Should display a temporary message that connect has been found, and after timeout dismisses the banner
   *
   * @returns {void}
   */
  asperaInitConnect(statusFunctions) {
    // eslint-disable-next-line no-unused-vars
    const asperaInstaller = new AW4.ConnectInstaller({
      sdkLocation: ASPERA_CONNECT_INSTALLER
    });

    const statusEventListener = function (eventType, data) {
      if (eventType === AW4.Connect.EVENT.STATUS && data == AW4.Connect.STATUS.INITIALIZING) {
        statusFunctions.showLaunching();
      } else if (eventType === AW4.Connect.EVENT.STATUS && data == AW4.Connect.STATUS.FAILED) {
        statusFunctions.showDownload();
      } else if (eventType === AW4.Connect.EVENT.STATUS && data == AW4.Connect.STATUS.OUTDATED) {
        statusFunctions.showUpdate();
      } else if (eventType === AW4.Connect.EVENT.STATUS && data == AW4.Connect.STATUS.RUNNING) {
        statusFunctions.connected();
      }
    };

    this.asperaWeb.addEventListener(AW4.Connect.EVENT.STATUS, statusEventListener);
    this.asperaWeb.sessionID = this.asperaWeb.initSession();
  }

  /**
   * @description Unsubscribe from Aspera Web events.
   *              If type is not specified, all versions of the listener with different types will be removed.
   *              If listener is not specified, all listeners for the type will be removed.
   *              If neither type nor listener are specified, all listeners will be removed.
   *
   * @param type (AW4.Connect.EVENT) – (optional) The type of event to stop receiving events for.
   * @param listener (Function) – (optional) The function used to subscribe in [[AW4.Connect#addEventListener]].
   *
   *
   * @returns {boolean}:
   *            true : if we could find a listener for the parameters provided
   *            false : if we could not find a listener for the parameters provided
   */
  asperaDeInitConnect(type, listener) {
    return this.asperaWeb.removeEventListener(type, listener)
  }

  /**
   * @description Sets drag and drop options for the element given in the cssSelector.
   *              Please note that dragDropEnabled option must have been set to true
   *              when instantiating Aspera Connect object.
   *
   * @param cssSelector (String) – CSS selector for drop targets
   * @param options (object) – (optional) Drag and drop options for these targets
   * @param listener (Function) – Function to be called when each of the event occurs
   *
   *
   * @returns {object}:
   *            event (object): DOM Event object as implemented by the browser.
   *            files (object): List of files. This is only valid on drop events.
   */
  asperaDragAndDropSetup(cssSelector, listener, options) {
    const dropEventsConfig = options || {
      dragEnter: true,
      dragOver: true,
      dragLeave: true,
      drop: true
    }

    this.asperaWeb.setDragDropTargets(cssSelector, dropEventsConfig, listener)
  }

  /**
   * @description Initiates a single transfer. Call asperaGetAllTransfers to get transfer statistics
   *
   * @param transferSpec (object) – Transfer parameters
   * @param asperaConnectSettings (object) – Aspera Connect options
   * @param callbacks (object) – success and error functions to receive results.
   *        This call is successful if Connect is able to start the transfer.
   *        Note that an error could still occur after the transfer starts, e.g. if authentication fails.
   *        Use [[AW4.Connect#addEventListener]] to receive notification about errors that occur during a transfer session.
   *        This call fails if validation fails or the user rejects the transfer.
   * @param files (object) - list of files to transfer
   *
   * @returns {object} with request_id, which is returned immediately, may be for matching this transfer with its events.
   */
  asperaStartTransfer(transferSpec, connectSettings, callbacks, files) {

    for (let i = 0, length = files.length; i < length; i++) {
      transferSpec.paths.push({ "source": files[i].name });
    }

    if (transferSpec.paths.length === 0) {
      return;
    }

    return this.asperaWeb.startTransfer(transferSpec, connectSettings, callbacks)
  }

  /**
   * @description Remove the transfer - terminating it if necessary
   *
   * @param transferId (String) – The ID (uuid) of the transfer to delete.
   * @param callbacks (Object) – success and error functions to receive results.
   *
   *
   * @returns {object} with removed transfer info.
   */
  asperaCancelTransfer(transferId, callbacks) {
    return this.asperaWeb.removeTransfer(transferId, callbacks)
  }

  /**
   * @description Get statistics for all transfers.
   *
   * @param callbacks (Object) – success and error functions to receive results.
   * @param iterationToken (String) – (optional) If specified, return only transfers that have had activity since the last call.
   *
   *
   * @returns {object} with statistics for all the existing transfers.
   */
  asperaGetAllTransfers(callbacks, iterationToken) {
    return this.asperaWeb.getAllTransfers(callbacks, iterationToken)
  }

  /**
   * @description Displays a file browser dialog for the user to select files.
   *
   * @param callbacks (Object) – success and error functions to receive results.
   * @param options (Object) – (optional) File chooser options:
   *        - allowedFileTypes (FileFilters): Filter the files displayed by file extension.
   *        - allowMultipleSelection (Boolean): Allow the selection of multiple files. Default: true.
   *        - title (String): The name of the dialog window.
   *
   *
   * @returns {object} that holds the data of the files that have been selected by the user.
   */
  asperaShowSelectFileDialog(callbacks, options) {
    return this.asperaWeb.showSelectFileDialog(callbacks, options)
  }

  /**
   * @description Displays a file browser dialog for the user to select directories.
   *
   * @param callbacks (Object) – success and error functions to receive results.
   * @param options (Object) – (optional) Directory chooser options:
   *        - allowMultipleSelection (Boolean): Allow the selection of multiple folders. Default: true.
   *        - title (String): The name of the dialog window.
   *
   *
   * @returns {object} that holds the data of the files that have been selected by the user.
   */
  asperaShowSelectFolderDialog(callbacks, options) {
    return this.asperaWeb.showSelectFolderDialog(callbacks, options)
  }
}
