npm-install-all:
	cd .. && npm install

migrate-databases:
	cd ../files-api && knex migrate:latest && knex seed:run
	cd ../sessions-api && knex migrate:latest && knex seed:run
	cd ../users-api && knex migrate:latest && knex seed:run

setup:
	bash setup_converting.sh
	bash setup_global_npm_modules.sh

start-docker:
	docker-compose down && docker-compose up -d

logs-mysql:
	docker logs -f event-mysql

logs-rabbitmq:
	docker logs -f event-rabbitmq

recreate-database: migrate-databases
