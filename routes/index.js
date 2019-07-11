var express = require('express');
var router = express.Router();

let productController = require('./product/controllers/productController')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express'});
// });

router.get('/',(req, res)=> {
  let page = req.params.page || 1
  productController.getProductByPage(req, res, page)
});

router.get('/page/:page', function(req, res, next) {
  let page = req.params.page || 1
  productController.getProductByPage(req, res, page)
})

router.get('/search', (req, res)=>{
  productController.productSearch(req, res, req.query.q)
  
})

router.post('/search', (req, res) => {
  res.redirect('/search?q=' + req.body.search)
})

router.get('/test', (req, res)=>{
  res.render('test')
})

router.post('/testJquery', (req,res)=>{
  console.log(req.body)

  res.send({result: 'success'})
})

router.get('/', (req, res)=>{
  productController.instantSearch(req, res, req.body)
  
})

router.post('/', (req, res) => {
  // res.redirect('/api/product/instant-search?q=' + req.body.keySearch)
  // res.send({result: req.body.keySearch})
})
module.exports = router;
