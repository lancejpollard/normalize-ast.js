
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
for (let a in x) { console.log(a) }
for (let a in x.y) { console.log(a) }
for (let a in x.y().z) { console.log(a) }
for (let a of x.y().z) { console.log(a) }
const x7 = { y }
const a12 = b.c
const a13 = b[c]
const a14 = 1 + 2
const a15 = y().z + z().y
const a16 = () => console.log('asdf')
const a17 = () => {
  console.log('asdf')
}
const a18 = () => {
  if (x) { y() }
}
const a19 = () => []
const a20 = () => ({})
const a21 = () => ({ foo: 'bar' })
const a22 = () => ({ foo: y().z })
const a23 = new X
const a24 = new X(1, a())
new X(1)
new A.X(g(h(i)))
function a25() {
  function b() {
    console.log('c')
  }
}
const x11 = {
  foo() {
    console.log(g().x)
  },
  bar() {
    console.log(g().x)
  }
}
class W {
  a(x, y) {
    return w()[x] + y
  }
}

function print(t) {
  console.log(n.print(n.normalize(n.parse(t[0]))))
}

this.a
const x12 = this.a
const x13 = this[a]
const x14 = { ...a }
const x15 = { ...x().a, foo: { ...bar() } }
const x16 = [ ...a ]
const x17 = [ [ ...a().y, { ...x().z } ] ]
function x18(...m) { console.log(m) }
function x19(a = 1, ...w) { console.log(w) }
a.forEach(x => x + 1)
a[0](x => x().y + 1)
a(x + b)()
let x100, y100 = 10
while (x) { break }
while (x) { console.log(y) }
w2:
while (x.y().z) { console.log(y) }
{
  const a = b.x
}
b3:
{
  const b4 = b().x
}
const b80 = b().x
for (let i = 0; i < array.length; i++) {
  console.log(i)
}
const b81 = /foo/g
const b82 = \`foo\`
let a100 = 10
const b83 = \`foo$\{a100\} bar $\{b82\}\`
const b84 = \`foo\$\{a().x().y[z]\}bar\`
const b85 = a\`x\`
a\`x\`
a().b\`foo \$\{bar(baz().x)\}\`
function k(a, b, c, d, e, f, g) {
  a = h(a, h(h(b & c | ~b & d, e), g));
  return h(a << f | a >>> 32 - f, b)
}
for (c = 0; 3 >= c; c++) d = a >>> 8 * c & 255, d = "0" + d.toString(16), b += d.substr(d.length - 2, 2);
`

function print(t) {
  console.log(n.print(n.normalize(n.parse(t[0]))))
}
