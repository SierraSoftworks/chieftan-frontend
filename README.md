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
folder on your server. It is worth noting that, should you wish to make use of the HTML5 Push State API for nice
URLs, you will need to configure your web server to serve the `index.html` file for all 404s.

With nginx this can easily be accomplished using the `try_files` directive.

### Example NGINX Configuration
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
