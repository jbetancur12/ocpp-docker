### DEV

build-dev:
	cd frontend && $(MAKE) build-dev
	cd backend && $(MAKE) build

run-dev:
	docker compose -f docker-compose-dev.yml up

### LOCAL (prod config)

build-local:
	cd frontend && $(MAKE) build-local
	cd backend && $(MAKE) build

run-local:
	ENV=local docker-compose -f docker-compose-production.yml up
		

### PROD

build-production:
	cd frontend && $(MAKE) build-production
	cd backend && $(MAKE) build	

run-production:
	ENV=production docker-compose -f docker-compose-production.yml up
	
stop:
	docker compose down


### REMOTE

SSH_STRING:=ocpp@64.227.10.58

ssh:
	ssh $(SSH_STRING)


# apt install make

copy-files:
	scp -r ./* $(SSH_STRING):/ocpp/test

# when you add firewall rule, have to add SSH on port 22 or it will stop working

# run challenge with cloudflare on flexible, then bump to full