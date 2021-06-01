FROM node:12

WORKDIR /var/www/crawler

COPY . .

RUN npm i

ENTRYPOINT ["npm", "start"] 
