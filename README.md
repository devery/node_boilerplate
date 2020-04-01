<p>
<img src="img/icons.png"></img>
</p>
# Devery Vue.js+Node.js boilerplate

## Running server

<img src="img/mongo.png"></img>

### This application is using MongoDB. Be sure you have it. You can run it with Docker for development.
```
docker run --name name -p 27017:27017 -d mongo
```
<a href="https://www.mongodb.com/cloud/atlas/lp/general/try?utm_source=google&utm_campaign=gs_emea_ukraine_search_brand_atlas_desktop&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=e&gclid=CjwKCAjwvOHzBRBoEiwA48i6AkqBN_QMtuRYZLJU83tyMIpKfpLCpbawbEz75WpAaSEUhVaa85JuzBoCdZ8QAvD_BwE"><img src="img/mButton.png"></img></a>
<a href="https://www.docker.com/"><img src="img/docker.png"></img></a>

### Also you will need SendGrid account for creating registration confirming mails.
</br>
<img src="img/sendGrid.png"></img>
</br>

1) `cd ./server`
2) Type `npm install` or `yarn`
3) Copy `.env.example` to `.env` file and fill it
4) set FORCE_BOOTSTRAP_DATA -> `true` to seed database for a first(!) run
5) run `npm run dev` or `yarn dev`
6) Login with `test@devery.devery` and password `12345678`

<a href="https://sendgrid.com/marketing/sendgrid-services-cro/?extProvId=5&extPu=49397-gaw&extLi=164417502&sem_adg=8807286342&extCr=8807286342-321630592703&extSi=&extTg=&keyword=sendgrid&extAP=&extMT=e&utm_medium=cpc&utm_source=google&gclid=CjwKCAjwvOHzBRBoEiwA48i6Ap2rnfCXbOP18_zZ2vkYYdySFF4o9tJduAdagUcSqQfu3ioJZ8TByBoCG6YQAvD_BwE"><img src="img/SG_bit.png"></img></a>

## Running client

1) `cd ./client`
2) Change ip address of server in `utilities/sdk/index.js`
3) Run `npm install` or `yarn`
4) Run development server using `npm run dev` or `yarn dev`
5) open `localhost:1234` in a browser

In case you want to build this repository use `npm run build` or `yarn build`

<a href="https://github.com/devery/react_boilerplate"><img src="img/rnButton.png"></img></a>
<a href="https://github.com/devery/eveplate"><img src="img/EveplateButton.png"></img></a>
<a href="https://github.com/devery/deveryjs"><img src="img/jsButton.png"></img></a>
<a href="https://github.com/devery/vue_boilerplate"><img src="img/vue_b.png"></img></a>
