
const n = require('.')

print`
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
a(x())
a(x.y())
a(x.y[z]())
a(x.y[z(w)]())
x = a(x.y[z(w)]())
x().a = y().b
x()[a] = y()[b]
a = x || y
a = x.y || y.z
a = x(c()).y || y().z
a = x >>> y
x = a ? b : c
x = a ? y(g(h)) >>> z : c;
[a, b] = y;
[a, b, c] = y(g()[z]).x
const [a, b] = x
let [w, z] = x.y
function p() {}
function p2(x) { console.log(x) }
function p3(x = y) { console.log(x) }
function p4(x = y.z) { console.log(x) }
function p5(x = y.z()) { console.log(x) }
function p6(x) { return x.a().z > y }
function p7(a, b, c) {}
if (x) { y() }
if (x) { y() } else { z[a.b]() }
if (a) { y() } else if (b) { z() } else if (c) { w() }
if (x.y) { y() }
if (x.y().z) { y() }
if (x) { y() } else if (b.y().z) { z() }
if (x) { y().z } else { z().y }
const a1 = 10
const a2 = 'foo'
const a3 = true
const a4 = null
const a5 = {}
const o1 = { foo: 'bar' }
const o2 = { a: b }
const o3 = { a: b().c, d: e(f).g().h }
const a6 = []
const a7 = [1, b, 'three']
const a8 = [{}]
const a9 = [{ a: 10 }]
const a10 = [{ a: [[]] }]
const a11 = i ? [1] : [foo().bar]
switch (x) {
  case y:
    console.log(z)
    break
}
(function(){})()
const f1 = function(){}
`

function print(t) {
  console.log(n.print(n.normalize(n.parse(t[0]))))
}
