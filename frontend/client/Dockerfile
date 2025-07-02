# Usa una versión más reciente de Node.js
FROM node:14-alpine

WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Limpia caché de npm e instala dependencias con más verbosidad
RUN npm cache clean --force && \
    npm install --verbose --no-optional

# Copia el resto del código
COPY . .

# Expone el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]