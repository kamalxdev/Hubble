FROM node:20

WORKDIR /app

COPY *.json ./
COPY ./prisma .


RUN npm install
RUN npx prisma generate --no-engine

COPY . .

RUN npx tsc

EXPOSE 4000

CMD ["node", "dist/index.js"]