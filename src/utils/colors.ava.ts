import ava from 'ava'

import { red, green } from './colors'


ava('should render red ANSI colored text', (t) => {
  const text = `my text`
  t.is(red(text), `\x1b[31m${text}\x1b[0m`)
})

ava('should render green ANSI colored text', (t) => {
  const text = `my text`
  t.is(green(text), `\x1b[32m${text}\x1b[0m`)
})
