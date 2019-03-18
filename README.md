# Reaxy

React easy state managment with hooks

[![npm version](https://img.shields.io/npm/v/redux.svg?style=flat-square)](https://www.npmjs.com/package/reaxy)

### Installing

Install with npm

```
npm install --save reaxy
```

Install with yarn

```
yarn add reaxy
```

## Getting started

Create the main store

```js
import { createStore } from 'reaxy'
const store = createStore({})

```

Adding module to the store
Each module has state, actions and effects

```js
const module = {
  state: {},
  actions: {},
  effects: {}
}

const store = createStore({
  moduleName: module
})

```

Passing the store to the provider that wrap our app

```jsx
import { Provider } from 'reaxy'

<Provider store={store}>
  // Application...
</Provider>
```
### useStore
Using the store with the useStore hook

```js
import { useStore } from 'reaxy'

const store = useStore()
```

Example

```jsx
// Module
const counter = {
  state: {
    count: 0
  }
}

// Create store
const store = createStore({ counter })

// Using the store
const App = () => {
  const store = useStore()

  return <div>{store.counter.count}</div>
}

// Wrap our app with provider and passing it the store
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('app'))
```

### useDispatch
dispatching an action with useDispatch hook

First Define an action in the module
You can mutate the state directly, and the magic of immer.js will create new immutable state

```js
const counter = {
  state: {
    count: 0
  },
  increment(state) {
    state.count++
  }
}
```

Then in the component
the dispatch type will be '[moduleName]/[actionName]'

```js
import { useDispatch } from 'reaxy'

const dispatch = useDispatch()

dispatch({ type: 'counter/increment' })
```

## Running the tests

Clone the project then run

```
npm run dev
```

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Abdalhadi Abdallah** - *Initial work* - [hadiab](https://github.com/hadiab)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details