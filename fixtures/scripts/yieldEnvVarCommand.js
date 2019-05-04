module.exports = function* () {
  console.log(`node: ${process.env.SOME_ENV_VAR}`)
  yield `echo $SOME_ENV_VAR`
}
