import { createLogger } from '../services/logger'
import cors from 'cors'
import express from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import morgan from 'morgan'

require('dotenv').config()

const logger = createLogger('Bootstrap')
const app = express()

app.use(
  cors({
    // origin: process.env.CORS ? process.env.CORS.split(',') : [],
    origin: 'http://localhost:1234',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  })
)

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')) // requests logging
app.use(bodyParser.json({ type: '*/json', limit: '9MB' }))
app.use(bodyParser.urlencoded({ extended: false }))

const port = process.env.PORT || 4444
const server = http.createServer(app)

server.listen(port)

/***/ logger.info('App server listening on: ', port)

export default app
