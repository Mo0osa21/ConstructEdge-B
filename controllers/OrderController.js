const { Order, Cart } = require('../models')

const GetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('products.product')
    res.status(200).send(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).send({ error: 'Failed to fetch orders' })
  }
}

const GetUserOrders = async (req, res) => {
  try {
    const userId = req.user.id
    const orders = await Order.find({ user: userId }).populate(
      'products.product'
    )
    res.status(200).send(orders)
  } catch (error) {
    console.error('Error fetching user orders:', error)
    res.status(500).send({ error: 'Failed to fetch user orders' })
  }
}

const UpdateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    const validStatuses = [
      'Pending',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled'
    ]
    if (!validStatuses.includes(status)) {
      return res.status(400).send({ msg: 'Invalid status' })
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    )
    if (!order) {
      return res.status(404).send({ msg: 'Order not found' })
    }

    res.status(200).send({ msg: 'Order status updated', order })
  } catch (error) {
    console.error('Error updating order status:', error)
    res.status(500).send({ error: 'Failed to update order status' })
  }
}

const PlaceOrder = async (req, res) => {
  try {
    const userId = req.user.id // Get the user ID from the JWT token
    const cart = await Cart.findOne({ user: userId }) // Find the user's cart

    // Check if cart is empty
    if (!cart || cart.products.length === 0) {
      return res
        .status(400)
        .send({ msg: 'Cart is empty. Cannot place an order.' })
    }

    // Create a new order based on the cart
    const newOrder = await Order.create({
      user: userId,
      products: cart.products,
      totalPrice: cart.totalPrice,
      orderDate: new Date(),
      status: 'pending' // Set the initial status of the order
    })

    // Clear the cart after placing the order
    cart.products = [] // Remove all products from the cart
    cart.totalPrice = 0 // Reset total price
    await cart.save() // Save the updated cart

    // Send response with the newly created order
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
  GetAllOrders,
  GetUserOrders,
  PlaceOrder,
  UpdateOrderStatus
}
