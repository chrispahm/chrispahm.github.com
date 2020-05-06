---
title: Optional chaining arrives with ES2020
preview: >
  'Uncaught TypeError&#58; Cannot read property' is known to be the most common JavaScript error. With the new 'optional chaining' feature in the upcoming ES2020, avoiding this error becomes a lot easier.
keywords:
  - JavaScript
date: '05.06.2020'
---

# Accessing deeply nested data

Getting an `Uncaught TypeError: Cannot read property` error in JavaScript has happened to me too many times. The error has even been ranked the [most frequent JavaScript error](https://rollbar.com/blog/top-10-javascript-errors/). Especially when working with external data sources 
this can be problem.
Consider the following example from the [harmonie](https://github.com/fruchtfolge/harmonie) project, which parses agricultural field data from various input files (mostly `XML`):

```js
let applicationYear
// try to access the application year from the farm subsidy form
try {
  applicationYear = data['fsv:FSV']['fsv:FSVHeader']['commons:Antragsjahr']
} catch (e) {
  // no application year found -> go on as it is optional anyway
}
```
The `try...catch` block will now capture the error thrown when a property cannot be read. We could see this as 'defensive code', as we can't trust the input data and have to consider missing properties in the nested tree. Instead of repeating the `try..catch` block for every variable I have been using the following function in the past (e.g. in the [ELAN-Paser](https://github.com/fruchtfolge/elan-parser/blob/master/index.js#L17)):

```js
function getSafe(func) {
  try {
    return func()
  } catch (e) {
    return ''
  }
}

const applicationYear = getSafe(() => data['fsv:FSV']['fsv:FSVHeader']['commons:Antragsjahr'])
// applicationYear is either the correct applicationYear from the data object OR undefined
```

This shortens the amount of code to write every time you are unsure whether a property exists in an object or not.
While it is not much extra code, it is still repetitive and the function needs to be imported/defined in every new project. With the JavaScript standard ES2020, we don't need this anymore.

## A better way with optional chaining introduced with ES2020

With the [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) feature introduced in ES2020, we don't need to define a `getSafe` function first, but can rather rely on native methods:

```js
const applicationYear = data['fsv:FSV']?.['fsv:FSVHeader']?.['commons:Antragsjahr']
// applicationYear is either the correct applicationYear from the data object OR undefined
```

Awesome, isn't it? As of today, all up to date versions of modern browsers (Chrome,Firefox,Edge,Safari,Opera) [support optional chaining](https://caniuse.com/#feat=mdn-javascript_operators_optional_chaining). If you need support for older browsers, there also is a [babel plugin](https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining) as well.

## Uncaught TypeErrors that cannot be solved by optional chaining

Another classic example for getting the error is by misspelling a property name in a nested object:
```js
const field = {
  properties: {
    cropCode: 415
  }
}

// misspelling key 'properties'
const cropCode = field.propetries.cropCode 
// will thrown: Uncaught TypeError...
```

Obviously, this cannot be solved by optional chaining, as the information is not optional. Using [TypeScript](https://www.typescriptlang.org/) would have saved me from this error many times, however as of right now I'm just too lazy to set it up and annotate all of my code properly. Maybe in the not so distant future I will give it a try...

