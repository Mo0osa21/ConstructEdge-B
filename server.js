const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const AuthRouter = require('./routes/AuthRouter')
const CartRouter = require('./routes/CartRouter')
const CategoryRouter = require('./routes/CategoryRouter')
const OrderRouter = require('./routes/OrderRouter')
const ProductRouter = require('./routes/ProductRouter')

const PORT = process.env.PORT || 3001

const db = require('./db')

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/auth', AuthRouter)
app.use('/products', ProductRouter)
app.use('/cart', CartRouter)
app.use('/categories', CategoryRouter)
app.use('/orders', OrderRouter)

app.use('/', (req, res) => {
  res.send(`Connected!`)
})

app.listen(PORT, () => {
  console.log(`Running Express server on Port ${PORT} . . .`)
})
