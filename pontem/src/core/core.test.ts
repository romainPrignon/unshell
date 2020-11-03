import { Pontem } from './core'

describe('pontem', () => {
  it('should return a function', () => {
    const pontem = Pontem()

    expect(pontem).toBeInstanceOf(Function)
  })
})
