const { Cart, Order } = require('../models')

const AddToCart = async (req, res) => {
  try {
    const userId = req.user.id
    const { productId, quantity } = req.body

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).send({ msg: 'Product not found' })
    }

    let cart = await Cart.findOne({ user: userId })

    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity, price: product.price }],
        totalPrice: product.price * quantity
      })
    } else {
      const existingProduct = cart.products.find(
        (item) => item.product.toString() === productId
      )

      if (existingProduct) {
        existingProduct.quantity += quantity
        existingProduct.price = product.price * existingProduct.quantity
      } else {
        cart.products.push({
          product: productId,
          quantity,
          price: product.price * quantity
        })
      }

      cart.totalPrice = cart.products.reduce((sum, item) => sum + item.price, 0)
    }

    await cart.save()

    res.status(200).send({ msg: 'Product added to cart', cart })
  } catch (error) {
    console.error('Error adding to cart:', error)
    res.status(500).send({ error: 'Failed to add product to cart' })
  }
}

module.exports = {
  AddToCart
}
