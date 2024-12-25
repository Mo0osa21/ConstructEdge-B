const { Schema } = require('mongoose')

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    passwordDigest: { type: String, required: true },
    isAdmin: { type: Boolean, default: true }
  },
  { timestamps: true }
)

module.exports = userSchema
