import { createStore } from '../src'

/**
 * Models
 */
const counter = {
  state: {
    count: 0
  },
  actions: {
    increment(state) {
      console.log('increment action inside counter model')
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

const unsubscribe = store.subscribe(() => {
  console.log('Store Change', store.getState())
  
})

console.log(store)
console.log(store.getState())

document.addEventListener('click', () => {
  store.dispatch({ type: 'counter/increment' })
  const countDiv = document.getElementById('count')
  countDiv.innerHTML = store.getState().counter.count
})

// store.dispatch({ type: 'counter/increment' })

// store.dispatch({ type: 'counter/increment' })

// unsubscribe()
