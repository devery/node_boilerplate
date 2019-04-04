import app from './bootstrap/app'
//
import db from './bootstrap/db'
import api from './bootstrap/api'
import tasks from './bootstrap/tasks'
import devery from './services/devery'

db(app)
api(app)
tasks(app)
devery.init()
