import ava from 'ava'
import sinon from 'sinon'
import td from 'testdouble'

// mock
import * as unshell from './unshell'
import path from 'path'

// test
import { red } from './utils/colors'
import { cli } from './cli'


// let sandbox: sinon.SinonSandbox

// ava.beforeEach(() => {
//     sandbox = sinon.createSandbox()
// })

// ava.afterEach.always(() => {
//     sandbox.restore()
// })

// we need serial with sinon !!!!
ava.serial('should display error if called with no script', async (t) => {
  // const path = require('path')
  const sandbox = sinon.createSandbox()

  // Arrange
  const argv: Array<string> = ['node', 'unshell', 'run']
  const env: NodeJS.ProcessEnv = {}

  // Mock
  const error = new Error('path-error')
  const consoleStub = sandbox.stub(console, 'error').returns()
  sandbox.stub(path, 'resolve').throws(error)

  // Assert
  try {
    await cli({ argv, env })
  } catch (output) {
    t.is(output, error)
    t.true(consoleStub.calledOnceWith(`${red('✘')} unshell: Invalid SCRIPT_PATH`))
  } finally {
    sandbox.restore()
    t.pass()
  }
})

ava.serial('should display error if called with a script that is not unshell compatible', async (t) => {
  // const path = require('path')
  const sandbox = sinon.createSandbox()

  // Arrange
  const scriptPath = `${__dirname}/../fixtures/scripts/notCompatibleCmd.js`
  const argv: Array<string> = ['node', 'unshell', 'run', scriptPath]
  const env: NodeJS.ProcessEnv = {}

  // Mock
  const error = new Error('some-error')
  // const consoleStub = sandbox.stub(console, 'error').returns()
  // sandbox.stub(unshell, 'assertUnshellScript').throws(error)
  sandbox.stub(path, 'resolve').returns(scriptPath)

  // Assert
  try {
    await cli({ argv, env })
  } catch (output) {
    t.is(output, error)
    // t.true(consoleStub.calledOnceWith(`${red('✘')} ${error.message}`))
  } finally {
    sandbox.restore()
    t.pass()
  }

})

// test with testdouble
ava('should display error if called with no script TESTDOUBLE', async (t) => {
  // Arrange
  const argv: Array<string> = ['node', 'unshell', 'run']
  const env: NodeJS.ProcessEnv = {}

  // Mock
  const error = new Error('path-error')
  const consoleStub = td.replace(console, 'error')
  td.replace(path, 'resolve', () => { throw error })

  // Assert
  try {
    await cli({ argv, env })
  } catch (output) {
    t.is(output, error)
    td.verify(consoleStub(`${red('✘')} unshell: Invalid SCRIPT_PATH`))
  } finally {
    td.reset()
    t.pass()
  }
})

// test with testdouble
ava.serial('should display error if called with a script that is not unshell compatible TEST DOUBLE', async (t) => {
  // Arrange
  const scriptPath = `${__dirname}/../fixtures/scripts/notCompatibleCmd.js`
  const argv: Array<string> = ['node', 'unshell', 'run', scriptPath]
  const env: NodeJS.ProcessEnv = {}

  // Mock
  const error = new Error('some-error')
  const consoleStub = td.replace(console, 'error')
  td.replace(unshell, 'assertUnshellScript', () => { throw error })
  td.replace(path, 'resolve', () => scriptPath)

  // Assert
  try {
    await cli({ argv, env })
  } catch (output) {
    t.is(output, error)
    td.verify(consoleStub(`${red('✘')} ${error.message}`))
  } finally {
    td.reset()
    t.pass()
  }

})

// ava('should display error if called with error in script', async () => {
//   // Arrange
//   const scriptPath = `${__dirname}/../fixtures/scripts/onlyReturnCmd.js`
//   const argv: Array<string> = ['node', 'unshell', 'run', scriptPath]
//   const env: NodeJS.ProcessEnv = {}

//   // Mock
//   const error = new Error('some-error')

//   const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation()
//   jest.spyOn(unshell, 'unshell').mockImplementation(() => { throw error })
//   jest.spyOn(unshell, 'assertUnshellScript').mockImplementation(() => { return true })
//   jest.spyOn(path, 'resolve').mockImplementation(() => { return scriptPath })


//   // Assert
//   await expect(cli({ argv, env })).rejects.toThrow(error)

//   const msg = consoleErrorMock.mock.calls[0][0].trim()
//   expect(msg).toEqual(`${red('✘')} unshell: something went wrong`)
// })

// ava('should execute script on "run" command', async () => {
//   // Arrange
//   const scriptPath = `${__dirname}/../fixtures/scripts/onlyReturnCmd.js`
//   const argv: Array<string> = ['node', 'unshell', 'run', scriptPath]
//   const env: NodeJS.ProcessEnv = {}

//   // Mock
//   jest.spyOn(console, 'error').mockImplementation()
//   jest.spyOn(unshell, 'unshell').mockImplementation(() => async () => { return })
//   jest.spyOn(unshell, 'assertUnshellScript').mockImplementation(() => { return true })
//   jest.spyOn(path, 'resolve').mockImplementation(() => { return scriptPath })

//   // Assert
//   await expect(cli({ argv, env })).resolves.toEqual(undefined)
//   expect(console.error).not.toHaveBeenCalled()
// })

// ava('should display help if called with nothing', async () => {
//   // Arrange
//   const argv: Array<string> = ['node', 'unshell']
//   const env: NodeJS.ProcessEnv = {}

//   // Mock
//   jest.spyOn(console, 'log').mockImplementation()

//   // Assert
//   await expect(cli({ argv, env })).resolves.toEqual(undefined)
//   expect(console.log).toHaveBeenCalled()
// })

// ava('should display help on "help" command', async () => {
//   // Arrange
//   const argv: Array<string> = ['node', 'unshell', 'help']
//   const env: NodeJS.ProcessEnv = {}

//   // Mock
//   jest.spyOn(console, 'log').mockImplementation()

//   // Assert
//   await expect(cli({ argv, env })).resolves.toEqual(undefined)
//   expect(console.log).toHaveBeenCalled()
// })
