FROM node:23-bullseye AS api

WORKDIR /app
COPY package.json .
RUN npm install

COPY . .

RUN npm run build

COPY entrypoint.sh /app/entrypoint.sh

# Fix line endings for entrypoint.sh
RUN sed -i 's/\r$//' /app/entrypoint.sh

# port exposed on the container to connect from outside
EXPOSE 8080

RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"] 

RUN npm install -g serve