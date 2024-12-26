const router = require('express').Router()
const controller = require('../controllers/ProductController')
const middleware = require('../middleware')

router.get('/', controller.GetProducts)

router.get('/:productId', controller.GetProduct)

router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  controller.CreateProduct
)

router.put(
  '/:productId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdateProduct
)

router.delete(
  '/:productId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.DeleteProduct
)

module.exports = router
