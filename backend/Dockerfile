# Dockerfile
FROM node:18-alpine

# Arbeitsverzeichnis festlegen
WORKDIR /app

# Package-Dateien kopieren
COPY package*.json ./

# Dependencies installieren
RUN npm ci --only=production

# App-Code kopieren
COPY . .

# Build der App
RUN npm run build

# Port freigeben
EXPOSE 1337

# App starten
CMD ["npm", "start"]