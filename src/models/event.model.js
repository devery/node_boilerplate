import mongoose from 'mongoose'
import constants from '../constants'

const eventSchema = new mongoose.Schema({
  type: { type: String, enum: Object.values(constants.events), required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  count: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model('Event', eventSchema)
