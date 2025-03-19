.PHONY: backend frontend build remove fullremove

backend:
	cd ./backend && go run main.go

frontend:
	cd ./frontend && npm run dev

build:
	docker-compose up -d --build

remove:
	docker-compose down

fullremove:
	docker-compose down -v