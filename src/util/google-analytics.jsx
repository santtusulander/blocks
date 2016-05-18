import ga from 'react-ga'

/**
 * Initialize React-GA
 */
ga.initialize(GA_TRACKING_ID, {
  debug: (process.env.NODE_ENV === 'development') ? true : false
});

/**
 * Logs simple page view
 */
export const LogPageView = () => {
  ga.pageview(window.location.pathname)
}
