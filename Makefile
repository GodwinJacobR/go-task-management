# Variables
DOCKER_COMPOSE = docker-compose

up:
	$(DOCKER_COMPOSE) down &&
	$(DOCKER_COMPOSE) build --no-cache &&
	$(DOCKER_COMPOSE) up -d

