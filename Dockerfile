# Bước 1: Build ứng dụng frontend
FROM node:16-alpine as build

WORKDIR /frontend

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY . .

# Chạy build
RUN npm run build:no-eslint

# Tạo thư mục build nếu không tồn tại
RUN mkdir -p /frontend/build

# Kiểm tra xem thư mục build có tồn tại không
RUN ls -la /frontend/build

# Bước 2: Cấu hình Nginx
FROM nginx:latest
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy nội dung build ra Nginx
COPY --from=build /frontend/build /usr/share/nginx/html
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
