const router = require('express').Router()
const controller = require('../controllers/CartController')
const middleware = require('../middleware')

router.get(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetCart
)

router.put(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdateCartItem
)

router.delete(
  '/:productId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.RemoveCartItem
)

router.post(
  '/add',
  middleware.stripToken,
  middleware.verifyToken,
  controller.AddToCart
)

module.exports = router
