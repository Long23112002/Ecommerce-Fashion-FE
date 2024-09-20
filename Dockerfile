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
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist . 
ENTRYPOINT ["nginx", "-g", "daemon off;"]
