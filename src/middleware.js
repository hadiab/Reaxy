const asyncMiddleware = ({ dispatch, getState, effects }) => next => action => {
  if (action.type in effects) {
    return effects[action.type](dispatch, getState())
  }
  return next(action)
}

const loggingMiddleware = ({ getState }) => next => action => {
  const oldState = getState()
  const result = next(action)
  const newState = getState()
  
  if(action.type) {
    console.groupCollapsed(action.type)
    console.info('before', oldState)
    console.info('action', action)
    console.info('after', newState)
    console.groupEnd()
  }

  return result
}

const applyMiddleware = (...middlewares) => store => {
  if (middlewares.length === 0) {
    return dispatch => dispatch
  }

  if (middlewares.length === 1) {
    return middlewares[0](store)
  }

  const boundMiddlewares = middlewares.map(middleware => middleware(store))
  return boundMiddlewares.reduce((a, b) => next => a(b(next)))
}

export default () => applyMiddleware(loggingMiddleware, asyncMiddleware)