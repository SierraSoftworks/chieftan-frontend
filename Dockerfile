FROM nginx:alpine

MAINTAINER Benjamin Pannell <admin@sierrasoftworks.com>

ARG VERSION
LABEL version=${VERSION:-development}

COPY dist/* /usr/share/nginx/html/

HEALTHCHECK --interval=5s --timeout=1s \
    CMD curl -f http://localhost/index.html || exit 1
