
# Normalize a JS AST

Here are the transformation goals:

```js
// before
function x() {
  console.log('foo')
}

// after
// (and hoists the function to the top of the scope)
const x = function() {
  console.log('foo')
}
```

```js
// before
const x = () => {
  this...
}

// after
const _this123 = this
const x = function() {
  _this123...
}
```

```js
// before
const x = function x() {

}

// after
const x = function() {

}
```

```js
// before
a ? b() : c()

// after
if (a) {
  b()
} else {
  c()
}
```

All parameters should be flattened to variable expressions.

```js
// before
if (x()) {
  y()
}

// after
const tmp123 = x()
if (tmp123) {
  y()
}
```

```js
// before
const { a, b } = z

// after
const a = z.a
const b = z.b
```

```js
// before
if ((match = x = matchers.rgb.exec(color))) {
  x += 1
}

// after
const tmp = matchers.rgb.exec(color)
x = tmp
match = tmp
if (tmp) {
  x += 1
}
```
