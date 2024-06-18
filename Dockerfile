FROM node:lts-iron

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build

CMD [ "npm", "start" ]

