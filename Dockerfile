FROM node:latest

# Prepare ubuntu
ENV DEBIAN_FRONTEND noninteractive
RUN ln -sf /bin/bash /bin/sh

# Configure standard environment
WORKDIR /root/app

COPY ./ /root/app/

# Install supervisord
RUN apt-get update
RUN apt-get install -y supervisor nano
RUN mkdir -p /var/log/supervisor
CMD /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
COPY ./docker/supervisor.conf /etc/supervisor/conf.d/

ONBUILD RUN npm config set @types:registry https://registry.npmjs.org && \
			npm install -q && \
			npm cache clean

# build
ONBUILD RUN npm run build

EXPOSE 3000