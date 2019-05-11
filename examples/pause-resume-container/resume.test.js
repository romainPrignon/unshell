const { resolve } = require('path')

describe('(script) resume', () => {
  it('should resume all paused containers', () => {
    let cmd
    const script = require(resolve(`${__dirname}/resume.js`))
    const it = script()

    cmd = it.next()

    while (cmd.done === false) {
      let res
      switch (cmd.value) {
        case 'docker ps -q --no-trunc': {
          expect(cmd.value).toBeTruthy() // expect command execute correctly

          res = 'sha1-1\nsha1-2' // set some fake result
        }
        case 'docker unpause sha1-1':
          expect(cmd.value).toBeTruthy() // expect command execute correctly

          res = 'OK'  // set some fake result
      }

      cmd = it.next(res)
    }
  })
})
