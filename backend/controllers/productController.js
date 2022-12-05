import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler' // async error handler


// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler (async(req, res) => {
    const products  = await Product.find({});
    res.json(products);
})


// @desc Fetch single products
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler (async(req, res) => {
    const product = await Product.findById(req.params.id);

    if(product){
        res.json(product);
        console.log(product)
    }else{
        // id must be a formatted id and not found
        res.status(404);
        throw new Error('Product not found'); // custom error handler --> errorMiddleware.js
    }
})

// @desc Delete a product
// @route DELETE /api/products/:id
// @access Private/admin
const deleteProduct = asyncHandler (async(req, res) => {
    const product = await Product.findById(req.params.id);

    if(product){
        await product.remove()
        res.json({ message: 'Product removed'})
    }else{
        // id must be a formatted id and not found
        res.status(404);
        throw new Error('Product not found'); // custom error handler --> errorMiddleware.js
    }
})

// @desc Create a product
// @route POST /api/products
// @access Private/admin
const createProduct = asyncHandler (async(req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body
    const product = new Product({
        name,
        price,
        user: req.user._id,
        image,
        brand,
        category,
        countInStock,
        numReviews: 0,
        description,
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

// @desc Update a product
// @route PUT /api/products/:id
// @access Private/admin
const updateProduct = asyncHandler (async(req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body

    const product = await Product.findById(req.params.id)

    if(product){
        product.name = name
        product.price = price
        product.image = image
        product.description = description
        product.brand = brand
        product.category = category
        product.countInStock = countInStock
        
        const updatedProduct = await product.save()
        res.status(201).json(updateProduct)
    }else{
        res.status(404);
        throw new Error('Product not found');
    }
})



export{
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
}