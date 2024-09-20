FROM node:lts AS development
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm ci
COPY . /app
ENV CI=true
ENV PORT=3000
CMD ["npm", "start"]

FROM development AS build
RUN npm install @rollup/rollup-linux-x64-gnu --save-dev
RUN npm run build:no-eslint

FROM nginx:alpine
COPY /var/jenkins_home/workspace/ecommerce-fashion-fe/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
