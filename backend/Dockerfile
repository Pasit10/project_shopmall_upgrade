FROM golang:1.24 AS builder

WORKDIR /backend

COPY go.mod go.sum ./
RUN go mod tidy

COPY . .

RUN go build -o app .

CMD ["./app"]
