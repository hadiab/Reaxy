import produce from 'immer'

/**
 * Get module name from path
 */
const getModuleName = (path) => {
  return path.trim().split('/')[0]
}

/**
 * mapping the store into state and actions and effects
 */
export const mapStore = (modules) => {
  const initialState = {}
  const actions = {}
  const effects = {}
  
  // Map modules and create initial state object & actions object
  for(let module in modules) {
    initialState[module] = modules[module].state

    for(let action in modules[module].actions) {
      actions[`${module}/${action}`] = modules[module].actions[action]
    }

    for(let effect in modules[module].effects) {
      effects[`${module}/${effect}`] = modules[module].effects[effect]
    }
  }

  // create actions and pass the nested state and then return the new state 
  const createAction = (state, action) => {
    if(!action.type) return state

    if(action.type in actions) {
      const newState = produce(state, draft => {
        const moduleName = getModuleName(action.type)
        actions[action.type](draft[moduleName], action.payload)
      })
      return newState
    } else {
      return state
    }
  }

  return {
    initialState,
    actions: (state, action) => createAction(state, action),
    effects
  }
}