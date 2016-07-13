FROM nginx:alpine

MAINTAINER Benjamin Pannell <admin@sierrasoftworks.com>

COPY doc/nginx/nginx.conf /etc/nginx/nginx.conf

ARG VERSION
LABEL version=${VERSION:-development}

COPY dist/* /src/chieftan/

HEALTHCHECK --interval=5s --timeout=1s \
    CMD curl -f http://localhost/index.html || exit 1
