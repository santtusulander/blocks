import Raven from 'raven-js';

export default function createMiddleware(dsn, cfg={}, options={}) {
  /*
    Function that generates a crash reporter for Sentry.

    dsn - private Sentry DSN.
    cfg - object to configure Raven.
    options - customize extra data sent to sentry
      actionTransformer - tranform the action object to send; default to identity function
      stateTransformer - transform the state object to send; default to identity function
      logger - the logger to use for logging; default to console.error
  */
  if (!Raven.isSetup()) {
    if (!dsn) {
      // Skip this middleware if there is no DSN.
      /* eslint-disable no-console */
      console.error('[redux-raven-middleware] Sentry DSN required.');
      return () => next => action => {
        next(action);
      };
    }
    Raven.config(dsn, cfg).install();
  }

  return store => next => action => {
    const {
      logger = console.error.bind(console, '[redux-raven-middleware] Reporting error to Sentry:')
    } = options;
    try {
      Raven.captureBreadcrumb({
        category: 'redux',
        message: action.type
      });

      return next(action);
    } catch (err) {
      logger(err);

      captureAndShowRavenError(store, err, action, false)

    }
  }
}

export const captureAndShowRavenError = (store, err, action = null, recoverable = false) => {

  /**
  * Send error to Sentry.io
  * but remove traffic & metrics from state (to avoid 413 request entity too large error)
  */
  const loggedState = store.getState()
  delete loggedState.visitors
  delete loggedState.traffic
  delete loggedState.metrics
  delete loggedState.topo

  //if currentUser set
  const currentUserEmail = loggedState.user.getIn(['currentUser', 'email'])
  if (currentUserEmail) {
    Raven.setUserContext({
      email: currentUserEmail
    })
  } else {
    Raven.setUserContext()
  }

  // Send the report.
  Raven.captureException(err, {
    extra: {
      action: action,
      state: loggedState
    }
  });

  const title = 'An error has occured'
  const body = `Error was logged with ID ${Raven.lastEventId()}. Please reference it when reaching support.`

  /* Show error dialog -- recoverable == API ERROR */
  if (recoverable) {
    store.dispatch({
      type: 'UI_SHOW_INFO_DIALOG',
      payload: {
        title: `${title}`,
        content: body,
        okButton: true,
        cancel: () => store.dispatch({type: 'UI_HIDE_INFO_DIALOG'})
      }
    })
  } else {
    const modalHtml = `
      <div>
        <div role="dialog">
          <div class="modal-backdrop fade in"></div>
          <div style="display:block;" class="fade in modal" role="dialog" tabindex="-1">
            <div class="modal-window modal-dialog" >
              <div class="modal-content" role="document">
                <div class="modal-header">
                  <h1>${title}</h1>
                </div>
                <div class="modal-body">
                  <p>${body}</p>
                </div>
                <div class="modal-footer">
                <div class="pull-right btn-toolbar" role="toolbar">
                  <a class="btn btn-primary" href="/">OK</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`

    const errContainer = document.getElementById('unrecoverable-error-container')
    errContainer.innerHTML = modalHtml
  }
}
