# Build Stage: Compiling the Go Application
FROM golang:1.24 AS builder
WORKDIR /backend

# Copy Go modules files first for better caching
COPY go.mod go.sum ./
RUN go mod download

# Copy source files for building the application
COPY main.go ./
COPY configuration/ ./configuration
COPY error/ ./error
COPY internal/ ./internal
COPY middlewares/ ./middlewares
COPY pkg/ ./pkg

# Build the Go application binary
RUN go build -o app

# Final Stage: Lightweight & Secure Debian Image
FROM debian:12-slim AS final
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && update-ca-certificates
RUN useradd -m -s /bin/bash appuser
COPY --from=builder /backend/app .
COPY .env .env
RUN chown appuser:appuser /app/.env && chmod 400 /app/.env
RUN chown -R appuser:appuser /app
USER appuser
EXPOSE 3000
CMD ["/app/app"]
