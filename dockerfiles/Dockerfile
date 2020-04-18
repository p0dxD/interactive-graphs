FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

COPY static/ static/

EXPOSE 8082
CMD  echo $PUBLIC_KEY_SECRET | base64 -d > /app/public.pem \
&&  echo $PRIVATE_KEY_SECRET | base64 -d > /app/private.pem \
&&  http-server -p 8082 -S -C public.pem -K private.pem static/