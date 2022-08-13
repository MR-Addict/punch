FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -ci
COPY . .
CMD ["node", "app.js"]