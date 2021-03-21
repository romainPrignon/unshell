import ava from 'ava'
import sinon from 'sinon'

import { pipe } from './pipe'


ava('should return a function', (t) => {
  const f1 = sinon.fake()

  const output = pipe(f1)

  t.assert(output instanceof Function)
})

ava('should return empty string on call with no args', (t) => {
  const f1 = sinon.fake()

  const output = pipe(f1)()

  t.is(output, ``)
})

ava(`should return "echo hello world" string on call with one arg`, (t) => {
  const f1 = sinon.spy((param) => `echo ${param}`)

  const output = pipe(f1)(`hello world`)

  t.is(output, `echo hello world`)
})

ava(`should return "echo hello world | grep world" string on call with two fn`, (t) => {
  const f1 = sinon.spy((param) => `echo ${param}`)
  const f2 = sinon.spy(() => `grep world`)

  const output = pipe(f1, f2)(`hello world`)

  t.is(output, `echo hello world | grep world`)
})
