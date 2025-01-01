const { Schema } = require('mongoose')

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    passwordDigest: { type: String, required: true, min: 8 },
    isAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
)

module.exports = userSchema
