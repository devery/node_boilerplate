import mongoose from 'mongoose'
import constants from '../constants'

const confirmationSchema = new mongoose.Schema({
  type: { type: String, enum: Object.values(constants.confirmationTypes), required: true },
  data: { type: Object },
  status: {
    type: String,
    enum: Object.values(constants.confirmationStatuses),
    required: true,
    default: constants.confirmationStatuses.CREATED
  },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Confirmation', confirmationSchema)
