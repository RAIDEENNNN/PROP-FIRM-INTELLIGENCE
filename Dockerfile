FROM node:22-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev
COPY server.js ./
COPY storage.js ./
COPY index.html ./
COPY app.js ./
COPY styles.css ./
COPY assets ./assets
COPY data ./data

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
