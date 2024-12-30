const { Product } = require('../models')

const GetProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('category', 'name description')
    res.status(200).send(products)
  } catch (error) {
    throw error
  }
}

const GetProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate('category', 'name description')
    res.status(200).send(product)
  } catch (error) {
    throw error
  }
}

const CreateProduct = async (req, res) => {
  try {
    const product = await Product.create({ ...req.body })
    res.status(200).send(product)
  } catch (error) {
    throw error
  }
}

const UpdateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      {
        new: true
      }
    );
    res.status(200).send(product);
  } catch (error) {
    throw error;
  }
}

const DeleteProduct = async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.params.productId })
    res.status(200).send({
      msg: 'Product Deleted',
      payload: req.params.productId,
      status: 'Ok'
    })
  } catch (error) {
    throw error
  }
}

module.exports = {
  GetProducts,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  GetProduct
}
