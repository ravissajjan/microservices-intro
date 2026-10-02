# Build recipe for the recommendations image. Identical to catalog's - only the port differs.

FROM node:22-alpine
WORKDIR /app
COPY server.js ./
EXPOSE 3003
CMD ["node", "server.js"]
