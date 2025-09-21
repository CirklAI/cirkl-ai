FROM node:22-bookworm

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

RUN npm run build

EXPOSE 9501
ENV PORT=9501

CMD ["npm start"]