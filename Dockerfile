# physio-backend/Dockerfile
FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

# Cloud Run expects the app to listen on the port defined by the PORT environment variable
# which defaults to 8080 if not set.
# ENV PORT 8080
EXPOSE 8080

CMD ["npm", "start"]
