const mongoose = require('mongoose')
const userSchema = require('./User')
const cartSchema = require('./Cart')
const categorySchema = require('./Category')
const orderSchema = require('./Order')
const productSchema = require('./Product')

const User = mongoose.model('User', userSchema)
const Cart = mongoose.model('Cart', cartSchema)
const Category = mongoose.model('Category', categorySchema)
const Order = mongoose.model('Order', orderSchema)
const Product = mongoose.model('Product', productSchema)

module.exports = {
  User,
  Cart,
  Category,
  Order,
  Product
}
