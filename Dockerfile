FROM node:16-alpine
RUN apk --no-cache add curl
COPY . .
CMD [ "node", "index.js" ]