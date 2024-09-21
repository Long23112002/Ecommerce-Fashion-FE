# Giai đoạn 1: Xây dựng ứng dụng
FROM node:16-alpine AS build
WORKDIR /frontend
COPY ./package.json ./
COPY . .
RUN npm install && npm run build:no-eslint

# Giai đoạn 2: Phục vụ ứng dụng bằng Nginx
FROM nginx
COPY --from=build /frontend/build /usr/share/nginx/html
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
