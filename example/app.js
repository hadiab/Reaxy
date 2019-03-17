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
    },
    decrement(state) {
      return { ...state, count: state.count - 1 }
    }
  },
  effects: {
    asyncIncrement: async (dispatch) => {
      console.log('Async Increment')
      dispatch({ type: 'counter/decrement' })
      await setTimeout(() => {
        dispatch({ type: 'counter/increment' })
      }, 2000)
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
  console.log('Count', store.getState().counter.count)
  const countDiv = document.getElementById('count')
  countDiv.innerHTML = store.getState().counter.count
})

console.log(store)
console.log(store.getState())

document.getElementById('btn-inc').addEventListener('click', () => {
  store.dispatch({ type: 'counter/increment' })
})

document.getElementById('btn-dec').addEventListener('click', () => {
  store.dispatch({ type: 'counter/decrement' })
})

document.getElementById('btn-inc-async').addEventListener('click', () => {
  store.dispatch({ type: 'counter/asyncIncrement' })
})
