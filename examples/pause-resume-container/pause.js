/**
 * Pause all running container
 */
module.exports = function * pause () {
  const ids = yield * fetchContainerIds()

  for(const id of ids) {
    yield `docker pause ${id}`
  }
}

function * fetchContainerIds () {
  const ids = yield `docker ps -q --no-trunc`

  return ids.split('\n').filter(Boolean)
}
