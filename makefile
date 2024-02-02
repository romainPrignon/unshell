install:
	./bin/batect -f ops/batect.yml --config-vars-file ops/batect.local.yml install

compile: install
	./bin/batect -f ops/batect.yml --config-vars-file ops/batect.local.yml compile

lint: install
	./bin/batect -f ops/batect.yml --config-vars-file ops/batect.local.yml lint

test: install
	./bin/batect -f ops/batect.yml --config-vars-file ops/batect.local.yml test

publish: install
	npm publish --provenance

ci: install compile lint test

cd: install publish

buildx:
	docker buildx build --progress=plain -t unshell .

into:
	docker exec -it unshell bash
