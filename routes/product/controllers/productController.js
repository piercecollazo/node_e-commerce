let Product = require('../../product/models/Product')

module.exports = {
    getAllProducts: (params)=>{
        return new Promise((resolve, reject)=>{
            Product.find(params)
                .then(products =>{
                    resolve(products)
                })
                .catch(error => {
                    let errors = {}
                    errors.status = 500
                    errors.message = error
                    reject(errors)
                })
        })
    },
    getProductByID: (id)=>{
        return new Promise((resolve, reject)=>{
            Product.findById(id)
                .then(products =>{
                    resolve(products)
                })
                .catch(error => {
                    let errors = {}
                    errors.status = 500
                    errors.message = error
                    reject(errors)
                })
        })
    },
    getProductByCategoryID: (id)=>{
        return new Promise((resolve, reject)=>{
            Product.find(id)
                .populate('category')
                .exec()
                .then(products =>{
                    resolve(products)
                })
                .catch(error => {
                    let errors = {}
                    errors.status = 500
                    errors.message = error
                    reject(errors)
                })
        })
    },
    getProductByPage:(req, res, page)=>{
        let perPage = 9
        Product.find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function(err, products) {
                Product.count().exec(function(err, count) {
                    if (err) return next(err)
                    res.render('index', {
                        products: products,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            })
    },
    productSearch:(req, res, search)=>{
        return Product.search({query_string:{query: search}}, (error, results)=>{
            if(error){
                let errors = {}
                errors.status = 500
                errors.message = error

                console.log('errors: ' + errors)
            } else {
                res.render('search', {products: results.hits.hits})
            }
            
        })
    },
    instantSearch:(req, res, search)=>{
        return Product.search({query_string:{query: search}}, (error, results)=>{
            if(error){
                let errors = {}
                errors.status = 500
                errors.message = error

                console.log('errors: ' + errors)
            } else {
                res.render('/search/instant-search', {products: results.hits.hits})
            }
            
        })
    }
}