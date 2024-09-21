FROM node:16-alpine as buildWORKDIR /frontend
COPY ./package.json /frontend
COPY . .
FROM nginxCOPY --from=build /frontend/build /usr/share/nginx/html
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf