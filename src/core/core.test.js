const { unshell } = require('../../dist/core')

// list des tests
// fn must be generator
// generator must yield string

function* fn (arg1, arg2) {
  yield `echo hello ${arg1} from ${arg2} !`
  yield `echo Bonjour ${arg1} de la part de ${arg2} !`
}

const res = unshell(fn)('Bob', 'Alice')


// describe('unshell', () => {
  // describe('should only accept generator as fn', () => {
    // it.only('should accept the generator function', () => {
      // const res = unshell(fn)('Bob', 'Alice')
    // })
    // it('should reject the non-generator function', () => {
    // })
  // })
//
// })
