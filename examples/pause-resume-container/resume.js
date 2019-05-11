/**
 * Resume all running container
 */
module.exports = function * resume () {
  const ids = yield * fetchContainerIds()

  for(const id of ids) {
    yield `docker unpause ${id}`
  }
}

function * fetchContainerIds () {
  const ids = yield `docker ps -q --no-trunc`

  return ids.split('\n').filter(Boolean)
}
