const router = require('express').Router()
const controller = require('../controllers/ProductController')
const middleware = require('../middleware')

router.get('/', controller.GetProducts)

router.get('/:product_id', controller.GetProduct)

router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  controller.CreateProduct
)

router.put(
  '/:product_id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdateProduct
)

router.delete(
  '/:product_id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.DeleteProduct
)

module.exports = router
