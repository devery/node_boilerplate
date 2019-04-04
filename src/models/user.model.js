import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false },
  phone: { type: String, required: false },
  title: { type: String, required: false }
})

export default mongoose.model('User', userSchema)
