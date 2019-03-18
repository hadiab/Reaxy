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

Create main store

```
import { createStore } from 'reaxy'
const store = createStore({})

```

Adding module to the store

```
const counter = {
  state: {
    count: 0
  }
}

const store = createStore({
  counter: counter
})

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