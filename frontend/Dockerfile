FROM node:lts AS builder
WORKDIR /app
COPY . .
COPY ./package.json .
COPY ./package-lock.json .
COPY ./tsconfig.json .
RUN npm install 
RUN npm run build

FROM nginx AS final
COPY --from=builder ./app/dist/ /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]