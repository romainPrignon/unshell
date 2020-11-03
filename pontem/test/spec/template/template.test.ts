// cest un test de spec, a mettre au bon endroit
// il faut aussi tester le cli unitairement
const { shell } = require('execa')

describe('cli', () => {
  it('should dont know', async () => {
    const res = await shell('ts-node src/cli/index.ts --output=true --verbose=true /home/romainprignon/workspace/romainprignon/pontem/test/spec/template/template.ts')
    console.log(res)
  })
})
