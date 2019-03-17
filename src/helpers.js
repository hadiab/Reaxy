const getModelName = (path) => {
  return path.trim().split('/')[0]
}

/**
 * mapping the store into state and actions and effects
 */
export const mapStore = (models) => {
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