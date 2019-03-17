import applyMiddleware from './middleware'
import { mapStore } from './helpers'
 
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