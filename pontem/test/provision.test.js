const { Pontem } = require('../dist/core')

const apt = {
  update: () => `apt update`
}

function* install_xdebug () {
  yield `wget -c "https://xdebug.org/files/xdebug-2.5.5.tgz"`
  yield `tar -xf xdebug-2.5.5.tgz`
  yield `cd xdebug-2.5.5 && phpize`
  yield `cd xdebug-2.5.5 && ./configure`
  yield `cd xdebug-2.5.5 && make && make install`
}

function* test_install () {
  yield `php -v`
}

function* provision_dev_machine () {
    // might be in function
  yield apt.update()

    // might be inline
  yield `apt install -y wget`

    // might be multiline
  yield `apt install -y \
        htop \
        wget
    `

    // install php
  yield `add-apt-repository ppa:ondrej/php -y`
  yield `apt update`
  yield `apt install -y php7.1-cli php7.1-dev`

    // abstract some complicated package install
  yield* install_xdebug()
  yield* test_install()
}

// use something more robust like dotenv
const env = {
  LANG: 'en_US.UTF-8'
}

Pontem({ output: true, verbose: true, env })(provision_dev_machine)
