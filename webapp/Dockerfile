FROM node:20-alpine AS builder

WORKDIR /app

COPY webapp/package*.json ./

RUN npm ci

COPY webapp/ ./

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

COPY webapp/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 