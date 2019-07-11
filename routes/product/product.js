const express = require('express');
const router = express.Router();
let Category = require('./models/Category')
let productController = require('./controllers/productController')
let Product = require('./models/Product')

Product.createMapping((error,mapping)=>{
    if(error){
        console.log('Error creating mapping')
        console.log(mapping)
    } else {
        console.log('Mapping created')
        // console.log(mapping)
    }
})

let stream = Product.synchronize()
let count = 0

stream.on('data', ()=>{
    count++
})

stream.on('close',()=>{
    console.log(`Indexed ${count} documents`)
})

stream.on('error', ()=>{
    console.log(error)
})

router.get('/', (req,res)=>{
    res.send('testing to recieve')
})

router.get('/:productID', (req, res)=>{
     productController.getProductByID(req.params.productID)
        .then(product => {
            res.render('product/product', {product: product, count: 1})
        })
        .catch((error) => {
            res.status(error.status).json(error)
          })
})

router.get('/getProductsByCategoryID/:categoryID', (req, res)=>{
    productController.getProductByCategoryID({category:req.params.categoryID})
    .then(products =>{
        res.render('index', {products: products})
    })
    .catch(error =>{
        res.status(error.status).json(error)
    })
})

router.get('/instant-search', (req, res)=>{
    productController.instantSearch(req, res, req.query.q)
    
  })
  
router.post('/instant-search', (req, res) => {
    // res.redirect('/api/product/instant-search?q=' + req.body.keySearch)
    console.log(req.body)
  })

module.exports = router