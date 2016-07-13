# Chieftan Frontend
**An Aurelia web application which consumes the Chieftan API for task automation**

## Getting Started
To get a development environment set up, you will need [Node.js](https://nodejs.org/) installed on your local
machine. You can download it from [here](https://nodejs.org/en/download/).

Once that's done, clone the Chieftan repository and run `npm install` to install the various
dependencies required by Chieftan.

## Development
The development environment is built around WebPack with Hot Module Reloading enabled, allowing (near) realtime
updates of both stylesheets and code (if it hasn't been run yet) without a page reload. You can start the development
server by running `npm run server:dev` from the project folder and then accessing `http://localhost:3002` in your
browser.

## Deployment
Deployment involves building a production package of the application and then placing the contents of the `dist`
folder on your server. To build the production package, simply run `npm build` and wait for WebPack to complete.

If you wish to enable Sentry error reporting for frontend errors, you should set the `SENTRY_DSN` environment
variable to a public Sentry DSN. You may also tag the release version by setting the `VERSION` environment variable.

### Example Build Script
```sh
SENTRY_DSN="https://abcdef@getsentry.com/1" VERSION="$(git rev-parse HEAD)" npm run build
```

This build script will tag the release using the current Git SHA and configure Sentry error
reporting.

### Nice URLs
It is worth noting that, should you wish to make use of the HTML5 Push State API for nice
URLs, you will need to configure your web server to serve the `index.html` file for all 404s.

With nginx this can easily be accomplished using the `try_files` directive.

#### Example NGINX Configuration
```
server {
  listen :80 default;
  hostname chieftan.emss.co.za;

  root /var/www/chieftan/dist;

  # Serve the frontend
  location / {
    try_files $url $url.html index.html;
  }

  # Pass API requests to the application instance (basic)
  location /api {
    proxy_pass http://127.0.0.1:8000;
  }
}
```

## Docker Images
You may also deploy the Chieftan frontend using Docker, to build the image simply
run `npm build && docker build .` to build a container image with the latest compiled
application package.

This container is based on `nginx:alpine`, making it very lightweight, and will listen
on port 80 by default. You can follow the instructions on the
[NGINX Docker Image](https://hub.docker.com/_/nginx/) page to configure it differently,
or place it behind a reverse proxy in production deployments.
