# QRPiPay Docker Pipeline Makefile

.PHONY: help conception dev build test scan push deploy monitor full clean

APP_NAME = qrpipay
DOCKER_USERNAME ?= portraitart1
VERSION = 1.0.0

help:
	@echo "QRPiPay Docker Pipeline"
	@echo ""
	@echo "Available commands:"
	@echo "  make conception  - Validate docker-compose structure"
	@echo "  make dev         - Start development with hot-reload"
	@echo "  make build       - Build Docker images (multi-platform)"
	@echo "  make test        - Run tests in containers"
	@echo "  make scan        - Security scan with Docker Scout"
	@echo "  make push        - Build and push to Docker Hub"
	@echo "  make deploy      - Deploy to Render"
	@echo "  make monitor     - Monitor running containers"
	@echo "  make full        - Complete pipeline"
	@echo "  make clean       - Clean up images and containers"

conception:
	@echo "🔍 Validating Docker Compose configuration..."
	docker-compose config
	@echo "✓ Configuration is valid"

dev:
	@echo "🚀 Starting development with hot-reload..."
	docker-compose up --watch

build:
	@echo "🏗️  Building Docker images for $(DOCKER_USERNAME)/$(APP_NAME)..."
	./deploy-pipeline.sh build

test:
	@echo "🧪 Running tests..."
	./deploy-pipeline.sh test

scan:
	@echo "🔐 Security scanning..."
	./deploy-pipeline.sh scan

push:
	@echo "📦 Building and pushing to Docker Hub..."
	./deploy-pipeline.sh push

deploy:
	@echo "🚀 Deploying to Render..."
	./deploy-pipeline.sh deploy

monitor:
	@echo "📊 Monitoring containers..."
	./deploy-pipeline.sh monitor

full:
	@echo "🔄 Running complete pipeline..."
	./deploy-pipeline.sh full

clean:
	@echo "🧹 Cleaning up..."
	docker-compose down -v
	docker image prune -f
	docker volume prune -f
	@echo "✓ Cleanup complete"

# Quick commands
logs:
	@docker-compose logs -f

ps:
	@docker-compose ps

stats:
	@docker stats

rebuild:
	@docker-compose build --no-cache

restart:
	@docker-compose restart
