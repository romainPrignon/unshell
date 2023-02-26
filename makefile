setup:
	./bin/batect setup

install:
	batect -f ops/batect.yml --config-vars-file ops/batect.local.yml install

compile: install
	batect -f ops/batect.yml --config-vars-file ops/batect.local.yml compile

lint: install
	batect -f ops/batect.yml --config-vars-file ops/batect.local.yml lint

test: install
	batect -f ops/batect.yml --config-vars-file ops/batect.local.yml test

ci: install compile lint test
