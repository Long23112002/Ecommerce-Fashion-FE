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
# Cài đặt Rollup thủ công nếu cần
RUN npm install @rollup/rollup-linux-x64-gnu --save-dev

# Bỏ qua ESLint trong build
RUN npm run build:no-eslint

FROM nginx:alpine
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
