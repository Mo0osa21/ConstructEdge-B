const { Product } = require('../models')
const { Order } = require('../models')
const { Cart } = require('../models')

const GetProducts = async (req, res) => {
  try {
    const filter = {}
    if (req.query.category) {
      filter.category = req.query.category
    }
    const products = await Product.find(filter).populate('category')
    res.status(200).send(products)
  } catch (error) {
    throw error
  }
}

const GetProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate(
      'category'
    )
    res.status(200).send(product)
  } catch (error) {
    throw error
  }
}

const CreateProduct = async (req, res) => {
  try {
    const product = await Product.create({ ...req.body })
    res.status(200).send(product)
  } catch (error) {
    throw error
  }
}

const UpdateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      {
        new: true
      }
    )
    res.status(200).send(product)
  } catch (error) {
    throw error
  }
}

const DeleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId

    const isInOrder = await Order.findOne({ 'products.productId': productId })
    if (isInOrder) {
      return res.status(400).send({
        msg: 'Product cannot be deleted as it exists in an order.',
        status: 'Error'
      })
    }

    const isInCart = await Cart.findOne({
      'products.product': productId
    })
    if (isInCart) {
      return res.status(400).send({
        msg: 'Product cannot be deleted as it exists in an active cart.',
        status: 'Error'
      })
    }

    await Product.deleteOne({ _id: productId })
    res.status(200).send({
      msg: 'Product deleted successfully',
      payload: productId,
      status: 'Ok'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).send({
      msg: 'Failed to delete product. Please try again later.',
      status: 'Error'
    })
  }
}

module.exports = {
  GetProducts,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  GetProduct
}
