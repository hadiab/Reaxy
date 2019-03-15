import { createStore } from '.'

/**
 * Models
 */
const counter = {
  state: {
    count: 0
  },
  actions: {
    increment(state) {
      return { ...state, count: state.count + 1 }
    }
  }
}

const user = {
  state: {
    name: 'hadiab',
    email: 'hadiab@gmail.com'
  }
}

/**
 * Use the store
 */
const store = createStore({ counter, user })

const unsubscribe = store.subscribe((state) => {
  console.log('Store Change', state)
})

console.log(store)
console.log(store.getState())

store.dispatch({ type: 'counter/increment' })

store.dispatch({ type: 'counter/increment' })

unsubscribe()
