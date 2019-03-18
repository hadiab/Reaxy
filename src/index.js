import React, { useContext, useEffect, useCallback, useRef } from 'react'
import { isEqual } from 'lodash'
import useForceUpdate from 'use-force-update'
import applyMiddleware from './middleware'
import { mapStore } from './helpers'

/**
 * Store context
 */
const StoreContext = React.createContext()


/**
 * Create Store
 */
export const createStore = (models, options) => {
  const mappedStore = mapStore(models)
  const store = {}
  const subscribes = []
  const middleware = applyMiddleware(options)
  let state = mappedStore.initialState

  // main dispatch function
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
      const index = subscribes.indexOf(fn)
      if(index >= 0) {
        subscribes.splice(index, 1)
      }
    }
  }

  // apply middlewares
  if (middleware) {
    const dispatch = action => store.dispatch(action)
    store.dispatch = middleware({
      dispatch,
      getState: store.getState,
      effects: mappedStore.effects
    })(coreDispatch)
  }

  // initial dispatch
  store.dispatch({})

  return store
}

/**
 * Use store hook
 */
export const useStore = (model) => {
  const store = useContext(StoreContext)
  const forceUpdate = useForceUpdate()
  const state = model ? store.getState()[model] : store.getState()
  const prevRef = useRef()

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const nextState = model ? store.getState()[model] : store.getState()
      const prevState = prevRef.current 
      if(!isEqual(prevState, nextState)) forceUpdate()
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    prevRef.current = state
  })

  return state
}

/**
 * Use dispatch hook
 */
export const useDispatch = () => {
  const store = useContext(StoreContext)
  return useCallback((action) => store.dispatch(action), [store.dispatch])
}

/**
 * Use action hook
 */
export const useAction = (type) => {
  const store = useContext(StoreContext)
  return useCallback((payload) => store.dispatch({ type, payload }), [store.dispatch])
}

/**
 * Store provider
 */
export const Provider = ({ children, store }) => {
  return <StoreContext.Provider value={store}>
    {children}
  </StoreContext.Provider>
}