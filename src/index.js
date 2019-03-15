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
    const modelName = getModelName(action.type)
    const newState = actions[action.type](state[modelName], action)
    return { ...state, [modelName]: newState }
  }

  return {
    initialState,
    actions: (state, action) => createAction(state, action),
  }
}

export const createStore = (models) => {
  const mappedStore = mapStore(models)

  let state = mappedStore.initialState
  const store = {}
  const subscribes = []

  // Get the store state
  store.getState = () => state

  // Store dispatch
  store.dispatch = (action) => {
    console.log(action)
    state = mappedStore.actions(state, action)
    subscribes.forEach(subscribe => subscribe(state))
  }

  // Store subscribe
  store.subscribe = (fn) => {
    subscribes.push(fn)
    console.log('Subscribe to store', subscribes)

    return () => {
      const index = subscribes.indexOf(fn)
      if(index > -1) {
        subscribes.splice(index, 1)
        console.log('Unsubscribe from store', subscribes)
      } 
    }
  }

  return store
}