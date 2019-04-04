import { red, green } from './colors'

describe('colors', () => {
  describe('red', () => {
    it('should render red ANSI colored text', () => {
      const text = `my text`
      expect(red(text)).toEqual(`\x1b[31m${text}\x1b[0m`)
    })
  })

  describe('green', () => {
    it('should render green ANSI colored text', () => {
      const text = `my text`
      expect(green(text)).toEqual(`\x1b[32m${text}\x1b[0m`)
    })
  })
})
