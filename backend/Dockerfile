FROM golang:1.23.5-alpine AS builder
WORKDIR /build
COPY . .
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o api ./cmd/api

FROM alpine:latest
WORKDIR /app
COPY --from=builder /build/api .
RUN chmod +x ./api
EXPOSE 8080
CMD ["./api"]