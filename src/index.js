import applyMiddleware from './middleware'

const getModelName = (path) => {
  return path.trim().split('/')[0]
}

const mapStore = (models) => {
  const initialState = {}
  const actions = {}
  const effects = {}
  
  // Map models and create initial state object & actions object
  for(let model in models) {
    initialState[model] = models[model].state

    for(let action in models[model].actions) {
      actions[`${model}/${action}`] = models[model].actions[action]
    }

    for(let effect in models[model].effects) {
      effects[`${model}/${effect}`] = models[model].effects[effect]
    }
  }

  // create actions and pass the nested state and then return the all state 
  const createAction = (state, action) => {
    if(!action.type) return state
    
    const modelName = getModelName(action.type)

    if(action.type in actions) {
      const newState = actions[action.type](state[modelName], action)
      return { ...state, [modelName]: newState }
    }
  }

  return {
    initialState,
    actions: (state, action) => createAction(state, action),
    effects
  }
}

/**
 * Create Store
 */
export const createStore = (models) => {
  const mappedStore = mapStore(models)

  let state = mappedStore.initialState
  const store = {}
  const subscribes = []
  const middleware = applyMiddleware()

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
      getState: store.getState,
      effects: mappedStore.effects
    })(coreDispatch)
  }

  store.dispatch({})

  return store
}