const { Cart, Order } = require('../models')

const PlaceOrder = async (req, res) => {
  try {
    const userId = req.user.id

    const cart = await Cart.findOne({ user: userId })

    if (!cart || cart.products.length === 0) {
      return res
        .status(400)
        .send({ msg: 'Cart is empty. Cannot place an order.' })
    }

    const newOrder = await Order.create({
      user: userId,
      products: cart.products,
      totalPrice: cart.totalPrice,
      orderDate: new Date(),
      status: 'pending'
    })

    cart.products = []
    cart.totalPrice = 0
    await cart.save()

    res.status(201).send({
      msg: 'Order placed successfully',
      order: newOrder
    })
  } catch (error) {
    console.error('Error placing order:', error)
    res.status(500).send({ error: 'Failed to place order' })
  }
}

module.exports = {
  PlaceOrder
}
