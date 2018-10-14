const {pipe} = require('../../dist/utils/pipe')

describe('pipe', () => {
  it('should return a function', () => {
    const f1 = jest.fn()

    const output = pipe(f1)

    expect(output).toBeInstanceOf(Function)
  })

  it('should return empty string on call with no args', () => {
    const f1 = jest.fn()

    const output = pipe(f1)()

    expect(output).toEqual(``)
  })

  it(`should return "echo hello world" string on call with one arg`, () => {
    const f1 = jest.fn((param) => `echo ${param}`)

    const output = pipe(f1)(`hello world`)

    expect(output).toEqual(`echo hello world`)
  })

  it(`should return "echo hello world | grep world" string on call with two fn`, () => {
    const f1 = jest.fn((param) => `echo ${param}`)
    const f2 = jest.fn(() => `grep world`)

    const output = pipe(f1, f2)(`hello world`)

    expect(output).toEqual(`echo hello world | grep world`)
  })
})
