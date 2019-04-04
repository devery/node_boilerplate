import mongoose from 'mongoose'
import constants from '../constants'

const emailSchema = new mongoose.Schema({
  toEmail: { type: String, required: true },
  templateId: { type: String, required: true },
  substitutions: { type: Object, default: {} },
  status: {
    type: String,
    enum: Object.values(constants.emailStatuses),
    required: true,
    default: constants.emailStatuses.CREATED
  },
  attempts: { type: Number, default: 0 },
  attemptAt: { type: Date }
})

export default mongoose.model('Email', emailSchema)
