const router = require('express').Router()
const controller = require('../controllers/OrderController')
const middleware = require('../middleware')

router.get(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.verifyAdmin,
  controller.GetAllOrders
)

router.get(
  '/user',
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetUserOrders
)

router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  controller.PlaceOrder
)

router.put(
  '/:orderId',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.verifyAdmin,
  controller.UpdateOrderStatus
)

module.exports = router
