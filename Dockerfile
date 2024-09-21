# Giai đoạn phát triển
FROM node:lts AS development
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV CI=true
ENV PORT=3000
CMD ["npm", "run", "dev"]

# Giai đoạn xây dựng
FROM node:lts AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
RUN npm cache clean --force
RUN npm install @rollup/rollup-linux-x64-gnu --save-dev --unsafe-perm
COPY . .
RUN npm run build:no-eslint

# Giai đoạn triển khai
FROM nginx:alpine AS deploy
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
