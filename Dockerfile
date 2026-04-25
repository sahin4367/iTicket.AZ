FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npm install typescript --save-dev
COPY . .
RUN npx tsc

FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY --from=builder /app/build ./build
EXPOSE 3000
CMD ["node", "build/index.js"]