# Devery Vue.js+Node.js boilerplate

## Running server

### This application is using MongoDB. Be sure you have it. You can run it with Docker for development.
```
docker run --name name -p 27017:27017 -d mongo
```

### Also you will need SendGrid account for creating registration confirming mails.

1) `cd ./server`
2) Type `npm install` or `yarn`
3) Copy `.env.example` to `.env` file and fill it
4) set FORCE_BOOTSTRAP_DATA -> `true` to seed database for a first(!) run
5) run `npm run dev` or `yarn dev`
6) Login with `test@devery.devery` and password `12345678` 


## Running client

1) `cd ./client`
2) Change ip address of server in `utilities/sdk/index.js`
3) Run `npm install` or `yarn`
4) Run development server using `npm run dev` or `yarn dev`
5) open `localhost:1234` in a browser

In case you want to build this repository use `npm run build` or `yarn build`

