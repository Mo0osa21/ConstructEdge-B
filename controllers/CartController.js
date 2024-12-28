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
    const userId = req.user.id
    const { products } = req.body

    // Assume we are adding only the first product in the array
    const { product: productId, quantity } = products[0]

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
