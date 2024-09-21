
FROM node:lts AS development
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm ci
COPY . /app
ENV CI=true
ENV PORT=3000
CMD ["npm", "run", "dev"]

FROM node:lts AS build
RUN npm install @rollup/rollup-linux-x64-gnu --save-dev
RUN npm run build:no-eslint
FROM nginx:alpine AS deploy
COPY --from=build /app/dist /usr/share/nginx/html  

EXPOSE 80
