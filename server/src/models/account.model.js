import mongoose from 'mongoose'
import constants from '../constants'

const credentialsSchema = new mongoose.Schema(
  {
    // email
    email: { type: String },
    password: { type: String },
    confirmed: { type: Boolean, default: false },
    // facebook
    fbUserId: { type: String, default: '' },
    // google
    gUserId: { type: String, default: '' },
    // twitter
    twUserId: { type: String, default: '' }
  },
  { _id: false }
)

const roleSchema = new mongoose.Schema(
  {
    type: {
      type: Number,
      enum: Object.values(constants.roles),
      required: true
    }
  },
  { _id: true }
)

const accountSchema = new mongoose.Schema({
  provider: {
    type: String,
    enum: Object.values(constants.providers),
    required: true,
    select: false
  },
  credentials: {
    type: credentialsSchema,
    required: true,
    select: false
  },
  roles: {
    type: [roleSchema],
    required: true,
    select: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Account', accountSchema)
