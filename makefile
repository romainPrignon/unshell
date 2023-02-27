install:
	./bin/batect -f ops/batect.yml --config-vars-file ops/batect.local.yml install

compile: install
	./bin/batect -f ops/batect.yml --config-vars-file ops/batect.local.yml compile

lint: install
	./bin/batect -f ops/batect.yml --config-vars-file ops/batect.local.yml lint

test: install
	./bin/batect -f ops/batect.yml --config-vars-file ops/batect.local.yml test

publish: install
	./bin/batect -f ops/batect.yml --config-vars-file ops/batect.local.yml --config-var npm_token=${NPM_TOKEN} publish

ci: install compile lint test

cd: install publish
