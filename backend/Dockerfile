FROM node:20-slim

RUN apt-get update && apt-get install -y \
    python3 python3-pip ffmpeg \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

RUN pip3 install yt-dlp --break-system-packages

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x ./node_modules/.bin/tsc && npx tsc

EXPOSE 3333

CMD ["node", "dist/index.js"]