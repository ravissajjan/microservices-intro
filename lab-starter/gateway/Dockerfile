# The gateway needs its HTML page as well as its code, so it copies a folder too.

FROM node:22-alpine
WORKDIR /app
COPY server.js ./
COPY public ./public
EXPOSE 8080
CMD ["node", "server.js"]
