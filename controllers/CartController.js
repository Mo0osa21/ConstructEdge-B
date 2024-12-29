const { Cart, Product } = require('../models')

const GetCart = async (req, res) => {
  try {
    const userId = req.user.id
    const cart = await Cart.findOne({ user: userId }).populate(
      'products.product'
    )

    if (!cart) {
      return res.status(404).send({ msg: 'Cart is empty' })
    }

    res.status(200).send(cart)
  } catch (error) {
    console.error('Error fetching cart:', error)
    res.status(500).send({ error: 'Failed to fetch cart' })
  }
}

const AddToCart = async (req, res) => {
  try {
    const { products } = req.body // Array of products
    const userId = req.user.id

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .send({ msg: 'Products array is required and cannot be empty.' })
    }

    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({ user: userId, products: [], totalPrice: 0 })
    }

    for (const { product, quantity, price } of products) {
      // Ensure cart.products is an array
      if (!Array.isArray(cart.products)) {
        cart.products = []
      }

      const existingProductIndex = cart.products.findIndex((item) => {
        // Check if the item has a valid product field
        return item.product && item.product.toString() === product
      })

      if (existingProductIndex > -1) {
        // Update quantity and price for the existing product
        cart.products[existingProductIndex].quantity += quantity
        cart.products[existingProductIndex].price += price * quantity
      } else {
        // Add the new product to the cart
        cart.products.push({
          product,
          quantity,
          price
        })
      }

      // Update total price
      cart.totalPrice += price * quantity
    }

    // Save the updated cart
    await cart.save()

    res.status(200).send({ msg: 'Products added to cart', cart })
  } catch (error) {
    console.error('Error adding product to cart:', error)
    res.status(500).send({ error: 'Failed to add products to cart' })
  }
}

const UpdateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const userId = req.user.id

    let cart = await Cart.findOne({ user: userId }).populate('products.product')

    if (!cart) {
      return res.status(404).send({ msg: 'Cart not found' })
    }

    const productInCart = cart.products.find(
      (item) => item.product._id.toString() === productId
    )
    if (!productInCart) {
      return res.status(404).send({ msg: 'Product not found in cart' })
    }

    productInCart.quantity = quantity
    productInCart.price = quantity * productInCart.product.price

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.price, 0)

    await cart.save()
    res.status(200).send(cart)
  } catch (error) {
    console.error('Error updating cart item:', error)
    res.status(500).send({ error: 'Failed to update cart item' })
  }
}

const RemoveCartItem = async (req, res) => {
  try {
    const userId = req.user.id
    const { productId } = req.params

    let cart = await Cart.findOne({ user: userId })

    if (!cart) {
      return res.status(404).send({ msg: 'Cart not found' })
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    )

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.price, 0)

    await cart.save()
    res.status(200).send(cart)
  } catch (error) {
    console.error('Error removing cart item:', error)
    res.status(500).send({ error: 'Failed to remove cart item' })
  }
}

module.exports = {
  AddToCart,
  GetCart,
  UpdateCartItem,
  RemoveCartItem
}
