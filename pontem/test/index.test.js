const { Pontem } = require('../dist/core')

const GREEN_COLOR = '$(tput setaf 2)'
const NO_COLOR = '$(tput sgr0)'

const colorfull = (mine) => `echo with color mine ${GREEN_COLOR}${mine}${NO_COLOR} and ${GREEN_COLOR}$(${msg()})${NO_COLOR} and without $(${barMsg()})`

const msg = () => `echo $(${barMsg()})`

const barMsg = () => `echo bar`

function* multiline (params) {
  yield `
        echo "this is first line"
        echo "hello ${params}"
        echo =================
        uptime
        echo ==================
        echo "this is last line"
    `
}

function* splitline () {
  yield `docker images \
        --digests > /dev/null`
}

function* stream () {
  // yield `while sleep 1; do echo boo; done`
}

function* echo12345 () {
  yield `echo 1`
  yield `echo 2`
  yield `echo 3`
  yield `echo 4`
  yield `echo 5`
}

const echoEnv = () => `echo $FOO`

function* testEnv () {
  yield `echo $PATH`
  yield echoEnv()
}

function* deepestGen () {
  yield `echo deepest`
}
function* deeperGen () {
  yield* deepestGen()
}
function* testInnerGen () {
  yield* deeperGen()
}

function* goDeeper () {
  yield `boo`
}

function* testError () {
  yield* goDeeper()
}

function* testIf (dummyBoolean) {
  yield `if ${dummyBoolean}; then echo yes; else echo no; fi`
  yield dummyBoolean ? `echo yes` : `echo no`
}

function ls () { return `ls -lah` }
function grepGit () { return `grep .git` }
function cat () { return `cat` }

function* testPipe () {
  yield `ls -lah | grep .git | cat`

  const displayGitRelatedFolder = pipe(ls, grepGit, cat)
  yield displayGitRelatedFolder()
}

const emptyString = () => ``
function* testEmpty () {
  yield `echo foo`
  yield emptyString()
  yield `echo foo`
}
const testEmpty2 = () => ``

function* redirection () {
  // =======================
  yield `echo bar > foo.txt`
  yield `cat foo.txt`
  yield `rm foo.txt`

  // =======================

  yield `echo "touch fiz" >> fs.sh`
  yield `echo "ls" >> fs.sh`
  yield `echo "rm fiz" >> fs.sh`
  yield `chmod a+x fs.sh`

  yield `./fs.sh` // actual exec inner script

  yield `rm fs.sh`

  // =======================

  yield `ls > ls.txt`
  yield `wc -l < ls.txt`
  yield `rm ls.txt`

  // =======================

  yield `undefined_cmd 2>&1 | tee error.log`
  yield `cat error.log`
  yield `rm error.log`
}

function* cd () {
  yield `cd /home/romainprignon/workspace && ls`
}

function* testInterrupt () {
  yield `echo "try to interrupt me"`
  yield `sleep 3`
  yield `echo "echo after 3"`
}

const containers = () => `docker ps`
const createContainer = (name) => `docker run -dit --name ${name} ubuntu /bin/bash`
const removeContainer = (name) => `docker stop ${name} && docker rm ${name}`
const dockerExec = (containerName, cmd, env) => `docker exec -t -e ${env} ${containerName} ${cmd}`

function* createAbstraction () {
  yield createContainer('foo')
  yield createContainer('bar')
}

function* removeAbstraction () {
  yield removeContainer('foo')
  yield removeContainer('bar')
}

function* createMultipleContainers () {
  yield* createAbstraction()
  yield containers()
  yield* removeAbstraction()
}

function* removeGoogleMachine (name) {
  yield `docker-machine rm -f ${name}`
  yield `gcloud compute firewall-rules delete machine-${name}--tcp-in--2377`
  yield `gcloud compute firewall-rules delete machine-${name}--udp-in--4789`
  yield `gcloud compute firewall-rules delete machine-${name}--udp-in--7946`
  yield `gcloud compute firewall-rules delete machine-${name}--tcp-in--7946`
}

function* createGoogleMachine (name) {
  yield `docker-machine create ${name} \
        --driver=google \
        --google-project=rp-171015 \
        --google-zone=europe-west3-b \
        --google-machine-type=n1-standard-1 \
        --google-machine-image=https://www.googleapis.com/compute/v1/projects/ubuntu-os-cloud/global/images/family/ubuntu-1604-lts \
        --google-disk-size=10 \
        --google-tags=machine,${name}`

  yield `gcloud compute firewall-rules create machine-${name}--tcp-in--2377 --allow tcp:2377 --target-tags=${name} --source-ranges=0.0.0.0/0`
  yield `gcloud compute firewall-rules create machine-${name}--udp-in--4789 --allow udp:4789 --target-tags=${name} --source-ranges=0.0.0.0/0`
  yield `gcloud compute firewall-rules create machine-${name}--udp-in--7946 --allow udp:7946 --target-tags=${name} --source-ranges=0.0.0.0/0`
  yield `gcloud compute firewall-rules create machine-${name}--tcp-in--7946 --allow tcp:7946 --target-tags=${name} --source-ranges=0.0.0.0/0`
}

function* createMachine (driver, name) {
  switch (driver) {
    case 'google': {
      yield* createGoogleMachine(name)

      return 0
    }
    default: {
      yield `echo "(createMachine) can't create machine"`

      return 1
    }
  }
}

function* swarmInit (manager) {
  yield `docker-machine ssh ${manager} sudo docker swarm init --advertise-addr $(docker-machine ip ${manager})`
}

function* swarmManagerJoin (rootManager, manager, managerToken) {
  yield `docker-machine ssh ${manager} \
        "sudo docker swarm join \
            --token ${managerToken} \
            $(docker-machine ip ${rootManager})"`
}

function* swarmWorkerJoin (rootManager, worker, workerToken) {
  yield `docker-machine ssh ${worker} \
	    "sudo docker swarm join \
	        --token ${workerToken} \
	        --listen-addr $(docker-machine ip ${worker}) \
	        --advertise-addr $(docker-machine ip ${worker}) \
	        $(docker-machine ip ${rootManager}):2377"`
}

const getManagerToken = (manager) => `docker-machine ssh ${manager} "sudo docker swarm join-token manager -q"`

const getWorkerToken = (manager) => `docker-machine ssh ${manager} "sudo docker swarm join-token worker -q"`

function* create () {
  yield* createMachine('google', 'stack-name--prod--mngr-1')
  yield* createMachine('google', 'stack-name--prod--mngr-2')
  yield* createMachine('google', 'stack-name--prod--wrkr-1')

  yield* swarmInit('stack-name--prod--mngr-1')
  const managerToken = yield getManagerToken('stack-name--prod--mngr-1')
  const workerToken = yield getWorkerToken('stack-name--prod--mngr-1')

  yield* swarmManagerJoin('stack-name--prod--mngr-1', 'stack-name--prod--mngr-2', managerToken)
  yield* swarmWorkerJoin('stack-name--prod--mngr-1', 'stack-name--prod--wrkr-1', workerToken)
}

function* remove () {
  yield* removeGoogleMachine('stack-name--prod--mngr-1')
  yield* removeGoogleMachine('stack-name--prod--mngr-2')
  yield* removeGoogleMachine('stack-name--prod--wrkr-1')
}

// ============= async ===============
const longEcho = async (params) => new Promise((resolve, reject) => {
  setTimeout(() => resolve(`echo coucou ${params}`), 1000)
})

const asyncFn = async (params) => longEcho(params)

const asyncFn2 = (params) => [`echo ${params}`, `echo 2 ${params}`]
function* asyncGen (params) {
  const [res1, res2] = yield [`echo ${params}`, `echo 2 ${params}`]
  console.log(res1, res2)
}

const race1 = () => `sleep 5 && echo "sleep for 5s"`
const race2 = () => `sleep 2 && echo "sleep for 2s"`
function* testRace () {
  yield [race1(), race2()]
}

function* gen0 () {
  yield `sleep 5`
  yield `echo "echo after 5s"`
}
function* gen1 () {
  yield [gen0()]
}
function* gen2 () {
  yield `sleep 2`
  yield `echo "echo after 2s"`
}
function* testParallelGen () {
  yield `echo begin`
  yield [gen1(), gen2()]
  yield `echo end`
}

// ============= ssh ===================
const testSSH = () => `uptime`

function* generatorAsSSH (params) {
  yield `echo Hello ${params}`
  yield `uptime`
  yield `echo bye`
}

function* parallelSSH () {
  yield [`uptime`, `hostname`]
}

const main = () => {
  //   Pontem({output: true, verbose: true})(colorfull, 'romain')
  //   Pontem({output: true, verbose: true})(multiline, 'romain')
  //   Pontem({output: true, verbose: true})(splitline)
  //   Pontem({output: true, verbose: true})(stream)
  Pontem({ output: true, verbose: true })(echo12345)

  //   Pontem({output: true, verbose: true, env: {FOO: 'romain'}})(testEnv)

  //   Pontem({output: true, verbose: true})(createMultipleContainers)

  //   Pontem({output: true, verbose: true})(testInnerGen)
  //   Pontem({output: true, verbose: true})(testError)
  //   Pontem({output: true, verbose: true})(testIf, true)
  //   Pontem({output: true, verbose: true})(testPipe, true)
  //   Pontem({output: true, verbose: true})(testEmpty, true)
  //   Pontem({output: true, verbose: true})(testEmpty2, true)
  //   Pontem({output: true, verbose: true})(redirection, true)
  //   Pontem({output: true, verbose: true})(cd)
  //   Pontem({output: true, verbose: true})(testInterrupt)

  //   Pontem({output: true, verbose: true})(create)
  //   Pontem({output: true, verbose: true})(remove)

  //   Pontem({output: true, verbose: true})(asyncFn, 'romain')
  //   Pontem({output: true, verbose: true})(asyncFn2, 'romain')
  //   Pontem({output: true, verbose: true})(asyncGen, 'romain')
  //   Pontem({output: true, verbose: true})(testRace)
  //   Pontem({output: true, verbose: true})(testParallelGen)

  //   Pontem({output: true, verbose: true, ssh: true})(testSSH)
  //   Pontem({output: true, verbose: true, ssh: true})(generatorAsSSH, 'romain')
  //   Pontem({output: true, verbose: true, ssh: true})(parallelSSH)
}

main()
