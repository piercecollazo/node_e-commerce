const express = require('express');
const router = express.Router();
let Category = require('../product/models/Category')
let categoryController = require('../admin/controllers/categoryController')
let categoryValidator = require('./utils/categoryValidator')
let Product = require('../product/models/Product')
let createProductController = require('./controllers/createProductController')

router.get('/add-category', (req, res)=>{
    res.render('product/add-category', {errors:req.flash('errors'), success: req.flash('addCategorySuccess')})
})

router.post('/add-category', categoryValidator,(req, res)=>{

    categoryController.add(req.body)
        .then(newCategory => {
            req.flash('addCategorySuccess', `Added ${category.name}`)

            res.redirect('/api/admin/add-category')
        })
        .catch(error => {
            req.flash('errors', error.message)

            res.redirect('/api/admin/add-category')
        })
})

router.get('/get-all-categories', (req, res)=>{
    categoryController.getAllCategories(req, res)
})

router.get('/create-fake-product/:categoryName/:categoryID', createProductController.createProductByID)

module.exports = router