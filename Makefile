.PHONY: dev test deploy-contracts clean services-up services-down

services-up:
	docker-compose up -d postgres redis

services-down:
	docker-compose down

dev: services-up
	pnpm dev

test:
	pnpm test

deploy-contracts:
	cd blockchain && npx hardhat run scripts/deploy.ts --network mumbai

clean:
	find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
	find . -name "dist" -type d -prune -exec rm -rf '{}' +
	find . -name ".turbo" -type d -prune -exec rm -rf '{}' +
