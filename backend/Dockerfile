# Build stage
FROM golang:1.24 AS builder
WORKDIR /backend
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o app

# Final lightweight image
FROM debian:12-slim AS final
WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates
COPY --from=builder /backend/app .
COPY .env .
EXPOSE 3000
CMD ["/app/app"]
