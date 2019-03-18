import { createStore, Provider, useStore, useDispatch, useAction } from '../src'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

/**
 * Modules
 */

const user = {
  state: {
    name: 'hadiab',
    email: 'hadiab@gmail.com'
  },
  actions: {
    changeEmail(state) {
      return { ...state, email: 'test@test.com' }
    }
  }
}

const counter = {
  state: {
    count: 0
  },
  actions: {
    increment(state) {
      return { ...state, count: state.count + 1 }
    },
    decrement(state) {
      return { ...state, count: state.count - 1 }
    },
    reset(state, payload) {
      return { ...state, count: payload }
    }
  }
}

const posts = {
  state: {
    items: []
  },
  actions: {
    setPosts(state, posts) {
      return { ...state, items: posts }
    }
  },
  effects: {
    fetchPosts: async (dispatch) => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts')
      const data = await res.json()
      dispatch({ type: 'posts/setPosts', payload: data })
    }
  }
}

/**
 * Components
 */
const User = () => {
  const user = useStore('user')
  const dispatch = useDispatch()

  console.log('[User Component]')

  return <div>
    <h3>User</h3>
    <div>{user.email}</div>
    <button onClick={() => dispatch({ type: 'user/changeEmail' })}>Change email</button>
  </div>
}

const Counter = () => {
  const counter = useStore('counter')
  const dispatch = useDispatch()
  const increment = useAction('counter/increment')
  const reset = useAction('counter/reset')

  console.log('[Counter Component]')

  return (
    <div>
      <h3>counter</h3>
      <h1>{counter.count}</h1>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => dispatch({ type: 'counter/decrement' })}>-1</button>
      <button onClick={() => reset(0)}>Reset</button>
    </div>
  )
}

const Posts = () => {
 
  const posts = useStore('posts')
  const fetchPosts = useAction('posts/fetchPosts')

  useEffect(() => {
    fetchPosts()
  }, [])

  console.log('[Posts Component]')

  return <div>
    <h3>Posts List</h3>
    {posts.items.map(post => 
      <div key={post.id}>
        <h4>{post.title}</h4>
        <p>{post.body}</p>
      </div>)
    }
  </div>
}

const App = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <User />
          <hr />

          <Counter />
          <hr />

          <Posts />
        </div>
      </div>
    </div>
  )
}

/**
 * Use the store
 */
const store = createStore({ posts, counter, user }, { debug: true })


ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('app'))


