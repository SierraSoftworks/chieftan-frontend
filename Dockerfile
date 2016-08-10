FROM nginx:1.11-alpine

MAINTAINER Benjamin Pannell <admin@sierrasoftworks.com>

COPY doc/nginx/nginx.conf /etc/nginx/conf.d/chieftan.conf

ARG VERSION
LABEL version=${VERSION:-development}

COPY dist/* /src/chieftan/

EXPOSE 3000
#HEALTHCHECK --interval=5s --timeout=1s \
#    CMD curl -f http://localhost:3000/index.html || exit 1
