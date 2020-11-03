import { colorOneTime, colorTwoTime } from './color'

describe('MODULE Color', () => {
  it('should display Hello World in green', () => {
    // When
    const it = colorOneTime()

    // Then
    let next = it.next()
    expect(next.value).toEqual(`echo "display $(tput setaf 2)Hello World$(tput sgr0) in green"`)
    expect(next.done).toEqual(false)
  })

  it('should display 2 message in two colors', () => {
    // When
    const it = colorTwoTime()

    // Then
    let next = it.next()
    expect(next.value).toEqual(`echo "display $(tput setaf 2)Hello World$(tput sgr0) in green"`)
    expect(next.done).toEqual(false)

    next = it.next()
    expect(next.value).toEqual(`echo "display $(tput setaf 1)Hello Yourself$(tput sgr0) in red"`)
    expect(next.done).toEqual(false)

    next = it.next()
    expect(next.done).toEqual(true)
  })
})
