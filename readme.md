
# Normalize a JS AST

```
$ node test
const x = y
x
x = y
x.z = y
a.b = c.d
a[x]
a[x.y]
a[x.y[y.z][q.r]]
a[x.y[y.z][q.r]] = y
a()
a(y)
a(x, y)
a(x.y)
a(x.y[y.z])
const tmp0 = x()
a(tmp0)
const tmp1 = x.y()
a(tmp1)
const tmp2 = x.y[z]()
a(tmp2)
const tmp3 = z(w)
const tmp4 = x.y[tmp3]()
a(tmp4)
const tmp5 = z(w)
const tmp6 = x.y[tmp5]()
const tmp7 = a(tmp6)
x = tmp7
const tmp8 = x()
const tmp9 = y()
tmp8.a = tmp9.b
const tmp10 = x()
const tmp11 = y()
tmp10[a] = tmp11[b]
a = x || y
a = x.y || y.z
const tmp12 = c()
const tmp13 = x(tmp12)
const tmp14 = y()
a = tmp13.y || tmp14.z
a = x >>> y
x = a ? b : c
const tmp15 = g(h)
const tmp16 = y(tmp15)
x = a ? tmp16 >>> z : c
tmp17 = y
a = tmp17.a
b = tmp17.b
const tmp18 = g()
const tmp19 = y(tmp18[z])
tmp20 = tmp19.x
a = tmp20.a
b = tmp20.b
c = tmp20.c
const a = x.a
const b = x.b
let w = x.y.w
let z = x.y.z
function p() {
}
function p2(x) {
  console.log(x)
}
function p3(x = y) {
  console.log(x)
}
function p4(x = y.z) {
  console.log(x)
}
const tmp21 = y.z()
function p5(x = tmp21) {
  console.log(x)
}
function p6(x) {
  const tmp22 = x.a()
  return tmp22.z > y
}
function p7(a, b, c) {
}
if (x) {
  y()
}
if (x) {
  y()
} else {
  z[a.b]()
}
if (a) {
  y()
} else if (b) {
  z()
} else if (c) {
  w()
}
if (x.y) {
  y()
}
const tmp23 = x.y()
if (tmp23.z) {
  y()
}
const tmp24 = b.y()
if (x) {
  y()
} else if (tmp24.z) {
  z()
}
if (x) {
  const tmp25 = y()
  tmp25.z
} else {
  const tmp25 = z()
  tmp25.y
}
const a1 = 10
const a2 = 'foo'
const a3 = true
const a4 = null
const a5 = {}
const o1 = {
  foo: 'bar'
}
const o2 = {
  a: b
}
const tmp25 = b()
const tmp26 = e(f)
const tmp27 = tmp26.g()
const o3 = {
  a: tmp25.c,
  d: tmp27.h
}
const a6 = []
const a7 = [
  1,
  b,
  'three'
]
const a8 = [
  {}
]
const a9 = [
  {
  a: 10
}
]
const a10 = [
  {
  a: [
  []
]
}
]
const tmp28 = foo()
const a11 = i ? [
  1
] : [
  tmp28.bar
]
```
