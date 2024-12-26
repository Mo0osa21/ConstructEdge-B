const router = require('express').Router()
const controller = require('../controllers/PostController')
const middleware = require('../middleware')

router.post(
  '/add',
  middleware.stripToken,
  middleware.verifyToken,
  controller.AddToCart
)

module.exports = router
