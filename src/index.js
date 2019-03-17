const getModelName = (path) => {
  return path.trim().split('/')[0]
}

const mapStore = (models) => {
  const initialState = {}
  const actions = {}
  
  // Map models and create initial state object & actions object
  for(let model in models) {
    initialState[model] = models[model].state

    for(let action in models[model].actions) {
      actions[`${model}/${action}`] = models[model].actions[action]
    }
  }

  // create actions and pass the nested state and then return the all state 
  const createAction = (state, action) => {
    if(action.type) {
      const modelName = getModelName(action.type)
      const newState = actions[action.type](state[modelName], action)
      return { ...state, [modelName]: newState }
    }
    return state
  }

  return {
    initialState,
    actions: (state, action) => createAction(state, action),
  }
}

const thunkMiddleware = ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState)
  }
  return next(action)
}

const loggingMiddleware = ({ getState }) => next => action => {
  const oldState = getState()
  next(action)
  const newState = getState()
  
  if(action.type) {
    console.groupCollapsed(action.type)
    console.info('before', oldState)
    console.info('action', action)
    console.info('after', newState)
    console.groupEnd()
  }
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

/**
 * Create Store
 */
export const createStore = (models) => {
  const mappedStore = mapStore(models)

  let state = mappedStore.initialState
  const store = {}
  const subscribes = []
  const middleware = applyMiddleware(loggingMiddleware)

  const coreDispatch = action => {
    state = mappedStore.actions(state, action)
    subscribes.forEach(subscribe => subscribe())
  }

  // Get the store state
  store.getState = () => state

  // Store dispatch
  store.dispatch = coreDispatch

  // Store subscribe
  store.subscribe = (fn) => {
    subscribes.push(fn)

    return () => {
      subscribes.filter(lis => lis !== fn)
    }
  }

  if (middleware) {
    const dispatch = action => store.dispatch(action)
    store.dispatch = middleware({
      dispatch,
      getState: store.getState
    })(coreDispatch)
  }

  store.dispatch({})

  return store
}