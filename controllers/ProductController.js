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
    const {
      name,
      description,
      price,
      discount,
      imageUrl,
      category,
      stockQuantity
    } = req.body
    const discountedPrice =
      discount > 0 ? price - (price * discount) / 100 : price

    const product = await Product.create({
      name,
      description,
      price,
      discount,
      discountedPrice,
      imageUrl,
      category,
      stockQuantity
    })

    res.status(200).send(product)
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).send({ error: 'Error creating product' })
  }
}

const UpdateProduct = async (req, res) => {
  try {
    // Destructure the fields from the request body
    const {
      name,
      description,
      price,
      discount,
      imageUrl,
      category,
      stockQuantity
    } = req.body

    // Calculate the discounted price if a discount exists
    let discountedPrice = price
    if (discount > 0) {
      discountedPrice = price - (price * discount) / 100
    }

    // Update the product, including the calculated discounted price
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        name,
        description,
        price,
        discount,
        discountedPrice, // Adding the calculated discountedPrice
        imageUrl,
        category,
        stockQuantity
      },
      {
        new: true // Ensure the updated product is returned
      }
    )

    // If the product is not found, return a 404 error
    if (!product) {
      return res.status(404).send({
        status: 'Error',
        msg: 'Product not found!'
      })
    }

    // Send the updated product as a response
    res.status(200).send(product)
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).send({
      status: 'Error',
      msg: 'An error has occurred updating the product!'
    })
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
