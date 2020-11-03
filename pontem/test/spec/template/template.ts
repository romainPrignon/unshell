const mytemplate = (name: string) => `
  ; Last modified 15 July 2010 by Juan Dona
  [owner]
  name=juan ${name || 'foo'}
  organization=romainprignon
`

const template = function* template () {
  yield `echo "${mytemplate('romain')}" >> config.ini`
}

module.exports = template
