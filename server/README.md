# Devery Node.js backend boilerplate

## This repository contains necessary packages for developing app with Devery integration

### This application is using MongoDB. Be sure you have it. You can run it with Docker for development.
```
docker run --name name -p 27017:27017 -d mongo
```

### Also you will need SendGrid account for creating registration confirming mails.

### Running server

1) Clone this repo
2) Type `npm install`
3) Create `.env` file which contains following text

```
API_PREFIX=/api
CORS=true
FORCE_BOOTSTRAP_DATA=true/false
JWT_SECRET=
JWT_VALID_DAYS=1
MAIL_CONFIRMATION_SUBJECT=
MAIL_FROM=
MAIL_FROM_NAME=
MONGODB_URI=mongodb://localhost:27017/devery
PASSWORDS_REQUIRED_LENGTH=
PORT=4444
SENDGRID_API_KEY=
MAIL_TEMPLATE_ID_REG=
SITE_URL=
INFURA_API_KEY=
INFURA_NET=ropsten
WALLET_PRIVATE_KEY=
WALLET_ID=
```

4) FORCE_BOOTSTRAP_DATA -> `true` to seed database
5) type `npm run dev`
6) Try email `test@devery.devery` and password `12345678` for login after seeding
